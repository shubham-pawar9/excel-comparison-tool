import "./Main.css";

const JsonShow = ({ handleDownload, convertToJSON, setShowJson }) => {
  return (
    <>
      <div className="jsonOutput">
        <h2>JSON Output:</h2>
        <button className="closeJson" onClick={() => setShowJson(null)}>
          X
        </button>
        <button onClick={handleDownload} style={{ width: "fit-content" }}>
          Download JSON
        </button>
        <pre>{convertToJSON}</pre>
      </div>
    </>
  );
};
export default JsonShow;
