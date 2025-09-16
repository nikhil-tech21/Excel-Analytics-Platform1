// src/utils/historyUtils.js

// Save upload info to localStorage
export const saveUploadHistory = (fileName, chartType, fileUrl) => {
  const history = JSON.parse(localStorage.getItem("uploadHistory")) || [];

  const newEntry = {
    id: Date.now(),
    fileName,
    chartType,
    fileUrl,
    uploadedAt: new Date().toISOString(),
  };

  history.push(newEntry);
  localStorage.setItem("uploadHistory", JSON.stringify(history));
};

// Get history from localStorage
export const getUploadHistory = () => {
  return JSON.parse(localStorage.getItem("uploadHistory")) || [];
};

// Clear history (optional helper)
export const clearUploadHistory = () => {
  localStorage.removeItem("uploadHistory");
};