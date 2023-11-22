import React, { useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import "./Main.css";
import Header from "./Header";
import Table from "./Table";
import JsonShow from "./JsonShow";

const Main = () => {
  const [data, setData] = useState();
  const [showJson, setShowJson] = useState();
  const handleUpload = (event) => {
    const file = event.target.files[0];
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setData(() => [resp]);
      }
    });
  };

  const convertToJSON = () => {
    if (!data) {
      return null;
    }

    const headers = data[0].rows[0];
    const jsonData = {};

    for (let cellIndex = 0; cellIndex < headers.length; cellIndex++) {
      const header = headers[cellIndex];
      jsonData[header] = [];

      for (let rowIndex = 1; rowIndex < data[0].rows.length; rowIndex++) {
        const cellValue = data[0].rows[rowIndex][cellIndex];

        if (cellValue !== undefined) {
          jsonData[header].push(cellValue);
        }
      }
    }

    return JSON.stringify(jsonData, null, 2);
  };
  const handleDownload = () => {
    if (!data) {
      return;
    }

    const jsonData = convertToJSON();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div className="mainDiv">
        <div className="inputDiv">
          <input type="file" name="file" onChange={handleUpload} />
        </div>

        {!data && <Header />}
        <Table data={data} setShowJson={setShowJson} />
        {showJson && (
          <JsonShow
            handleDownload={handleDownload}
            convertToJSON={convertToJSON()}
            setShowJson={setShowJson}
          />
        )}
      </div>
    </>
  );
};

export default Main;
