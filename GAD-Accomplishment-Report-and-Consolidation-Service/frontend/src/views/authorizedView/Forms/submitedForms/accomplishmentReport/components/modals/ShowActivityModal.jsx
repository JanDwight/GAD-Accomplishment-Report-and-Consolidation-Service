import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../../../axios/axios';
import ReactModal from 'react-modal';

export default function ShowActivityModal({ selectedForm }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);  // State to track clicked image
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to track modal open/close
  const [zoomLevel, setZoomLevel] = useState(1);  // State to track zoom level

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/getimages/${selectedForm.id}`);
        if (response.data && response.data.length > 0) {
          setImages(response.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (selectedForm.id) {
      fetchData();
    }
  }, [selectedForm.id]);

  const renderFields = (name, label) => {
    return (
      <div>
        <label htmlFor={name} className="font-bold">{label}</label>
        <input
          id={name}
          name={name}
          type="text"
          autoComplete={name}
          placeholder="I am empty..."
          value={selectedForm[name]}
          className="bg-white underline"
          disabled
        />
      </div>
    );
  }

  const tableBorder = "text-center border border-black border-solid";

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
    setZoomLevel(1);  // Reset zoom level when closing modal
  };

  const handleDoubleClick = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prevZoom => prevZoom + 0.1);
    } else {
      setZoomLevel(1);
    }
  };

  return (
    <div className="p-4">
      {renderFields("title", "Title: ")}
      {renderFields("date_of_activity", "Date of Activity: ")}
      {renderFields("venue", "Venue: ")}
      {renderFields("proponents_implementors", "Proponents/Implementors: ")}
      {renderFields("male_participants", "Male Participants: ")}
      {renderFields("female_participants", "Female Participants: ")}
      {renderFields("no_of_participants", "Total Number of Participants: ")}

      <h2 className='text-center m-3'>
        Budgetary Requirements:
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className={tableBorder}>Type</th>
              <th className={tableBorder}>Item</th>
              <th className={tableBorder}>Approved Budget</th>
              <th className={tableBorder}>Actual Expenditure</th>
            </tr>
          </thead>
          <tbody>
            {selectedForm.actual_expenditure.map((expenditure, index) => (
              <tr key={index}>
                <td className={tableBorder}>{expenditure.type}</td>
                <td className={tableBorder}>{expenditure.items}</td>
                <td className={tableBorder}>{expenditure.approved_budget}</td>
                <td className={tableBorder}>{expenditure.actual_expenditure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className='text-center m-3'>Attached Documents</h2>
        <table className='min-w-full'>
          <thead>
            <tr>
                <th className="w-1/2 text-center border border-black border-solid">
                  Activity Designs
                </th>
            </tr>
          </thead>
          <tbody>
            <td className="w-1/2 text-center border border-black border-solid">
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <img 
                    key={index} 
                    src={`${import.meta.env.VITE_API_BASE_URL}${image}`} 
                    alt={`Image-${index}`} 
                    className="w-full cursor-pointer" 
                    onClick={() => openModal(`${import.meta.env.VITE_API_BASE_URL}${image}`)}
                  />
                ))
              ) : (
                <p className="text-center">No images available</p>
              )}
            </td>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Full View Image"
      >
        <button onClick={closeModal} className="absolute top-1 right-1 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 cursor-pointer">
                        X
        </button>
        <div className="w-full h-screen flex flex-col items-center justify-center">
         <div className="relative w-full h-full" onDoubleClick={handleDoubleClick}>
            <img 
              src={selectedImage} 
              alt="Full view"
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
              <button onClick={() => setZoomLevel(prev => prev + 0.1)} className="text-white bg-blue-500 p-2 rounded m-2 hover:bg-blue-400">Zoom In</button>
              <button onClick={() => setZoomLevel(prev => prev - 0.1)} className="text-white bg-blue-500 p-2 rounded m-2 hover:bg-blue-400">Zoom Out</button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
