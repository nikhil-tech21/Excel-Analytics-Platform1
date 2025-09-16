import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { useRef } from 'react';

function ChartViewer({ chartType, xAxisData = [], yAxisData = [] }) {
  const chartRef = useRef(null);

  // ✅ Validate and prepare data
  const isValid =
    Array.isArray(xAxisData) &&
    Array.isArray(yAxisData) &&
    xAxisData.length > 0 &&
    yAxisData.length > 0;

  const data = isValid
    ? xAxisData.map((x, i) => {
        const value = Number(yAxisData[i]);
        return x !== undefined && !isNaN(value)
          ? { name: x, value }
          : null;
      }).filter(Boolean)
    : [];

  const exportAsImage = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => saveAs(blob, 'chart.png'));
    };

    img.src = url;
  };

  const exportAsPDF = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
      pdf.save('chart.pdf');
    };

    img.src = url;
  };

  return (
    <div className="space-y-4">
      {data.length > 0 && (
        <div className="flex gap-2">
          <button onClick={exportAsImage} className="bg-green-600 text-white px-3 py-1 rounded">
            Download PNG
          </button>
          <button onClick={exportAsPDF} className="bg-blue-600 text-white px-3 py-1 rounded">
            Download PDF
          </button>
        </div>
      )}

      <div ref={chartRef} style={{ width: '100%', height: 400 }}>
        {data.length === 0 ? (
          <div className="text-center text-red-500 pt-20 text-lg">
            ⚠️ No valid data to display the chart.
          </div>
        ) : chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ChartViewer;