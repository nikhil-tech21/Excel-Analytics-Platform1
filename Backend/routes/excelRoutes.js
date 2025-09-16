const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadExcel,
  getUserUploads,
  getExcelData,
  saveAnalysis,
  deleteExcelData,
  getAllUploads,
  adminDeleteExcelData,
} = require("../controllers/excelController");

const { protect, admin } = require("../middleware/authMiddleware");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // save uploaded files in /uploads
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// ------------------- Routes -------------------

// Upload and parse Excel file
router.post("/upload", protect, upload.single("file"), uploadExcel);

// Get upload history for logged-in user
router.get("/history", protect, getUserUploads);

// Get specific Excel file data by ID
router.get("/:id", protect, getExcelData);

// Save an analysis for an uploaded file
router.post("/:id/analysis", protect, saveAnalysis);

// Delete an uploaded Excel file
router.delete("/:id", protect, deleteExcelData);

// ------------------- Admin Routes -------------------

// Get all uploads (admin only)
router.get("/admin/alluploads", protect, admin, getAllUploads);

// Delete any upload (admin only)
router.delete("/admin/:id", protect, admin, adminDeleteExcelData);

module.exports = router;