import React, { useState, useRef } from 'react';

export default function UploadFile({ onFileChange }) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    onFileChange(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    onFileChange(selectedFiles);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileChange(selectedFiles);
  };

  const handleClick = () => inputRef.current && inputRef.current.click();

  return (
    <div className='w-100%' style={{ textAlign: 'center' }}>
      <div        
        className='p-5 border-dashed border-2 border-sky-500 w-100%'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={inputRef}
          type="file"
          id="fileInput"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none', width: '100%' }}
        />
        <button type="button" onClick={handleClick}>Choose PDF File</button>
        {files.length > 0 && (
          <div>
            {files.map((file, index) => (
              <div key={index} className='mb-2 flex flex-col'>
                <span>{file.name}</span>
                <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
