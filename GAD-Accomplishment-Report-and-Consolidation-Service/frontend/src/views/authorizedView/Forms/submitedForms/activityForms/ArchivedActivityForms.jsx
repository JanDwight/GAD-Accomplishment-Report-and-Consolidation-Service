import { React, useState, useEffect } from 'react'
import axiosClient from '../../../../axios/axios';
import { ArrowLeftStartOnRectangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import ReactModal from 'react-modal';
import RestoreActivityModal from './components/modals/RestoreActivityModal';
import DeleteActivityModal from './components/modals/DeleteActivityModal';

export default function ArchivedActivityForms() {
    const [filterText, setFilterText] = useState(''); //for search

    const [forms, setForms] = useState([]); 
    const [selectedForm, setSelectedForm] = useState('')
    const [isRestoreUserModalOpen, setIsRestoreUserModalOpen] = useState(false);
    const [isDeleteReportModalOpen, setIsDeleteReportModalOpen] = useState(false);

    useEffect(() => {
        fetchCurriculum();
      }, []);
    
    const fetchCurriculum = async () => {
      try {
        const response = await axiosClient.get('/show_archived_forms_all');
        if (response.data && response.data) {
          setForms(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // for search function
    const filteredData = forms.filter(
        (forms) =>
        forms.title && forms.title.toString().includes(filterText) 
      );

    // For User RESTOREUSER
    const handleRestoreUserClick = (selected_form) => {
        setIsRestoreUserModalOpen(true)
        setSelectedForm(selected_form)
        console.log('This is the selected form',selectedForm);
    }

    // For User RESTOREUSER
    const handleDeleteUserClick = (selected_form) => {
        setIsDeleteUserModalOpen(true)
        setSelectedForm(selected_form)
    }
    
  return (
    <>
    <div className="table-container overflow-y-auto">
            <table className='border-solid border-2 border-sky-500'>
                <thead className='border-solid border-2 border-sky-500'>
                    <tr>
                        <th className="text-left bg-gray-200 p-2 border-solid border-2 border-sky-500">Title</th>
                        <th className="text-left bg-gray-200 p-2 border-solid border-2 border-sky-500">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((forms, index) => (
                          <tr 
                            key={index} 
                            className={`${index % 2 === 0 ? 'odd:bg-green-100' : ''}`}
                          >
                              <td className="text-center p-2">{forms.title}</td>
                              <td className= "flex items-center p-3">
                                <button onClick={() => handleRestoreUserClick(forms)}>
                                    <ArrowLeftStartOnRectangleIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                                </button>
                                <button onClick={() => setIsDeleteReportModalOpen(forms)}>
                                    <TrashIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                                </button>
                              </td>
                            </tr>
                            ))}
                </tbody>
            </table>
        </div>

        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isRestoreUserModalOpen}
            onRequestClose={() => setIsRestoreUserModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <RestoreActivityModal
                 closeModal={() => setIsRestoreUserModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>

        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isDeleteReportModalOpen}
            onRequestClose={() => setIsDeleteReportModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <DeleteActivityModal
                 closeModal={() => setIsDeleteReportModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>
    </>
  )
}
