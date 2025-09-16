import { useRef, useState } from 'react';
import FileUploader from '../components/FileUploader';
import AxisSelector from '../components/AxisSelector';
import ChartViewer from '../components/ChartViewer';
import ThreeDChartViewer from '../components/ThreeDChartViewer';

function Dashboard() {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [chartType, setChartType] = useState('line');
  const [x, setX] = useState(0);
  const [y, setY] = useState(1);
  const fileInputRef = useRef();

  const allowedTypes = ['line', 'bar', 'pie', '3d'];
  const safeChartType = allowedTypes.includes(chartType) ? chartType : 'line';

  const columns = Array.isArray(excelData) && excelData.length > 0 ? excelData[0] : [];
  const dataRows = Array.isArray(excelData) && excelData.length > 1 ? excelData.slice(1) : [];

  const validDataRows = dataRows.filter(
    (row) => Array.isArray(row) && row.length > Math.max(x, y)
  );

  const xData = validDataRows.map((row) => row?.[x] ?? '');
  const yData = validDataRows.map((row) => Number(row?.[y]) || 0);

  const handleUpload = (data, name) => {
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[0])) {
      alert('⚠️ Invalid Excel file.\nIt must contain a header and at least one row of data.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || { email: 'guest@example.com' };
    const today = new Date().toISOString().split('T')[0];

    const log = {
      userEmail: user.email || 'guest@example.com',
      fileName: name,
      uploadDate: today,
    };

    // ✅ Save upload history in localStorage (fallback)
    const previous = JSON.parse(localStorage.getItem('uploadHistory')) || [];
    localStorage.setItem('uploadHistory', JSON.stringify([...previous, log]));

    // (Optional) TODO: Send `log` to backend API for permanent storage

    setExcelData(data);
    setFileName(name);

    // Auto-detect numeric column for Y if possible
    const firstNumeric = data[1]?.findIndex((val) => !isNaN(Number(val)));
    if (firstNumeric !== -1) setY(firstNumeric);
  };

  const handleReset = () => {
    setExcelData([]);
    setFileName('');
    setX(0);
    setY(1);
    // setChartType('line'); // 🔄 keep last chart type instead of resetting
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-white bg-gray-800 rounded-lg shadow-lg">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">📈 Excel Chart Viewer</h2>
          <p className="text-sm text-gray-300">
            Upload your Excel file and explore chart visualizations.
          </p>
        </div>
        {fileName && (
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm"
          >
            Reset
          </button>
        )}
      </div>

      {/* File Upload Section */}
      <div className="bg-gray-700 shadow rounded-lg p-6">
        <FileUploader onUpload={handleUpload} inputRef={fileInputRef} />
        {fileName && (
          <p className="mt-3 text-sm text-green-400">
            ✅ Uploaded: <strong>{fileName}</strong>
          </p>
        )}
      </div>

      {/* Data Controls + Chart */}
      {columns.length > 0 && (
        <div className="bg-gray-700 shadow rounded-lg p-6 space-y-6">
          {/* Axis Selector */}
          <AxisSelector
            columns={columns}
            selectedX={x}
            selectedY={y}
            setX={setX}
            setY={setY}
          />

          {/* X/Y Preview */}
          {columns[x] !== undefined && columns[y] !== undefined && (
            <div className="text-sm text-gray-300">
              📌 X: <strong>{columns[x]}</strong> | Y: <strong>{columns[y]}</strong>
            </div>
          )}

          {/* Chart Type Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-sm">Chart Type:</span>
            {allowedTypes.map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-1 rounded font-medium border text-sm transition-all ${
                  safeChartType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-500 text-white border-gray-400'
                }`}
              >
                {type === '3d' ? '3D Chart' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Chart Display */}
          <div>
            {xData.length > 0 && yData.length > 0 ? (
              safeChartType === '3d' ? (
                <ThreeDChartViewer xAxisData={xData} yAxisData={yData} />
              ) : (
                <ChartViewer chartType={safeChartType} xAxisData={xData} yAxisData={yData} />
              )
            ) : (
              <p className="text-red-400 text-sm">⚠️ No data to display. Please check your selected columns.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;