import React, { useState } from 'react';
import Submit from '../../components/buttons/Submit';
import axiosClient from '../../axios/axios';
import { useStateContext } from '../../../context/ContextProvider';
import Error from '../../components/feedbacks/Error';
import Feedback from '../../components/feedbacks/Feedback';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser, setUserToken } = useStateContext();

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

   //---
   const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPassword ? 'text' : 'password';
  //---

  const onSubmit = (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    axiosClient
      .post('/login', {
        email,
        password,
      })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
      })
      .catch((error) => {
        console.error(error);
        setAxiosMessage(error.response.data.message);
        setAxiosStatus(false);
      });
  };

  return (
    <div className="p-5 h-full flex justify-center items-center">
      
      {/* Integrate the Success component */}
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <form onSubmit={onSubmit} className="flex flex-col w-full items-center">
        <label htmlFor="Email" className="mb-1">Email: </label>
        <input
          placeholder={'example@email.com'}
          id="email"
          name="email"
          type="text"
          autoComplete="email"
          required
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
        />
        <label htmlFor="password" className="my-1 ">Password: </label>
        <input
          placeholder={'Input Password'}
          id="password"
          name="password"
          type={inputType}
          autoComplete="password"
          required
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
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
          <Submit label="Login" />
        </div>
      </form> 
    </div>
  );
}
