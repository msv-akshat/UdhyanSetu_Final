import ExcelJS from 'exceljs';
import fs from 'fs';
import { db } from '../config/db.js';
import path from 'path';

export const uploadFarmerExcel = async (req, res) => {
    const filePath = req.file?.path ? path.resolve(req.file.path) : null;
    const uploadedBy = req.user?.id || null;

    if (!filePath) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
        console.log("req.file:", req.file);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];

        const headerKeywords = {
            name: ['name'],
            phno: ['phone', 'phno', 'mobile'],
            mandal: ['mandal'],
            village: ['village'],
            crop: ['crop'],
            area: ['area'],
        };

        let headerRow = null;
        let headerRowIndex = 1;
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
                headerRow = rowValues;
                break;
            }
        }

        if (!headerRow) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ success: false, error: 'Header row not found or invalid format.' });
        }

        console.log("✅ Found header row at index", headerRowIndex, ":", headerRow);

        const farmers = [];

        for (let i = headerRowIndex + 1; i <= worksheet.rowCount; i++) {
            const now = new Date();
            const row = worksheet.getRow(i);
            const values = row.values.slice(1).map(cell => (cell ? String(cell).trim() : ''));

            // Skip rows like "Total Farmers", etc.
            if (values.some(val => val.toLowerCase().includes('total'))) continue;

            const name = values[headerMap.name];
            const phno = values[headerMap.phno];
            const mandal = values[headerMap.mandal];
            const village = values[headerMap.village];
            const crop = values[headerMap.crop];
            const areaVal = values[headerMap.area];

            const area = parseFloat(areaVal);

            if (!name || !phno || !mandal || !village || !crop || isNaN(area)) {
                console.log(`❌ Skipped invalid row ${i}:`, values);
                continue;
            }

            farmers.push([
                name,
                phno,
                mandal,
                village,
                crop,
                area.toFixed(2),
                'employee',
                uploadedBy,
                false,
                now,
                now,
            ]);
        }
        console.log(`✅ Parsed farmers count: ${farmers.length}`);
        console.log(farmers.slice(0, 3)); // Show sample

        if (farmers.length === 0) {
            console.error("❌ No valid farmer data found.");
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ success: false, error: 'No valid farmer data found.' });
        }

        const insertQuery = `
          INSERT INTO farmer_uploads 
            (name, phno, mandal, village, crop, area, source, uploaded_by, is_approved, created_at, updated_at)
          VALUES ?
        `;

        await db.query(insertQuery, [farmers]);

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return res.status(200).json({ success: true, message: `${farmers.length} valid farmers uploaded.` });

    } catch (err) {
        console.error('❌ Excel Upload Error:', err);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ success: false, error: 'Server error while processing Excel file.' });
    }
};
