import React, { useState, useEffect } from 'react'
import NeutralButton from '../../../../components/buttons/NeutralButton'
import UploadFile from '../../../../components/file/UploadFile'
import Feedback from '../../../../components/feedbacks/Feedback';
import AddPrompt from '../../../prompts/AddPrompt';
import ReactModal from 'react-modal';
import LoadingHorizontalLine from '../../../../components/feedbacks/LoadingHorizontalLine';
import axiosClient from '../../../../axios/axios';
import UploadPdf from './components/UploadPdf';
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/20/solid';
import ArchivePdfModal from './components/ArchivePdfModal';

export default function PreviousReport() {
  const [showUploadPdf, setShowUploadPdf] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(false);

  const [retrievedPdfs, setRetrievedPdfs] = useState([])

  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

    // For Pdf Archive
    const handleArchiveClick = (selected_pdf) => {
      setIsArchiveModalOpen(true)
      setSelectedPdf(selected_pdf)
    }

  //----Fetch the list of uploaded pdfs
  useEffect(() => {
    const fetchBackupFiles = async () => {
        setIsHorizontalLoading(true);

        try {
            const response = await axiosClient.get('/showpdfs');
            setRetrievedPdfs(response.data.message); // Set titles to the array of backup file names
            setIsHorizontalLoading(false);
        } catch (error) {
            console.error(error);
            setIsHorizontalLoading(false); // Ensure loading state is updated even in case of error
        }
    };

      fetchBackupFiles();
  }, []);

  //----Downloads the pdfs
  const handlePdfClick = async (pdfFileName) => {
    try {
      const response = await axiosClient.get(`/downloadpdf/${pdfFileName}`, {
        responseType: 'blob', // Set the response type to blob
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', pdfFileName); // Set the download attribute to the filename
      document.body.appendChild(link);

      // Trigger the click event to start downloading the file
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className='h-full'>

      <div className='bg-white h-full overflow-y-auto rounded-xl relative'>

      <LoadingHorizontalLine />
          <table className='w-full text-left rounded-xl'>
                <thead className='bg-secondary sticky top-0'>
                    <tr>
                        <th className='px-4 py-2'>Yearly Annual Reports</th>
                        <th className='px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {retrievedPdfs.map((pdf, index) => ( 
                        <tr 
                            key={index}
                            className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                            
                        >
                            <td 
                              className='px-4 py-2'
                              onClick={() => handlePdfClick(pdf)}
                            >
                              {pdf}
                            </td>
                            <td>
                              <button title="Archive PDF" onClick={() => handleArchiveClick(pdf)}>
                                <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                              </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        <div className='absolute bottom-10 right-20 mr-10 w-fit'>
          <NeutralButton label={'Upload File'} onClick={() => setShowUploadPdf(true)} />
        </div>
      </div>
      


      <ReactModal
        isOpen={showUploadPdf}
        onRequestClose={() => setShowUploadPdf(false)}
        className="max-w-[90%] w-fit max-h-[95%] min-h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl my-[1%] mx-auto p-5 pt-0 overflow-y-auto"
      >
        <div>
          <UploadPdf
            closeModal={() => setShowUploadPdf(false)}
          />
        </div>
      </ReactModal>

            {/** Modal For PDF ARCHIVE */}                
            <ReactModal
          isOpen={isArchiveModalOpen}
          onRequestClose={() => setIsArchiveModalOpen(false)}
          className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
      >
          <div>
              <ArchivePdfModal
               closeModal={() => setIsArchiveModalOpen(false)}
               selectedPDF={selectedPdf}
               />
          </div>
      </ReactModal>
    </div>
  )
}
