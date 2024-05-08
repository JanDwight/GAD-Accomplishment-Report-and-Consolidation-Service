import { React, useState, useEffect } from 'react'
import axiosClient from '../../../../../axios/axios';
import { ArrowLeftStartOnRectangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import ReactModal from 'react-modal';
import RestoreUserModal from '../../ManageUser/Modals/RestoreUserModal';
import DeleteUserModal from '../../ManageUser/Modals/DeleteUserModal';
import RestorePdf from './RestorePdf';
import DeletePdf from './DeletePdfModal';
import DeletePdfModal from './DeletePdfModal';

export default function ArchivedPdfs() {
    const [filterText, setFilterText] = useState(''); //for search

    const [pdfs, setPdfs] = useState([]); 
    const [selectedPDF, setSelectedPDF] = useState('')
    const [isRestorePdfModalOpen, setIsRestorePdfModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

    useEffect(() => {
        fetchCurriculum();
      }, []);
    
    const fetchCurriculum = async () => {
      try {
        const response = await axiosClient.get('/showarchivedpdfs');
        if (Array.isArray(response.data.message)) {
            setPdfs(response.data.message);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // for search function
    const filteredData = pdfs.filter(
        (pdf) =>
            pdf && pdf.toString().includes(filterText)
      );

    // For User RESTOREUSER
    const handleRestoreUserClick = (selected_pdfs) => {
        setIsRestorePdfModalOpen(true)
        setSelectedPDF(selected_pdfs)
    }

    // For User RESTOREUSER
    const handleDeleteUserClick = (selected_user) => {
        setIsDeleteUserModalOpen(true)
        setSelectedPDF(selected_user)
    }

  return (
    <>
    <div className="h-full">
      <div className='bg-white flex h-full overflow-y-auto rounded-xl'>
        <table className='w-screen text-center h-fit'>
          <thead className='bg-secondary sticky top-0'>
              <tr>
                  <th className="text-left bg-secondary p-2 ">Pdf Name</th>
                  <th className="w-fit text-left bg-secondary p-2 ">Actions</th>
              </tr>
          </thead>
          <tbody>
            {filteredData.map((pdfs, index) => (
              <tr 
                key={index} 
                className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
              >
                <td className="text-center p-2">{pdfs}</td>
                <td className= "flex items-center p-3">
                  <button title="Restore User" onClick={() => handleRestoreUserClick(pdfs)}>
                      <ArrowLeftStartOnRectangleIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                  </button>
                  <button title="Delete User" onClick={() => handleDeleteUserClick(pdfs)}>
                      <TrashIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                  </button>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isRestorePdfModalOpen}
            onRequestClose={() => setIsRestoreUserModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <RestorePdf
                 closeModal={() => setIsRestoreUserModalOpen(false)}
                 selectedPDF={selectedPDF}
                 />
            </div>
        </ReactModal>

        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isDeleteUserModalOpen}
            onRequestClose={() => setIsDeleteUserModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <DeletePdfModal
                 closeModal={() => setIsDeleteUserModalOpen(false)}
                 selectedPDF={selectedPDF}
                 />
            </div>
        </ReactModal>
    </>
  )
}
