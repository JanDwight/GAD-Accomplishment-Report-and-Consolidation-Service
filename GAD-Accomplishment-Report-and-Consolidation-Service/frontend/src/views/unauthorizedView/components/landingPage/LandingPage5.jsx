import React, { useState, useEffect } from 'react';
import {ArrowLeftCircleIcon, ArrowRightCircleIcon} from '@heroicons/react/24/solid'
import img1 from '../../../../TMP/image1.jpg';
import img3 from '../../../../TMP/image3.jpg';
import img4 from '../../../../TMP/image4.jpg';
import img5 from '../../../../TMP/image5.jpg';
import img6 from '../../../../TMP/image6.jpg';
import img7 from '../../../../TMP/image7.jpg';
import img8 from '../../../../TMP/image8.jpg';
import img9 from '../../../../TMP/image9.jpg';

export default function LandingPage5() {
  const images = [img1, img3, img4, img5, img6, img7, img8, img9]; // Add more images as needed
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  //for auto slides
   useEffect(() => {
     const slideInterval = setInterval(nextSlide, 5000); // Slide to next image every 3 seconds

     // Clear interval on component unmount to prevent memory leaks
     return () => {
       clearInterval(slideInterval);
     };
   }, [currentIndex]); // Re-run effect when currentIndex changes

  return (
    <div className='overflow-hidden h-screen flex items-center justify-center relative  bg-primary'>
      
      <div className='absolute inset-x-0 bottom-4 flex items-center justify-center'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mx-1 w-4 h-4 rounded-full ${currentIndex === index ? 'bg-accent' : 'bg-gray-400'}`}
          ></button>
        ))}
      </div>

      <img src={images[currentIndex]} alt={`slide-${currentIndex}`} className='w-full h-screen object-contain'/>

      <div className='absolute inset-0 flex items-center justify-between '>
        
        <button
          className='bg-primary h-screen w-[5%] bg-opacity-30 hover:bg-opacity-100'
          onClick={prevSlide}>
            <ArrowLeftCircleIcon/>
        </button>

        <button           
          className='bg-primary h-screen w-[5%] bg-opacity-30 hover:bg-opacity-100'
          onClick={nextSlide}>
            <ArrowRightCircleIcon/>
        </button>

      </div>
    </div>
  );
}
