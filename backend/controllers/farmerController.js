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
  let { mandal, village, crop } = req.body;

  mandal = mandal?.trim();
  village = village?.trim();
  crop = crop?.trim();

  try {
    let query = 'SELECT SUM(area) AS totalArea, COUNT(*) AS countFarmers FROM farmers';
    let conditions = [];
    let values = [];

    if (mandal) {
      conditions.push('mandal = ?');
      values.push(mandal);
    }
    if (village) {
      conditions.push('village = ?');
      values.push(village);
    }
    if (crop) {
      conditions.push('crop = ?');
      values.push(crop);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query, values);
    res.json({ totalArea: rows[0].totalArea || 0, countFarmers: rows[0].countFarmers || 0 });
  } catch (error) {
    console.error('Error in getTotalArea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadFarmerData = async (req, res) => {
  let { mandal, village, crop } = req.body;

  mandal = mandal?.trim();
  village = village?.trim();
  crop = crop?.trim();

  try {
    let query = 'SELECT name, phno, mandal, village, crop, area FROM farmers';
    let conditions = [];
    let values = [];

    if (mandal) {
      conditions.push('mandal = ?');
      values.push(mandal);
    }
    if (village) {
      conditions.push('village = ?');
      values.push(village);
    }
    if (crop) {
      conditions.push('crop = ?');
      values.push(crop);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query, values);
    const totalArea = parseFloat(
      rows.reduce((sum, row) => sum + parseFloat(row.area || 0), 0).toFixed(2)
    );
    const countFarmers = rows.length;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Farmer Data');

    const titleText = `Farmer Report${mandal ? `: ${mandal}` : ''}${village ? ` > ${village}` : ''}${crop ? ` (${crop})` : ''}`;
    worksheet.addRow([titleText]).font = { bold: true, size: 14 };
    worksheet.addRow([]);

    const header = ['S.no', 'Name', 'Phone Number', 'Mandal', 'Village', 'Crop', 'Area (hectares)'];
    worksheet.addRow(header);

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
    worksheet.addRow(['', '', '', '', '', 'Total Farmers:', countFarmers]);
    worksheet.addRow(['', '', '', '', '', 'Total Area:', `${totalArea} hectares`]);

    // Style
    const headerRow = worksheet.getRow(3);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCE5FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

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

    // Column widths (shorter S.no)
    worksheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 6;
      else {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, cell => {
          maxLength = Math.max(maxLength, (cell.value || '').toString().length);
        });
        column.width = maxLength + 2;
      }
    });

    const now = new Date();
    const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
    const filename = `Farmers_${timestamp}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
