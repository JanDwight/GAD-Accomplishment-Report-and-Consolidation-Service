import { React, useState } from 'react';
import Submit from '../../../../../components/buttons/Submit';
import axiosClient from '../../../../../axios/axios';
import Feedback from '../../../../../components/feedbacks/Feedback';

export default function EditUserModal({ selectedUser }) {
  
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const [updatedUser, setUpdatedUser] = useState({
    username: selectedUser.username,
    email: selectedUser.email
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    
    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');
    
    try {
      const response = await axiosClient.put(`/updateuser/${selectedUser.id}`, updatedUser);
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };
  

  return (
    <>

      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <form onSubmit={onSubmit} className='flex flex-1 flex-col'>
        <label htmlFor="email">Email: </label>
        <input
          placeholder={'example@email.com'}
          id="email"
          name="email"
          type="text"
          autoComplete="email"
          className='bg-gray-200 px-2'
          value={updatedUser.email}
          onChange={ev => setUpdatedUser({ ...updatedUser, email: ev.target.value })}
        />

        <label htmlFor="username">User Name: </label>
        <input
          placeholder={'Name of College'}
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className='bg-gray-200 px-2'
          value={updatedUser.username}
          onChange={ev => setUpdatedUser({ ...updatedUser, username: ev.target.value })}
        />

        {/**BUTTONS */}
        <div className='mt-5 flex justify-center'>
          <Submit label="Edit User" /*disabled={ your condition }*/ />
        </div>
      </form>
    </>
  );
}
