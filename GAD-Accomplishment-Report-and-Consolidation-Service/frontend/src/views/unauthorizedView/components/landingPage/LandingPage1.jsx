import React from 'react';
import Login from '../../components/Login';
import imageSrc from '../../../../TMP/image.png';
import GADLogo from '../../../../TMP/GAD_Logo.png';

export default function LandingPage1() {
  return (
    <div className='flex bg-gradient-to-r from-primary via-purple-800 to-purple-950'>
        <div className='w-[60%]'>
          <Login />
        </div>
        <div className='mx-auto w-[20%] max-w-[60%]'>
            {/* Add a function that allows the user to change this image */}
            <img src={GADLogo} alt="" className='w-full h-screen object-contain' />
        </div>
    </div>
  );
}
