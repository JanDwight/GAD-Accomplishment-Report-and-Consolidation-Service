import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link from react-router-dom
import BSU_Logo from '../../../TMP/BSU_Logo.png';
import GAD_Logo from '../../../TMP/GAD_Logo.png';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

export default function Footer() {
  return (
    <div className='flex flex-row justify-between items-center h-full bg-black opacity-85 text-white px-[20%]'>
        <div className='items-center'>
            <img src={BSU_Logo} alt="bsulogo" className='w-14 hover:scale-125' />
            <div className='flex flex-row items-center'>
                <EnvelopeIcon className='w-7'/>
                web.admin@bsu.edu.ph
            </div>
            <div className='flex flex-row items-center'>
                <PhoneIcon className='w-7'/>
                074.422.2127-2402
            </div>
            <div>

            </div>
        </div>

        <div>
            <img src={GAD_Logo} alt="gadlogo" className='w-12' />
            <div className='flex flex-row items-center'>
                <EnvelopeIcon className='w-7'/>
                gad.office@bsu.edu.ph
            </div>
            <div className='flex flex-row items-center'>
                <PhoneIcon className='w-7'/>
                09
            </div>
        </div>

        {/* Use Link for navigation */}
        <NavLink to="/twg" className='w-40 hover:cursor-pointer hover:text-blue-700 hover:scale-125'>
            Focal Point System Technical Working Group (GFPS-TWG) Members
        </NavLink>
    </div>
  );
}
