import React, { useRef, useState, useEffect } from 'react';
import { useStateContext } from '../../../context/ContextProvider';
import { Navigate } from 'react-router-dom';
import LandingPage1 from '../components/landingPage/LandingPage1';
import LandingPage2 from '../components/landingPage/LandingPage2';
import LandingPage3 from '../components/landingPage/LandingPage3';
import LandingPage4 from '../components/landingPage/LandingPage4';
import LandingPage5 from '../components/landingPage/LandingPage5';

export default function GuestLayout() {
  const { userToken, currentUser } = useStateContext();
  const [pageSection, setPageSection] = useState('');
  const landingPageRefs = {
    landingPage1Ref: useRef(null),
    landingPage2Ref: useRef(null),
    landingPage3Ref: useRef(null),
    landingPage4Ref: useRef(null),
    landingPage5Ref: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = Object.values(landingPageRefs).map(ref => ref.current.offsetTop);

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i]) {
          setPageSection(getPageSectionName(i));
          break;
        }
      }
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [landingPageRefs]);

  const scrollToSection = (ref, sectionName) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setPageSection(sectionName);
  };

  // Function to get page section name based on index
  const getPageSectionName = (index) => {
    switch (index) {
      case 0:
        return 'Activities';
      case 1:
        return 'Mission & Vision';
      case 2:
        return 'Goals';
      case 3:
        return 'Focal Points System';
      case 4:
        return 'Login';
      default:
        return '';
    }
  };

  // Redirect if user is logged in with certain roles
  if (userToken && currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else if (userToken && currentUser.role === 'college') {
    return <Navigate to="/user/forms" />;
  }

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-proximity">
      {/* Navigation bar */}
      <nav className="absolute flex flex-col items-center justify-center top-0 bg-secondary opacity-20 hover:opacity-70 h-[13%] w-full z-50 p-10">
        <ul className="flex justify-center text-left font-bold">
          <li className="cursor-pointer px-4 py-2 hover:bg-accent hover:scale-125" onClick={() => scrollToSection(landingPageRefs.landingPage1Ref, 'Activities')}>Activities</li>
          <li className="cursor-pointer px-4 py-2 hover:bg-accent hover:scale-125" onClick={() => scrollToSection(landingPageRefs.landingPage2Ref, 'Mission & Vision')}>Mission & Vision</li>
          <li className="cursor-pointer px-4 py-2 hover:bg-accent hover:scale-125" onClick={() => scrollToSection(landingPageRefs.landingPage3Ref, 'Goals')}>Goals</li>
          <li className="cursor-pointer px-4 py-2 hover:bg-accent hover:scale-125" onClick={() => scrollToSection(landingPageRefs.landingPage4Ref, 'Focal Points System')}>Focal Points System</li>
          <li className="cursor-pointer px-4 py-2 hover:bg-accent hover:scale-125" onClick={() => scrollToSection(landingPageRefs.landingPage5Ref, 'Login')}>Login</li>
        </ul>
        {/* <div className='font-bold text-4xl'>
          {pageSection}
        </div> */}
      </nav>

      <div className="snap-center h-screen" ref={landingPageRefs.landingPage1Ref}>
        <LandingPage5 />
      </div>

      <div className="snap-center h-screen" ref={landingPageRefs.landingPage2Ref}>
        <LandingPage2 />
      </div>
      
      <div className="snap-center h-screen" ref={landingPageRefs.landingPage3Ref}>
        <LandingPage3 />
      </div>

      <div className="snap-center h-screen" ref={landingPageRefs.landingPage4Ref}>
        <LandingPage4 />
      </div>

      <div className="snap-center h-screen" ref={landingPageRefs.landingPage5Ref}>
        <LandingPage1 />
      </div>

    </div>
  );
}
