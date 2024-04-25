import React, { useState, useEffect } from 'react';
import NeutralButton from '../buttons/NeutralButton';
import ReactModal from 'react-modal';
import axiosClient from '../../axios/axios';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import GADLogo from '../../../../src/TMP/GAD_Logo.png'

// For Modal
import AddUserModal from '../../authorizedView/admin/components/ManageUser/Modals/AddUserModal';
import ArchivedUser from '../../authorizedView/admin/components/ManageUser/ArchivedUser';
import ArchivedActivityForms from '../../authorizedView/Forms/submitedForms/activityForms/ArchivedActivityForms';
import ArchivedReports from '../../authorizedView/Forms/submitedForms/accomplishmentReport/components/ArchivedReports';
import ShowArchiveMandates from '../../authorizedView/admin/components/mandates/components/ShowArchiveMandates';
import AddMandatesModal from '../../authorizedView/admin/components/mandates/components/modals/AddMandatesModal';

export default function SideBar() {

    const [arbitrary, setArbitrary] = useState({
        users: '',
        design: '',
        pending: '',
        completed: '',
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
        { label: 'Archived Users', onClick: () => toggleModal('archivedUser', true) },
        { label: 'Archived Mandates', onClick: () => toggleModal('showArchiveMandate', true) },
        { label: 'Archived Forms', onClick: () => toggleModal('archivedForm', true) },
        { label: 'Archived Accomplishment Reports', onClick: () => toggleModal('archivedReports', true) },
    ];

    const sidebarList = [
        { label: 'Total Users: ', val: arbitrary.users},
        { label: 'Total Training Designs: ', val: arbitrary.design},
        { label: 'Pending Accomplishment Reports: ', val: arbitrary.pending},
        { label: 'Accomplisment Reports: ', val: arbitrary.completed},
    ];

    const style = "w-full md:w-[30%] max-h-[95%] min-h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl my-[1%] mx-auto p-5"
    
    useEffect(() => {
        fetchCounts();
      }, []);
    
    const fetchCounts = async () => {
      try {
        const response = await axiosClient.get('/counter');
        if (response.data && response.data) {
          console.log("Return: ", response.data);
          setArbitrary(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
        <div className="sidebar">
            <div className='flex justify-center'>
                <img src={GADLogo} alt="" className='w-[65%] h-[65%] object-contain' />
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
            <div className='mt-2 border-2 shadow-2 px-5 rounded-lg py-2'>
                <table>
                    <tbody>
                    {sidebarList.map((item, index) => (
                        <tr key={index} className='pt-1 text font-semibold'>
                            <td className='border-b border-secondary'> <a className='text-xs'>{item.label}</a> </td>
                            <td><b>{item.val}</b></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
