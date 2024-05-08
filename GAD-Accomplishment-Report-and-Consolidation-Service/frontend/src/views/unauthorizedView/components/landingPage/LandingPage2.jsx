import React from 'react';
import img from '../../../../TMP/image18.jpg';

export default function LandingPage2() {
  return (
    <div 
      className='flex justify-center items-center h-screen relative' 
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >
      {/* Overlay with opacity */}
      <div className='absolute inset-0 bg-secondary opacity-10'></div>

      <div className='w-[50%] p-5 text-center bg-opacity-70 bg-primary relative z-10'>
        <h1 className='text-4xl font-bold mb-4'>MISSION:</h1>
        <p className='text-2xl'>
          A gender responsive university delivering world-class education that
          promotes sustainable development amidst climate change.
        </p>
      </div>
      <div className='w-[50%] p-5 text-center bg-opacity-70 bg-primary relative z-10'>
        <h1 className='text-4xl font-bold mb-4'>VISION:</h1>
        <p className='text-2xl'>
          A gender responsive university delivering world-class education that
          promotes sustainable development amidst climate change.
        </p>
      </div>
    </div>
  );
}