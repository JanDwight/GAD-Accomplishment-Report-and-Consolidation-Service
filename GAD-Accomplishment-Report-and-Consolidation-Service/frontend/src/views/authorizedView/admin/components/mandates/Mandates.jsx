import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../axios/axios';
import { ArchiveBoxArrowDownIcon, PencilIcon } from '@heroicons/react/24/solid';
import ReactModal from 'react-modal';
import EditMandatesModal from './components/modals/EditMandatesModal';
import ViewMandatesModal from './components/modals/ViewMandatesModal';
import ArchiveMandateModal from './components/modals/ArchiveMandateModal';
import LoadingHorizontalLine from '../../../../components/feedbacks/LoadingHorizontalLine';

export default function Mandates() {
  const [mandates, setMandates] = useState([]);
  const [selectedMandate, setSelectedMandate] = useState('')
  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

  //For Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // For Mandate EDIT
  const handleEditClick = (selected_mandate) => {
    setIsEditModalOpen(true)
    setSelectedMandate([selected_mandate]);
  }

  // For Form Archive
  const handleArchiveClick = (selected_mandate) => {
    setIsArchiveModalOpen(true)
    setSelectedMandate(selected_mandate)
  }

  // For View
  const handleView = (selected_mandate) => {
    setIsViewModalOpen(true)
    setSelectedMandate(selected_mandate)
  }

  useEffect(() => {
    const fetchMandates = async () => {
      setIsHorizontalLoading(true);

      try {
        const { data } = await axiosClient.get('/showmandates');
        Array.isArray(data) ? setMandates(data) : console.error('Invalid response format:', data);
        setIsHorizontalLoading(false);
      } catch (error) {
        console.error('Error fetching mandates:', error);
      }
    };

    fetchMandates();
  }, []);

  const TableHeader = ({ title }) => (
    <th className="mx-1 py-2 px-5 text-xs">{title}</th>
  );
  
  return (
    <div className='h-full'>
      <div className='bg-white flex h-full overflow-y-auto rounded-xl relative'>

        {/* Loading Horizontal Line */}
        {isHorizontalLoading && (
          <div className="absolute top-[5%] left-0 w-full">
            <LoadingHorizontalLine isLoading={isHorizontalLoading}/>
          </div>
        )}

        <table className='w-screen text-center h-fit'>
          <thead className='bg-secondary sticky top-0'>
            <tr>
              <TableHeader title="Gender Issue" />
              <TableHeader title="Actions" />
            </tr>
          </thead>
          <tbody>
            {mandates.map((mandate, index) => (
              <tr key={index} className='px-10 border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs transition-transform hover:scale-sm'>
                <td className="text-left pl-9 w-[90%]" onClick={() => handleView(mandate)}>{index+1}) {mandate.gender_issue}</td>
                <td className="text-center p-2">
                  <ul className='flex flex-row items-center justify-center'>
                    <li>
                      <PencilIcon onClick={() => handleEditClick(mandate)} className='h-5 w-5 mx-1 cursor-pointer transition-transform hover:scale-1xl' />
                    </li>
                    <li>
                      <ArchiveBoxArrowDownIcon onClick={() => handleArchiveClick(mandate)} className='h-5 w-5 mx-1 cursor-pointer transition-transform hover:scale-1xl' />
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/** Modal For Mandate EDIT */}
      <ReactModal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            className="w-full md:w-fit h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5"
        >
            <EditMandatesModal 
                closeModal={() => setIsEditModalOpen(false)}
                mandateSelected={selectedMandate}
            />
      </ReactModal>

        {/** Modal For Mandate ARCHIVE */}                
        <ReactModal
            isOpen={isArchiveModalOpen}
            onRequestClose={() => setIsArchiveModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <ArchiveMandateModal
                 closeModal={() => setIsArchiveModalOpen(false)}
                 mandateSelected={selectedMandate}
                 />
            </div>
        </ReactModal>
      
      {/** Modal For Mandate VIEW */}
      <ReactModal
            isOpen={isViewModalOpen}
            onRequestClose={() => setIsViewModalOpen(false)}
            className="w-full md:w-fit h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5"
        >
            <ViewMandatesModal 
                closeModal={() => setIsViewModalOpen(false)}
                mandateSelected={selectedMandate}
            />
      </ReactModal>
    </div>
  );
}


