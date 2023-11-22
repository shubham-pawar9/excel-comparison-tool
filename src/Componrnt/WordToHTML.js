import React, { useState } from "react";
import mammoth from "mammoth";

import "./Main.css";

const WordToHTML = () => {
  const [wordDocumentUrl, setWordDocumentUrl] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    // Assuming you've implemented the necessary conversion logic here
    const convertedHtmlUrl = convertWordToHtml(file);
    setWordDocumentUrl(convertedHtmlUrl);
  };

  // Replace this function with your actual conversion logic
  const convertWordToHtml = async (wordFile) => {
    const result = await mammoth.convertToHtml({ arrayBuffer: wordFile });
    const htmlContent = result.value;
    // Now you can host the HTML content and return its URL
    const htmlUrl = "http://localhost:3000/"; // Replace with actual URL
    return htmlUrl;
  };
  return (
    <div className="mainDiv">
      <div className="inputDiv">
        <input type="file" name="file" onChange={handleUpload} />
      </div>
      {wordDocumentUrl && (
        <iframe
          src={wordDocumentUrl}
          width="100%"
          height="600px"
          title="Word Document"
        />
      )}
    </div>
  );
};

export default WordToHTML;
