const asyncHandler = require('express-async-handler');
const XLSX = require('xlsx');
const ExcelData = require('../models/ExcelData');
const fs = require('fs');

// @desc    Upload and parse Excel file
// @route   POST /api/excel/upload
// @access  Private
const uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const userId = req.user._id;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = data[0] || [];
    const rows = data.slice(1);

    const parsedData = rows.map((row) => {
      let rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index];
      });
      return rowObject;
    });

    const excelData = await ExcelData.create({
      user: userId,
      fileName,
      headers,
      data: parsedData,
      uploadDate: new Date(),
    });

    // Delete temp file
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting temp file: ${err.message}`);
    });

    res.status(201).json({
      message: 'File uploaded and parsed successfully',
      excelDataId: excelData._id,
      fileName: excelData.fileName,
      headers: excelData.headers,
      data: excelData.data.slice(0, 50), // preview first 50 rows
    });
  } catch (error) {
    console.error(`Error processing Excel file: ${error.message}`);
    res.status(500);
    throw new Error('Error processing Excel file');
  }
});

// @desc    Get all uploads for a user
// @route   GET /api/excel/history
// @access  Private
const getUserUploads = asyncHandler(async (req, res) => {
  const uploads = await ExcelData.find({ user: req.user._id })
    .sort({ uploadDate: -1 })
    .select('fileName uploadDate headers analysisHistory');
  res.json(uploads);
});

// @desc    Get Excel data by ID
// @route   GET /api/excel/:id
// @access  Private
const getExcelData = asyncHandler(async (req, res) => {
  const excelData = await ExcelData.findById(req.params.id);

  if (excelData && excelData.user.toString() === req.user._id.toString()) {
    res.json(excelData);
  } else {
    res.status(404);
    throw new Error('Excel data not found or not authorized');
  }
});

// @desc    Save analysis
// @route   POST /api/excel/:id/analysis
// @access  Private
const saveAnalysis = asyncHandler(async (req, res) => {
  const { analysis, chartType, xAxis, yAxis } = req.body;
  const excelData = await ExcelData.findById(req.params.id);

  if (excelData && excelData.user.toString() === req.user._id.toString()) {
    const newAnalysis = {
      date: new Date(),
      analysis,
      chartType,
      xAxis,
      yAxis,
    };
    excelData.analysisHistory.push(newAnalysis);
    await excelData.save();
    res.json({ message: 'Analysis history saved', analysis: newAnalysis });
  } else {
    res.status(404);
    throw new Error('Excel data not found or not authorized');
  }
});

// @desc    Delete upload
// @route   DELETE /api/excel/:id
// @access  Private
const deleteExcelData = asyncHandler(async (req, res) => {
  const excelData = await ExcelData.findById(req.params.id);

  if (excelData && excelData.user.toString() === req.user._id.toString()) {
    await excelData.deleteOne();
    res.json({ message: 'Excel data removed' });
  } else {
    res.status(404);
    throw new Error('Excel data not found or not authorized');
  }
});

// @desc    Admin: get all uploads
// @route   GET /api/excel/admin/alluploads
// @access  Private/Admin
const getAllUploads = asyncHandler(async (req, res) => {
  const uploads = await ExcelData.find({})
    .sort({ uploadDate: -1 })
    .select('fileName uploadDate headers user');
  res.json(uploads);
});

// @desc    Admin: delete any upload
// @route   DELETE /api/excel/admin/:id
// @access  Private/Admin
const adminDeleteExcelData = asyncHandler(async (req, res) => {
  const excelData = await ExcelData.findById(req.params.id);

  if (excelData) {
    await excelData.deleteOne();
    res.json({ message: 'Excel data removed by admin' });
  } else {
    res.status(404);
    throw new Error('Excel data not found');
  }
});

// ✅ Export everything correctly
module.exports = {
  uploadExcel,
  getUserUploads,
  getExcelData,
  saveAnalysis,
  deleteExcelData,
  getAllUploads,
  adminDeleteExcelData,
};