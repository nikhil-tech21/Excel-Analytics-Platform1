import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState(null); // ✅ track expanded chart

  const user = { email: "demo@example.com" };

  useEffect(() => {
    // Simulated API data
    setTimeout(() => {
      setHistory([
        {
          fileName: "Sales_Report_Q1.xlsx",
          uploadDate: "2025-08-20T10:15:00Z",
          chartData: [
            { label: "Jan", value: 400 },
            { label: "Feb", value: 300 },
            { label: "Mar", value: 500 },
          ],
        },
        {
          fileName: "Marketing_Data.csv",
          uploadDate: "2025-08-21T14:30:00Z",
          chartData: [
            { label: "Week 1", value: 120 },
            { label: "Week 2", value: 200 },
            { label: "Week 3", value: 180 },
            { label: "Week 4", value: 250 },
          ],
        },
        {
          fileName: "Customer_List.xlsx",
          uploadDate: "2025-08-22T08:45:00Z",
          chartData: [
            { label: "2019", value: 50 },
            { label: "2020", value: 80 },
            { label: "2021", value: 120 },
            { label: "2022", value: 200 },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">📜 History</h2>

      {loading ? (
        <p className="animate-pulse">⏳ Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          ⚠️ No uploads found for your account.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((h, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded shadow p-4 transition hover:shadow-lg"
            >
              <h3 className="font-semibold text-lg">{h.fileName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uploaded: {new Date(h.uploadDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                User: {user.email}
              </p>

              {/* Line Chart Preview */}
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={h.chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Button to expand full chart */}
              <button
                onClick={() =>
                  setExpandedChart(expandedChart === i ? null : i)
                }
                className="mt-3 text-blue-500 hover:underline"
              >
                {expandedChart === i
                  ? "Hide Full Line Chart ↑"
                  : "View Full Line Chart →"}
              </button>

              {/* Expanded Full Chart */}
              {expandedChart === i && (
                <div className="mt-4 h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={h.chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;