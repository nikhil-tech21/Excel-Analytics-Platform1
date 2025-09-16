const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  size: Number,
  mimeType: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Upload', UploadSchema);