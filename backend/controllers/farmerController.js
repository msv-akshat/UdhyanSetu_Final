// controllers/farmerController.js
import { db } from '../config/db.js';
import ExcelJS from 'exceljs'

export const registerFarmer = async (req, res) => {
  let { name, phno, mandal, village, crop, area } = req.body;

  // Trim input
  name = name?.trim();
  phno = phno?.trim();
  mandal = mandal?.trim();
  village = village?.trim();
  crop = crop?.trim();

  // Convert and validate area
  const parsedArea = parseFloat(area);
  if (!name || !phno || !mandal || !village || !crop || isNaN(parsedArea) || parsedArea <= 0) {
    return res.status(400).json({ success: false, error: 'All fields are required and area must be a valid number > 0' });
  }

  try {
    // Check for duplicate phone number
    const [existing] = await db.query('SELECT * FROM farmers WHERE phno = ?', [phno]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Phone number already exists' });
    }

    // Insert farmer
    const query = 'INSERT INTO farmers (name, phno, mandal, village, crop, area) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(query, [name, phno, mandal, village, crop, parsedArea.toFixed(2)]);

    return res.status(201).json({ success: true, message: 'Farmer registered successfully' });
  } catch (err) {
    console.error('Error registering farmer:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


export const getTotalArea = async (req, res) => {
  const mandal = req.body.mandal.trim();
  const village = req.body.village.trim();
  const crop = req.body.crop.trim();

  console.log('Filtering for:', { mandal, village, crop });

  try {
    const [rows] = await db.query(
      'SELECT SUM(area) AS totalArea, COUNT(*) AS countFarmers FROM farmers WHERE mandal = ? AND village = ? AND crop = ?',
      [mandal, village, crop]
    );

    console.log('Query result:', rows);
    res.json({ totalArea: rows[0].totalArea || 0, countFarmers: rows[0].countFarmers || 0 });
  } catch (error) {
    console.error('Error in getTotalArea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadFarmerData = async (req, res) => {
  const { mandal, village, crop } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT name, phno, mandal, village, crop, area FROM farmers WHERE mandal = ? AND village = ? AND crop = ?',
      [mandal.trim(), village.trim(), crop.trim()]
    );

    const totalArea = rows.reduce((sum, row) => sum + parseFloat(row.area || 0), 0);
    const countFarmers = rows.length;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Farmer Data');

    // Title + summary rows
    worksheet.addRow([`Farmer Report for: ${mandal} - ${village} (${crop})`]).font = { bold: true, size: 14 };
    worksheet.addRow([]); // Spacer

    // Header row
    const header = ['S.no', 'Name', 'Phone Number', 'Mandal', 'Village', 'Crop', 'Area (hectares)'];
    worksheet.addRow(header);

    // Add farmer rows
    rows.forEach((row, index) => {
      worksheet.addRow([
        index + 1,
        row.name,
        row.phno,
        row.mandal,
        row.village,
        row.crop,
        row.area
      ]);
    });

    worksheet.addRow([]);

    worksheet.addRow([
      '', // Leave S.No blank
      '', // Name blank
      '', // Phone blank
      '', // Mandal blank
      '', // Village blank
      'Total Farmers:', countFarmers
    ]);

    worksheet.addRow([
      '', '', '', '', '',
      'Total Area:', `${totalArea} hectares`
    ]);

    // Styling header row
    const headerRow = worksheet.getRow(4);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCE5FF' }, // light blue
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add borders to all data cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // Auto width
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        maxLength = Math.max(maxLength, (cell.value || '').toString().length);
      });
      column.width = maxLength + 2;
    });

    // Timestamp for filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0]; // e.g., 2025-06-16_17-32-01
    const filename = `Farmers_${mandal}_${village}_${crop}_${timestamp}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};