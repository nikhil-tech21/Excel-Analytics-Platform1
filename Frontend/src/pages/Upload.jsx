// src/pages/Upload.jsx
import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import ChartViewer from "../components/ChartViewer";

function Upload() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [xAxisData, setXAxisData] = useState([]);
  const [yAxisData, setYAxisData] = useState([]);
  const [chartType, setChartType] = useState("line");

  const allowedTypes = ["line", "bar", "pie", "3d"];

  // ✅ Restore chart if user selected one from History
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedChart"));
    if (saved) {
      console.log("📂 Restoring chart from history:", saved);
      setFileName(saved.fileName);
      setXAxisData(saved.xAxisData || []);
      setYAxisData(saved.yAxisData || []);
      setChartType(saved.chartType || "line");
      localStorage.removeItem("selectedChart"); // clear after use
    }
  }, []);

  // ✅ Handle file upload and parsing
  const handleFileUpload = async (data, fileName) => {
    setLoading(true);
    setError("");

    console.log("📂 Received file upload:", fileName);
    console.log("📊 Raw parsed data:", data);

    try {
      let headers, rows;

      if (Array.isArray(data) && Array.isArray(data[0])) {
        // ✅ Case 1: Already array-of-arrays
        console.log("🔍 Detected format: Array of Arrays");
        headers = data[0];
        rows = data.slice(1);
      } else if (Array.isArray(data) && typeof data[0] === "object") {
        // ✅ Case 2: Array of objects (default XLSX.utils.sheet_to_json output)
        console.log("🔍 Detected format: Array of Objects");
        headers = Object.keys(data[0]);
        rows = data.map((row) => headers.map((h) => row[h]));
      } else {
        throw new Error("Unrecognized Excel data format.");
      }

      console.log("📝 Headers detected:", headers);
      console.log("📊 Rows parsed:", rows);

      if (headers.length < 2) {
        throw new Error("Excel must contain at least 2 columns.");
      }

      const x = rows.map((row) => row[0] ?? "");
      const y = rows.map((row) => Number(row[1]) || 0);

      console.log("📈 X-Axis data:", x);
      console.log("📉 Y-Axis data:", y);

      setXAxisData(x);
      setYAxisData(y);
      setFileName(fileName || "Untitled");
      setLoading(false);

      // ✅ Save to upload history
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.email) {
        const newUpload = {
          userEmail: user.email,
          fileName: fileName || "Unknown File",
          chartType,
          uploadDate: new Date().toISOString(),
          xAxisData: x,
          yAxisData: y,
        };

        let history = JSON.parse(localStorage.getItem("uploadHistory")) || [];
        history.push(newUpload);
        localStorage.setItem("uploadHistory", JSON.stringify(history));

        console.log("💾 Upload saved to history:", newUpload);
      }
    } catch (err) {
      console.error("❌ File parsing error:", err.message);
      setError("❌ Failed to parse Excel file. Please make sure it has at least 2 columns.");
      setXAxisData([]);
      setYAxisData([]);
      setFileName("");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">📁 Upload Excel File</h1>

      <FileUploader onUpload={handleFileUpload} />

      {loading && <p className="text-blue-400 mt-4">⏳ Processing file...</p>}

      {fileName && !loading && (
        <>
          <div className="mt-4 text-green-400">
            ✅ File <strong>{fileName}</strong> uploaded and parsed successfully!
          </div>

          {/* Chart type switcher */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <span className="font-medium text-sm">Chart Type:</span>
            {allowedTypes.map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-1 rounded font-medium border text-sm transition-all ${
                  chartType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-600 text-white border-gray-400"
                }`}
              >
                {type === "3d" ? "3D Chart" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-8 bg-gray-700 p-4 rounded-lg shadow">
            <ChartViewer chartType={chartType} xAxisData={xAxisData} yAxisData={yAxisData} />
          </div>
        </>
      )}

      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}

export default Upload;