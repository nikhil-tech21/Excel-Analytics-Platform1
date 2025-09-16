import { useState } from "react";
import * as XLSX from "xlsx";
import api from "../utils/api";

function FileUploader({ onUpload, inputRef }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setFileName(file.name);

    console.log("📂 Selected file:", file);

    // ✅ Check extension + MIME type
    if (
      !/\.(xlsx|xls)$/i.test(file.name) ||
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(file.type)
    ) {
      setError("⚠️ Invalid file type. Please upload a valid Excel file (.xlsx or .xls).");
      console.error("❌ Invalid file type:", file.type, "File name:", file.name);
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          console.log("📥 Raw file buffer loaded:", data);

          const workbook = XLSX.read(data, { type: "array" });
          console.log("📒 Workbook object:", workbook);

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          console.log("📑 First sheet name:", sheetName);
          console.log("📄 Worksheet object:", worksheet);

          // ✅ Always parse as array-of-arrays (header row + data rows)
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log("🔍 Parsed rows (array-of-arrays):", rows);

          // ✅ Validation: must have header + at least one row + >= 2 columns
          if (rows.length < 2 || rows[0].length < 2) {
            console.warn(
              "⚠️ Invalid Excel format. Rows:",
              rows.length,
              "Header columns:",
              rows[0]?.length || 0
            );
            setError("⚠️ Excel must have a header row, at least 1 row of data, and ≥ 2 columns.");
            onUpload([], "");
            return;
          }

          // ✅ Upload actual file to backend with JWT
          try {
            const formData = new FormData();
            formData.append("file", file);

            console.log("📤 Sending file to backend:", file.name);

            await api.post("/uploads", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            console.log("✅ File successfully saved on server.");
          } catch (dbErr) {
            console.error("⚠️ Failed to save file on server:", dbErr);
            setError("⚠️ File parsed but could not be saved on server.");
          }

          // ✅ Send parsed rows + filename to parent
          console.log("📨 Sending parsed data to parent component...");
          onUpload(rows, file.name);
        } catch (err) {
          console.error("❌ Excel parse error:", err);
          setError("❌ Failed to parse Excel file. Please upload a valid .xlsx or .xls file.");
          onUpload([], "");
        } finally {
          setUploading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("❌ Upload error:", error);
      setError("❌ Something went wrong while uploading.");
      onUpload([], "");
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium mb-1">📂 Upload Excel File:</label>
      <input
        type="file"
        ref={inputRef}
        accept=".xlsx,.xls"
        onChange={handleUpload}
        disabled={uploading}
        aria-busy={uploading}
        className="border p-2 rounded w-full file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded file:border-none"
      />

      {fileName && <p className="text-xs text-gray-500">Selected file: {fileName}</p>}
      {uploading && <p className="text-blue-600 text-sm">⏳ Uploading...</p>}
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
}

export default FileUploader;