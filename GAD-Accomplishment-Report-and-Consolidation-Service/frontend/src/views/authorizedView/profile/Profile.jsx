import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios/axios';
import Submit from '../../components/buttons/Submit';
import Feedback from '../../components/feedbacks/Feedback';
import AddImages from '../../components/image/Addimages';

export default function MyProfile() {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    image: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImagesChange = (selectedImages) => {
    // Update the userData state with the array of selected images
    setUserData(prevData => ({
      ...prevData,
      image: selectedImages
    }));
  };
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get('/profile');
        setUserData(response.data.message); // Assuming response.data contains email, username, etc.
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
      const formData = new FormData();
      formData.append('id', userData.id); // Ensure id is included if needed
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      
      if (userData.password) {
        formData.append('password', userData.password);
      }

      // Check if more than one image is present in userData.image
      if (userData.image && userData.image.length > 1) {
        setAxiosMessage('Please select 1 logo only');
        setAxiosStatus(false);
        return;
      }

      // Append image data if available
      if (userData.image && userData.image.length > 0) {
        formData.append('image', userData.image[0]);
      }
  
      const response = await axiosClient.post(`/updateuser/${userData.id}`, formData);
  
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      console.error(error);
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
              placeholder={userData.username}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={userData.username}
              onChange={(ev) => setUserData(prevData => ({ ...prevData, username: ev.target.value }))}
              className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
            />
            <label htmlFor="email" className="mb-1">Email: </label>
            <input
              placeholder={userData.email}
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              value={userData.email}
              onChange={(ev) => setUserData(prevData => ({ ...prevData, email: ev.target.value }))}
              className='w-[80%] border-solid border-2 border-primary focus:border-accent focus:outline-none rounded-lg p-2'
            />
            <label htmlFor="password" className="my-1">Password: </label>
            <input
              placeholder={'Input Password'}
              id="password"
              name="password"
              type={inputType}
              autoComplete="password"
              value={userData.password}
              onChange={(ev) => setUserData(prevData => ({ ...prevData, password: ev.target.value }))}
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
            <div className='flex justify-center mt-5'>
              <AddImages onImagesChange={handleImagesChange} />
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
