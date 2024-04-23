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
    const [isRestoreFormModalOpen, setIsRestoreFormModalOpen] = useState(false);
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

    // For User RESTOREFORM
    const handleRestoreFormClick = (selected_form) => {
        setIsRestoreFormModalOpen(true)
        setSelectedForm(selected_form)
        console.log('This is the selected form',selectedForm);
    }

    // For User DELETEFORM
    const handleDeleteFormClick = (selected_form) => {
      setIsDeleteReportModalOpen(true)
        setSelectedForm(selected_form)
    }
    
  return (
    <>
    <div className="flex justify-center overflow-y-auto rounded-xl">
            <table className='w-screen text-center h-fit'>
                <thead className='bg-secondary sticky top-0'>
                    <tr>
                        <th className="text-left bg-secondary p-2 ">Title</th>
                        <th className="text-left bg-secondary p-2 ">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((forms, index) => (
                          <tr 
                            key={index} 
                            className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                          >
                              <td className="text-center p-2">{forms.title}</td>
                              <td className= "flex justify-center p-3">
                                <button title="Restore Activity Form" onClick={() => handleRestoreFormClick(forms)}>
                                    <ArrowLeftStartOnRectangleIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                                </button>
                                <button title="Delete Activity Form" onClick={() => handleDeleteFormClick(forms)}>
                                    <TrashIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                                </button>
                              </td>
                            </tr>
                            ))}
                </tbody>
            </table>
        </div>

        {/** Modal For Form ARCHIVE */}                
        <ReactModal
            isOpen={isRestoreFormModalOpen}
            onRequestClose={() => setIsRestoreFormModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <RestoreActivityModal
                 closeModal={() => setIsRestoreFormModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>

        {/** Modal For Form ARCHIVE */}                
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
