const asyncHandler = require("express-async-handler");
const Upload = require("../models/Upload");

// @desc    Upload a file
// @route   POST /api/uploads
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const file = new Upload({
    user: req.user._id,
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });

  const savedFile = await file.save();

  res.status(201).json(savedFile);
});

// @desc    Get user’s uploaded files
// @route   GET /api/uploads
// @access  Private
const getUserUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ user: req.user._id }).sort({ uploadedAt: -1 });
  res.json(uploads);
});

module.exports = { uploadFile, getUserUploads };