import { React, useState, useEffect } from 'react'
import axiosClient from '../../../../axios/axios';
import { ArrowLeftStartOnRectangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import ReactModal from 'react-modal';
import RestoreUserModal from './Modals/RestoreUserModal';
import DeleteUserModal from './Modals/DeleteUserModal';

export default function ArchivedUser() {
    const [filterText, setFilterText] = useState(''); //for search

    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState('')
    const [isRestoreUserModalOpen, setIsRestoreUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

    useEffect(() => {
        fetchCurriculum();
      }, []);
    
    const fetchCurriculum = async () => {
      try {
        const response = await axiosClient.get('/showarchivedusers');
        if (response.data && response.data) {
          setUsers(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // for search function
    const filteredData = users.filter(
        (user) =>
          user.username && user.username.toString().includes(filterText) ||
          user.email && user.email.toString().includes(filterText)
      );

    // For User RESTOREUSER
    const handleRestoreUserClick = (selected_user) => {
        setIsRestoreUserModalOpen(true)
        setSelectedUser(selected_user)
    }

    // For User RESTOREUSER
    const handleDeleteUserClick = (selected_user) => {
        setIsDeleteUserModalOpen(true)
        setSelectedUser(selected_user)
    }

  return (
    <>
    <div className="h-full">
      <div className='bg-white flex h-full overflow-y-auto rounded-xl'>
        <table className='w-screen text-center h-fit'>
          <thead className='bg-secondary sticky top-0'>
              <tr>
                  <th className="text-left bg-secondary p-2 ">User Name</th>
                  <th className="text-left bg-secondary p-2 ">Email</th>
                  <th className="text-left bg-secondary p-2 ">Actions</th>
              </tr>
          </thead>
          <tbody>
            {filteredData.map((users, index) => (
              <tr 
                key={index} 
                className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
              >
                <td className="text-center p-2">{users.username}</td>
                <td className="text-center p-2">{users.email}</td>
                <td className= "flex items-center p-3">
                  <button title="Restore User" onClick={() => handleRestoreUserClick(users)}>
                      <ArrowLeftStartOnRectangleIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                  </button>
                  <button title="Delete User" onClick={() => handleDeleteUserClick(users)}>
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
            isOpen={isRestoreUserModalOpen}
            onRequestClose={() => setIsRestoreUserModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <RestoreUserModal
                 closeModal={() => setIsRestoreUserModalOpen(false)}
                 selectedUser={selectedUser}
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
                <DeleteUserModal
                 closeModal={() => setIsDeleteUserModalOpen(false)}
                 selectedUser={selectedUser}
                 />
            </div>
        </ReactModal>
    </>
  )
}
