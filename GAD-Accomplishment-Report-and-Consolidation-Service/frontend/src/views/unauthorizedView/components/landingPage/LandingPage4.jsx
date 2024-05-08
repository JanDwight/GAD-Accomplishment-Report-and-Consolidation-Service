import React, { useState, useEffect } from 'react';
import {ArrowLeftCircleIcon, ArrowRightCircleIcon} from '@heroicons/react/24/solid';
import img from '../../../../TMP/image20.png';

export default function LandingPage4() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      content: (
        <div>
          <h2 className='text-3xl font-bold mb-4'>
            I. Learning & Development
          </h2>
          <ul className='text-2xl list-disc list-inside text-left'>
            <li>Gender Sensitivity Training (GST)</li>
            <li>GAD Planning and Budgeting (GPB)</li>
            <li>Gender Mainstreaming in various Thematic areas</li>
            <li>Gender Analysis (GA)</li>
            <li>GAD Agenda Formulation</li>
            <li>GA Tools (HGDG/ GMEF/ GeRL)</li>
          </ul>
        </div>
      )
    },
    {
      content: (
        <div>
          <h1 className='text-3xl font-bold mb-4'>
            II. Technical Assistance through Gender Responsive Extension Program (GREP)
          </h1>
        </div>
      )
    },
    {
      content: (
        <div>
          <h1 className='text-3xl font-bold mb-4'>
            III. Gender Responsive Research Program (GRRP)
          </h1>
        </div>
      )
    },
    {
      content: (
        <div>
          <h1 className='text-3xl font-bold mb-4'>
            IV. Establishment/ Maintenance of Gender Responsive Facility
          </h1>
          <ul className='text-2xl list-disc list-inside text-left'>
            <li>Breast feeding/ Lactation Room</li>
            <li>Child Minding Center</li>
          </ul>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

    //for auto slides
    useEffect(() => {
      const slideInterval = setInterval(nextSlide, 5000); // Slide to next image every 3 seconds
 
      // Clear interval on component unmount to prevent memory leaks
      return () => {
        clearInterval(slideInterval);
      };
    }, [activeSlide]); // Re-run effect when currentIndex changes

  return (
    <div 
      className='overflow-hidden h-screen flex items-center justify-center relative'
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}    
    >
      
      {/* Overlay with opacity */}
      <div className='absolute inset-0 bg-secondary opacity-10'></div>

      <div className={'flex flex-col items-center justify-center p-2 w-full bg-opacity-70 bg-primary relative z-10'}>
          <h1 className='text-4xl font-bold mb-4'>
            GAD Focal Point System (GFPS) Services
          </h1>
        {slides[activeSlide].content}
      </div>

      <div className='absolute inset-x-0 bottom-4 flex items-center justify-center'>
        {slides.map((index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mx-1 w-4 h-4 rounded-full ${activeSlide === index ? 'bg-accent' : 'bg-gray-400'}`}
          ></button>
        ))}
      </div>

      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          className='bg-black h-screen w-[5%] bg-opacity-10 hover:bg-opacity-30'
          onClick={prevSlide}
        >
          <ArrowLeftCircleIcon />
        </button>
        <button
          className='bg-black h-screen w-[5%] bg-opacity-10 hover:bg-opacity-30'
          onClick={nextSlide}
        >
          <ArrowRightCircleIcon />
        </button>
      </div>
    </div>
  );
}
