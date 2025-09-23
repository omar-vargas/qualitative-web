import React, { useRef, useState } from "react";

function MultiFileUpload() {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
    }));
    setFiles(selected);
  };

  const handleUpload = () => {
    const updatedFiles = [...files];
    updatedFiles.forEach((item, index) => {
      simulateUpload(item, index);
    });
  };

  const simulateUpload = (item, index) => {
    const interval = setInterval(() => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        const newProgress = Math.min(newFiles[index].progress + 10, 100);
        newFiles[index].progress = newProgress;
        if (newProgress === 100) {
          clearInterval(interval);
          newFiles[index].uploaded = true;
        }
        return newFiles;
      });
    }, 200);
  };

  const triggerFileInput = () => inputRef.current.click();

  return (
    <div className="upload-container">
      <div className="upload-title">Subir múltiples archivos</div>

      <input
        type="file"
        ref={inputRef}
        className="upload-input"
        multiple
        onChange={handleFileSelect}
      />

      <button className="upload-button" onClick={triggerFileInput}>
        Seleccionar Archivos
      </button>

      {files.length > 0 && (
        <>
          <div className="file-list">
            {files.map((item, index) => (
              <div key={index} className="file-item">
                <div className="file-name">{item.file.name}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="upload-button" onClick={handleUpload}>
            Subir Archivos
          </button>
        </>
      )}
    </div>
  );
}

export default MultiFileUpload;
