function AxisSelector({ columns, selectedX, selectedY, setX, setY }) {
  const isValidColumns = Array.isArray(columns) && columns.length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 my-4">
      {/* X Axis Selector */}
      <div className="flex-1">
        <label
          htmlFor="x-axis"
          className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200"
        >
          Select X Axis
        </label>
        <select
          id="x-axis"
          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={selectedX}
          onChange={(e) => setX(Number(e.target.value))}
          disabled={!isValidColumns}
        >
          {isValidColumns ? (
            columns.map((col, i) => (
              <option key={i} value={i}>
                {col}
              </option>
            ))
          ) : (
            <option>No Columns Available</option>
          )}
        </select>
      </div>

      {/* Y Axis Selector */}
      <div className="flex-1">
        <label
          htmlFor="y-axis"
          className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200"
        >
          Select Y Axis
        </label>
        <select
          id="y-axis"
          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={selectedY}
          onChange={(e) => setY(Number(e.target.value))}
          disabled={!isValidColumns}
        >
          {isValidColumns ? (
            columns.map((col, i) => (
              <option key={i} value={i}>
                {col}
              </option>
            ))
          ) : (
            <option>No Columns Available</option>
          )}
        </select>
      </div>
    </div>
  );
}

export default AxisSelector;