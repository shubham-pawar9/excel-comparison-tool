const Table = ({ data, setShowJson }) => {
  console.log(data);
  return (
    <>
      {data && (
        <div className="mainTableDiv">
          <button className="jsonShowBtn" onClick={() => setShowJson(true)}>
            Show Json
          </button>
          <table>
            <thead>
              <tr>
                {data[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) =>
                row[rowIndex] !== undefined ? (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
export default Table;
