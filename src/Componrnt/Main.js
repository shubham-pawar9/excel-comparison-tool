import React, { useState, useEffect } from "react";
import { ExcelRenderer } from "react-excel-renderer";

import "./Main.css";
import Header from "./Header";
import Table from "./Table";
import JsonShow from "./JsonShow";

const Main = () => {
  const [masterData, setMasterData] = useState([]);
  const [uploadedXmlData, setUploadedXmlData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [showJson, setShowJson] = useState();

  useEffect(() => {
    const fetchMasterExcel = async () => {
      try {
        const response = await fetch("/master.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        ExcelRenderer(blob, (err, resp) => {
          if (err) {
            console.error("Error parsing master Excel:", err);
            return;
          }

          // Assuming your master Excel file has only one sheet
          const masterSheetData = resp.rows;
          setMasterData(masterSheetData);
        });
      } catch (error) {
        console.error("Error fetching or parsing master Excel:", error);
      }
    };

    fetchMasterExcel();
  }, []);

  const fetchFixedExcel = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      ExcelRenderer(blob, (err, resp) => {
        if (err) {
          console.error("Error parsing uploaded Excel:", err);
          return;
        }

        // Assuming your uploaded Excel file has only one sheet
        const uploadedSheetData = resp.rows;

        // Compare the first column (EN-US column) and filter matching rows
        const matchingRows = uploadedSheetData.map((uploadedRow) => {
          const matchingMasterRow = masterData.find(
            (masterRow) =>
              masterRow[Object.keys(masterRow)[0]] ===
              uploadedRow[Object.keys(uploadedRow)[0]]
          );

          return matchingMasterRow;
        });

        // Set the matching rows to the resultData state
        setResultData(matchingRows);
      });
    } catch (error) {
      console.error("Error fetching or parsing uploaded Excel:", error);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    fetchFixedExcel(file);
  };

  const convertToJSON = () => {
    if (!resultData || resultData.length === 0) {
      return null;
    }

    const jsonData = {};

    // Assuming the first row of resultData contains headers
    const headers = resultData[0];

    for (let cellIndex = 0; cellIndex < headers.length; cellIndex++) {
      const header = headers[cellIndex];
      jsonData[header] = [];

      for (let rowIndex = 1; rowIndex < resultData.length; rowIndex++) {
        const cellValue = resultData[rowIndex][cellIndex];
        console.log(resultData[rowIndex][0]);
        // Only add to the column array if the cellValue is defined
        if (cellValue !== undefined) {
          //   console.log(cellValue);
          jsonData[header].push(`${resultData[rowIndex][0]}: ${cellValue}`);
        }
      }
    }

    return JSON.stringify(jsonData, null, 2);
  };

  const handleDownload = () => {
    if (!resultData) {
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
        {!showJson &&
          (resultData ? (
            <Table data={resultData} setShowJson={setShowJson} />
          ) : (
            <>
              {" "}
              <Header />
            </>
          ))}

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
