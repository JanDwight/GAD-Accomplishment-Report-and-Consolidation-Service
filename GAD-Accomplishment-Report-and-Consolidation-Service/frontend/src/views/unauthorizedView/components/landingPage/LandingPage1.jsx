import React from 'react';
import Login from '../../components/Login';
import GADLogo from '../../../../TMP/GAD_Logo.png';
import Footer from '../../../components/footer/Footer';

export default function LandingPage1() {
  return (
    <div className='flex bg-gradient-to-r from-primary via-purple-800 to-purple-950 relative'>
        <div className='w-[60%]'>
          <Login />
        </div>
        <div className='mx-auto w-[20%] max-w-[60%]'>
            {/* Add a function that allows the user to change this image */}
            <img src={GADLogo} alt="" className='w-full h-screen object-contain' />
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[25%]">
          <Footer />
        </div>
    </div>
  );
}
