import React, { useState, useRef } from 'react';

const AddImages = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
    onImagesChange(selectedImages); // Passing selected images to the parent component
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImages(droppedFiles);
    onImagesChange(droppedFiles); // Passing dropped images to the parent component
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages); // Passing updated images to the parent component
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
          id="imageInput"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: 'none', width: '100%' }}
        />
        <button type="button" onClick={handleClick}>Choose Image</button>
        {images.length > 0 && (
          <div>
            {images.map((image, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <img src={URL.createObjectURL(image)} alt={`Selected Image ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddImages;
