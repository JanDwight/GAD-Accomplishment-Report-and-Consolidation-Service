import { React, useState } from 'react';
import Submit from '../../../../../components/buttons/Submit';
import axiosClient from '../../../../../axios/axios';
import Feedback from '../../../../../components/feedbacks/Feedback';

export default function EditUserModal({ selectedUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const [updatedUser, setUpdatedUser] = useState({
    username: selectedUser.username,
    email: selectedUser.email,
    password: ''
  });

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPassword ? 'text' : 'password';

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

        <label htmlFor="password" className="my-1">Password: </label>
        <input
          placeholder={'Input Password'}
          id="password"
          name="password"
          type={inputType}
          autoComplete="password"
          value={updatedUser.password}
          onChange={(ev) => setUpdatedUser({ ...updatedUser, password: ev.target.value })}
          className='bg-gray-200 px-2'
        />
        <div className='flex space-x-2 justify-end pt-1 px-2'>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handlePasswordVisibility}
          />
          <label htmlFor="showPassword" className="text-sm">Show Password</label>
        </div>

        {/**BUTTONS */}
        <div className='mt-5 flex justify-center'>
          <Submit label="Edit User" /*disabled={ your condition }*/ />
        </div>
      </form>
    </>
  );
}
