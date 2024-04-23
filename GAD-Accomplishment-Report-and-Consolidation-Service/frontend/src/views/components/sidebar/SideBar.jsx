import React, { useState } from 'react';
import NeutralButton from '../buttons/NeutralButton';
import ReactModal from 'react-modal';

// For Modal
import AddUserModal from '../../authorizedView/admin/components/ManageUser/Modals/AddUserModal';
import ArchivedUser from '../../authorizedView/admin/components/ManageUser/ArchivedUser';
import ArchivedActivityForms from '../../authorizedView/Forms/submitedForms/activityForms/ArchivedActivityForms';
import ArchivedReports from '../../authorizedView/Forms/submitedForms/accomplishmentReport/components/ArchivedReports';
import ShowArchiveMandates from '../../authorizedView/admin/components/mandates/components/ShowArchiveMandates';
import AddMandatesModal from '../../authorizedView/admin/components/mandates/components/modals/AddMandatesModal';

export default function SideBar() {

    const [arbitrary, setArbitrary] = useState({
        users: 29,
        design: 78,
        pending: 58,
        completed: 20,
    })

    // For Modals
    const [modals, setModals] = useState({
        addUser: false,
        archivedUser: false,
        archivedForm: false,
        archivedReports: false,
        showArchiveMandate: false,
        showAddMandateModal: false
    });

    const toggleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const sidebarItems = [
        { label: 'Add User', onClick: () => toggleModal('addUser', true) },
        { label: 'Add Mandate', onClick: () => toggleModal('showAddMandateModal', true) },
        { label: 'Archived Users List', onClick: () => toggleModal('archivedUser', true) },
        { label: 'Archived Mandates List', onClick: () => toggleModal('showArchiveMandate', true) },
        { label: 'Archived Forms List', onClick: () => toggleModal('archivedForm', true) },
        { label: 'Archived Accomplishment Report List', onClick: () => toggleModal('archivedReports', true) },
    ];

    const sidebarList = [
        { label: 'Total Users: ' + arbitrary.users},
        { label: 'Training Designs Submitted: ' + arbitrary.design},
        { label: 'Pending Accomplishment Reports: ' + arbitrary.pending},
        { label: 'Accomplisment Reports: ' + arbitrary.completed},
    ];


    const style = "w-full md:w-[30%] max-h-[95%] min-h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl my-[1%] mx-auto p-5"
    
    return (
        <div className="sidebar space-y-5">
            <ul className="sidebar-list">
                {sidebarItems.map((item, index) => (
                    <li key={index} className='pt-3'>
                        <NeutralButton label={item.label} onClick={item.onClick} />
                    </li>
                ))}
            </ul>
            <div className='border-2 border-black p-5'>
                <ul className="sidebar-list-2">
                    {sidebarList.map((item, index) => (
                        <li key={index} className='pt-3'>
                            <label>{item.label}</label>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Modals */}
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
                    <ArchivedReports closeModal={() => toggleModal('archivedReports', false)} />
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
        </div>
    );
}
