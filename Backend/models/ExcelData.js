const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  analysis: { type: String, required: true },
  chartType: { type: String },
  xAxis: { type: String },
  yAxis: { type: String },
});

const excelDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  headers: {
    type: [String],
    required: true,
  },
  data: {
    type: [mongoose.Schema.Types.Mixed], // rows as JSON
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  analysisHistory: [analysisSchema],
});

module.exports = mongoose.model('ExcelData', excelDataSchema);