import React from 'react';
import { useStateContext } from '../../../context/ContextProvider';
import { Navigate } from 'react-router-dom';
import LandingPage1 from '../components/landingPage/LandingPage1';
import LandingPage2 from '../components/landingPage/LandingPage2';
import LandingPage3 from '../components/landingPage/LandingPage3';
import LandingPage4 from '../components/landingPage/LandingPage4';
import LandingPage5 from '../components/landingPage/LandingPage5';

export default function GuestLayout() {
  const { userToken, currentUser } = useStateContext();

  /**When the LOGIN is SUCCESS user token is used to redirect inside the webpage */
  if (userToken && currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else if (userToken && currentUser.role === 'college') {
    return <Navigate to="/college" />;
  }

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-proximity">
      <div className="snap-center h-screen">
        <LandingPage1 />
      </div>

      <div className="snap-center h-screen">
        <LandingPage2 />
      </div>
      
      <div className="snap-center h-screen">
        <LandingPage3 />
      </div>

      <div className="snap-center h-screen">
        <LandingPage4 />
      </div>

      <div className="snap-center h-screen">
        <LandingPage5 />
      </div>
    </div>
  );
}
