import ExcelJS from 'exceljs';
import fs from 'fs';
import { db } from '../config/db.js';
import path from 'path';
import format from 'pg-format';

export const uploadFarmerExcel = async (req, res) => {
    const filePath = req.file?.path ? path.resolve(req.file.path) : null;
    const uploadedBy = req.user?.id || null;

    if (!filePath) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        const headerKeywords = {
            name: ['name'],
            phone: ['phone', 'phno', 'mobile', 'phone number'],
            mandal: ['mandal'],
            village: ['village'],
            crop: ['crop'],
            area: ['area'],
        };

        let headerRowIndex = -1;
        let headerMap = {};

        for (let i = 1; i <= 5; i++) {
            const rowValues = worksheet.getRow(i).values.slice(1).map(cell => String(cell).toLowerCase().trim());
            const foundMap = {};

            for (const [key, keywords] of Object.entries(headerKeywords)) {
                const colIndex = rowValues.findIndex(val =>
                    keywords.some(keyword => val.includes(keyword))
                );
                if (colIndex === -1) break;
                foundMap[key] = colIndex;
            }

            if (Object.keys(foundMap).length === Object.keys(headerKeywords).length) {
                headerRowIndex = i;
                headerMap = foundMap;
                break;
            }
        }

        if (headerRowIndex === -1) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ success: false, error: 'Header row not found or invalid format.' });
        }

        const farmers = [];
        let uploadedCount = 0;
        let skippedCount = 0;

        for (let i = headerRowIndex + 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const values = row.values.slice(1).map(cell => (cell ? String(cell).trim() : ''));

            // Skip rows like "Total Farmers", etc.
            if (values.some(val => val.toLowerCase().includes('total'))) continue;

            const name = values[headerMap.name];
            const phone = values[headerMap.phone];
            const mandal = values[headerMap.mandal];
            const village = values[headerMap.village];
            const crop = values[headerMap.crop];
            const areaVal = values[headerMap.area];
            const area = parseFloat(areaVal);
            const now = new Date();

            if (!name || !phone || !mandal || !village || !crop || isNaN(area)) {
                console.log(`❌ Skipped invalid row ${i}:`, values);
                skippedCount++;
                continue;
            }

            farmers.push([
                name,
                phone,
                mandal,
                village,
                crop,
                area.toFixed(2),
                'excel',            // source
                uploadedBy,         // uploaded_by (can be null)
                now,                // created_at
                'pending'           // status
            ]);
            uploadedCount++;
        }

        if (farmers.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ success: false, error: 'No valid farmer data found.' });
        }

        const insertQuery = format(`
            INSERT INTO farmers_pending
                (name, phone, mandal, village, crop, area, source, uploaded_by, created_at, status)
            VALUES %L
            ON CONFLICT (phone) DO NOTHING
        `, farmers);

        await db.query(insertQuery);
        if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);

        return res.status(200).json({
            success: true,
            message: `${uploadedCount} farmers uploaded successfully.`,
            uploadedCount,
            skippedCount,
            totalFarmers: uploadedCount + skippedCount
        });

    } catch (err) {
        console.error('❌ Excel Upload Error:', err);
        if (filePath && fs.existsSync(filePath)) await fs.promises.unlink(filePath);
        return res.status(500).json({ success: false, error: 'Server error while processing Excel file.' });
    }
};
