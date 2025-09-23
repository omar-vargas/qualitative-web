import React, { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // puedes usar íconos de MUI si ya los tienes

function DataPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus("⚠️ Por favor selecciona un archivo.");
      return;
    }

    console.log("Archivo listo:", selectedFile.name);
    setUploadStatus("✅ Archivo cargado correctamente");
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  return (
    <div className="upload-container">
      <div className="upload-title">Subir archivo</div>

      <input
        type="file"
        className="upload-input"
        ref={inputRef}
        onChange={handleFileChange}
      />

      <button className="upload-button" onClick={triggerFileInput}>
        <CloudUploadIcon style={{ marginRight: 8 }} />
        Seleccionar archivo
      </button>

      {selectedFile && <div className="file-name">{selectedFile.name}</div>}

      <button className="upload-button" onClick={handleUpload}>
        Subir
      </button>

      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  );
}

export default DataPage;
