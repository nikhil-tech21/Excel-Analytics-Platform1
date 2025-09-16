const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadFile, getUserUploads } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config (save files in /uploads folder)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload file
router.post("/", protect, upload.single("file"), uploadFile);

// Get user’s upload history
router.get("/", protect, getUserUploads);

module.exports = router;
