import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios/axios';
import Submit from '../../components/buttons/Submit';
import Feedback from '../../components/feedbacks/Feedback';

export default function MyProfile() {
  const [data, setData] = useState({
    id: '',
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get('/profile');
        setData(response.data.message ); // Assuming response.data contains email and password
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const inputType = showPassword ? 'text' : 'password';

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try {
      const response = await axiosClient.put(`/updateuser/${data.id}`, data);
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };

  return (
    <div className='h-full'>
      
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <div className='bg-white flex h-full overflow-y-auto rounded-xl relative'>
        <div className='w-full text-center'>
          <h1 className='text-center w-full text-2xl font-bold my-2'>
            Your Profile
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col w-full items-center">
            <label htmlFor="username" className="mb-1">User Name: </label>
            <input
              placeholder={data.username}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={data.username }
              onChange={(ev) => setData({ ...data, username: ev.target.value })}
              className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
            />
            <label htmlFor="email" className="mb-1">Email: </label>
            <input
              placeholder={data.email}
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              value={data.email }
              onChange={(ev) => setData({ ...data, email: ev.target.value })}
              className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
            />
            <label htmlFor="password" className="my-1">Password: </label>
            <input
              placeholder={'Input Password'}
              id="password"
              name="password"
              type={inputType}
              autoComplete="password"
              value={data.password}
              onChange={(ev) => setData({ ...data, password: ev.target.value })}
              className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
            />
            <div className='w-[80%] flex space-x-2 justify-end pt-1 px-2'>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={handlePasswordVisibility}
              />
              <label htmlFor="showPassword" className="text-sm">Show Password</label>
            </div>

            <div className="mt-5">
              <Submit label="Update" />
            </div>
          </form> 
        </div>
      </div>
    </div>
  );
}
