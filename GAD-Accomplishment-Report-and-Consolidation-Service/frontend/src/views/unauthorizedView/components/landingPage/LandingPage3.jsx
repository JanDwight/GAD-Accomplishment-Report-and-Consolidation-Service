import React from 'react'
import img from '../../../../TMP/image3.jpg';

export default function LandingPage3() {
  return (
    <div 
      className='flex justify-center items-center h-screen relative'
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
    >

      {/* Overlay with opacity */}
      <div className='absolute inset-0 bg-primary opacity-10'></div>
      
      <div className='w-fulll p-5 text-center bg-opacity-70 bg-secondary relative z-10'>
        <h1 className='text-4xl font-bold mb-4'>Goals:</h1>
        <ul className='text-2xl list-disc list-inside text-left ml-10'>
          <li>Improve GAD information system for policy and decision making.</li>
          <li>Recognize GAD Zonal Resource Center in the Region.</li>
          <li>Enrich quality education through the integration of gender perspective in academe.</li>
          <li>Develop highly engaged employees and students with gender-lens perspective through training and advocacy.</li>
          <li>Increase resilience and reduce vulnerabilities and risk of stakeholders to climate change and DRRM-related concerns.</li>
          <li>Promote gender-transformative approach to improve health and wellness.</li>
          <li>Improve quality of life through gender responsive research and extension programs.</li>
          <li>Build resilient, “green,” and gender responsive infrastructure.</li>
        </ul>
      </div>
    </div>
  )
}
