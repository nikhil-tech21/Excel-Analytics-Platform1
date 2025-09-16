import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData); // Instead of callback
      } catch (error) {
        reject(error); // Proper error handling
      }
    };

    reader.onerror = (error) => {
      reject(error); // Catch file read errors
    };

    reader.readAsArrayBuffer(file);
  });
};