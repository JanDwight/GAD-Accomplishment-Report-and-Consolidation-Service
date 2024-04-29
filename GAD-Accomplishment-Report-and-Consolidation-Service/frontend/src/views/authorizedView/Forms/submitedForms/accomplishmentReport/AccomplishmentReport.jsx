import { React, useState, useEffect } from 'react';
import axiosClient from '../../../../axios/axios';
import { ArchiveBoxArrowDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import ReactModal from 'react-modal';
import ViewEADReportModal from '../activityForms/components/modals/ViewEADReportModal';
import EditActivityModal from '../activityForms/components/modals/EditActivityModal';
import ShowActivityModal from './components/modals/ShowActivityModal';
import LoadingHorizontalLine from '../../../../components/feedbacks/LoadingHorizontalLine';
import ArchivedReports from './components/ArchivedReports';
import ArchiveReportModal from './components/modals/ArchiveReportModal';

export default function AccomplishmentReport() {
  const [accomplishmentReport, setAccomplishmentreport] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

  // For Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsHorizontalLoading(true);

    try {
      const response = await axiosClient.get('/show_accomplishment_report');
      setAccomplishmentreport(response.data);
      setIsHorizontalLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // For Form EDIT
  const handleViewClick = (selected_form) => {
    setIsEditModalOpen(true);
    setSelectedForm(selected_form);
  };

  // For Form Archive
  const handleArchiveClick = (selected_form) => {
    setIsArchiveModalOpen(true);
    setSelectedForm(selected_form);
  };

  // For Unified Inputs 
  const UnifiedStyle = {
    tdClassName: "text-center p-2",
    thClassName: "px-4 py-3",
    titleClassname: "w-[65%] text-center p-2"
  };

  return (
    <div className='h-full'>
      <div className="bg-white flex h-full overflow-y-auto rounded-xl relative">

        {/* Loading Horizontal Line */}
        {isHorizontalLoading && (
          <div className="absolute top-[5%] left-0 w-full">
            <LoadingHorizontalLine isLoading={isHorizontalLoading}/>
          </div>
        )}

        <table className="w-screen text-center h-fit">
            <thead className='bg-secondary sticky top-0'>
              <tr>
                <th className={UnifiedStyle.titleClassname}>Title</th>
                <th className={UnifiedStyle.thClassName}>Proponent</th>
                <th className={UnifiedStyle.thClassName}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accomplishmentReport.map((formEntry) => (
                <tr key={formEntry.id} 
                  className='px-10 border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs transition-transform hover:scale-sm'>
                    <td className={UnifiedStyle.titleClassname} onClick={() => handleViewClick(formEntry)}>{formEntry.title}</td>
                    <td className={UnifiedStyle.tdClassName} >{formEntry.owner}</td>
                    <td className={UnifiedStyle.tdClassName}>
                    <button onClick={() => handleViewClick(formEntry)}>
                      <PencilIcon className='h-5 w-5 mx-1 cursor-pointer transition-transform hover:scale-1xl' />
                    </button>
                    <button onClick={() => handleArchiveClick(formEntry)}>
                      <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer  transition-transform hover:scale-1xl' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/** Modal For User EDIT */}
      <ReactModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="w-full md:w-[30%] lg:w-[60%] h-[80%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5 overflow-auto"
      >
        <div>
          {selectedForm && selectedForm.forms && selectedForm.forms.form_type === 'EAD' ? (
            <ViewEADReportModal closeModal={() => setIsEditModalOpen(false)} selectedForm={selectedForm} />
          ) : (
            <ShowActivityModal closeModal={() => setIsEditModalOpen(false)} selectedForm={selectedForm} />
          )}
        </div>
      </ReactModal>

      {/** Modal For Mandate ARCHIVE */}                
      <ReactModal
          isOpen={isArchiveModalOpen}
          onRequestClose={() => setIsArchiveModalOpen(false)}
          className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
      >
          <div>
              <ArchiveReportModal
               closeModal={() => setIsArchiveModalOpen(false)}
               selectedForm={selectedForm}
               />
          </div>
      </ReactModal>
    </div>
  );
}
