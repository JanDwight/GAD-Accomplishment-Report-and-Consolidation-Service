import React, { useState, useEffect } from 'react';
import NeutralButton from '../buttons/NeutralButton';
import ReactModal from 'react-modal';
import axiosClient from '../../axios/axios';
import GADLogo from '../../../../src/TMP/GAD_Logo.png'

// For Modal
import AddUserModal from '../../authorizedView/admin/components/ManageUser/Modals/AddUserModal';
import ArchivedUser from '../../authorizedView/admin/components/ManageUser/ArchivedUser';
import ArchivedActivityForms from '../../authorizedView/Forms/submitedForms/activityForms/ArchivedActivityForms';
import ArchivedReportsList from '../../authorizedView/Forms/submitedForms/accomplishmentReport/components/ArchivedReportsList';
import ShowArchiveMandates from '../../authorizedView/admin/components/mandates/components/ShowArchiveMandates';
import AddMandatesModal from '../../authorizedView/admin/components/mandates/components/modals/AddMandatesModal';
import Feedback from '../feedbacks/Feedback';
import ArchivedPdfs from '../../authorizedView/admin/components/previousReports/components/ArchivedPdfs';

export default function SideBar() {
    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');

    // For Modals
    const [modals, setModals] = useState({
        addUser: false,
        archivedUser: false,
        archivedForm: false,
        archivedReports: false,
        showArchiveMandate: false,
        showAddMandateModal: false,
        showRestore: false,
        showLogs: false,
        showArchivedPdf: false
    });

    const handleBackup = () => {

        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');
        
        axiosClient.post('/backup')
          .then(response => {
            setAxiosMessage(response.data.message);
            setAxiosStatus(response.data.success);
          })
          .catch(error => {
            setAxiosMessage(error.response.data.message);
            setAxiosStatus(false);
          });
      };

    const toggleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const sidebarItems = [
        { label: 'Add User', onClick: () => toggleModal('addUser', true) },
        { label: 'Add Mandate', onClick: () => toggleModal('showAddMandateModal', true) },
        { label: 'Archived Users', onClick: () => toggleModal('archivedUser', true) },
        { label: 'Archived Mandates', onClick: () => toggleModal('showArchiveMandate', true) },
        { label: 'Archived Forms', onClick: () => toggleModal('archivedForm', true) },
        { label: 'Archived Accomplishment Reports', onClick: () => toggleModal('archivedReports', true) },
        { label: 'Archived PDFs', onClick: () => toggleModal('showArchivedPdf', true) },
        { label: 'Backup', onClick: () => handleBackup() },
    ];

    const style = "max-w-[90%] w-fit max-h-[95%] min-h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl my-[1%] mx-auto p-5 overflow-y-auto"
    

    return (
        <div className="sidebar">
            
        <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={true}/>

            <div className='flex justify-center'>
                <img src={GADLogo} alt="" className='w-[65%] h-[65%]  transform transition-transform hover:scale-125' />
            </div>
            <div className='py-1'>
                <ul className="sidebar-list">
                    {sidebarItems.map((item, index) => (
                        <li key={index} className='pt-1'>
                            <NeutralButton label={item.label} onClick={item.onClick} />
                        </li>
                    ))}
                </ul>
            </div>
            <ReactModal
                isOpen={modals.addUser}
                onRequestClose={() => toggleModal('addUser', false)}
                className={style}
            >
                    <AddUserModal closeModal={() => toggleModal('addUser', false)} />
            </ReactModal>

            <ReactModal
              isOpen={modals.showAddMandateModal}
              onRequestClose={() => toggleModal('showAddMandateModal', false)}
              className={style}
            >
              <AddMandatesModal 
                closeModal={() => toggleModal('showAddMandateModal',false)}
              />
            </ReactModal>

            <ReactModal
                isOpen={modals.archivedUser}
                onRequestClose={() => toggleModal('archivedUser', false)}
                className={style}
            >
                <div>
                    <ArchivedUser closeModal={() => toggleModal('archivedUser', false)} />
                </div>
            </ReactModal>

            <ReactModal
                isOpen={modals.archivedForm}
                onRequestClose={() => toggleModal('archivedForm', false)}
                className={style}
            >
                <div>
                    <ArchivedActivityForms closeModal={() => toggleModal('archivedForm', false)} />
                </div>
            </ReactModal>

            <ReactModal
                isOpen={modals.archivedReports}
                onRequestClose={() => toggleModal('archivedReports', false)}
                className={style}
            >
                <div>
                    <ArchivedReportsList closeModal={() => toggleModal('archivedReports', false)} />
                </div>
            </ReactModal>

            <ReactModal
                isOpen={modals.showArchiveMandate}
                onRequestClose={() => toggleModal('showArchiveMandate', false)}
                className={style}
            >
                <div>
                    <ShowArchiveMandates closeModal={() => toggleModal('showArchiveMandate', false)} />
                </div>
            </ReactModal>

            <ReactModal
                isOpen={modals.showArchivedPdf}
                onRequestClose={() => toggleModal('showArchivedPdf', false)}
                className={style}
            >
                <div>
                    <ArchivedPdfs closeModal={() => toggleModal('showArchivedPdf', false)} />
                </div>
            </ReactModal>

        </div>
    );
}
