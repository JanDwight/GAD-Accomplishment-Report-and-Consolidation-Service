import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../../axios/axios';

export default function UserDashboard() {
    const [arbitrary, setArbitrary] = useState({
        users: '',
        design: '',
        pending: '',
        completed: '',
    })

    useEffect(() => {
        fetchCounts();
    }, []);
    
    const fetchCounts = async () => {
        try {
            const response = await axiosClient.get('/counter');
            if (response.data && response.data) {
                console.log("Return: ", response.data);
                setArbitrary(response.data);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const boxStyle = "box-border w-1/2 bg-secondary p-4 m-2  text text-center font-semibold flex flex-col justify-center";

    return (
        <div className='flex h-[30%] overscroll-contain overflow-x-hidden rounded-xl text-sm relative px-auto py-1'>
            <div className={boxStyle}>
                <h1>Total Users:</h1>
                <div className='text-6xl my-auto'>{arbitrary.users}</div>
            </div>
            <div className={boxStyle}>
                <h1>Total Training Designs:</h1>
                <div className='text-6xl my-auto'>{arbitrary.design}</div>
            </div>
            <div className={boxStyle}>
                <h1>Pending Accomplishment Reports:</h1>
                <div className='text-6xl my-auto'>{arbitrary.pending}</div>
            </div>
            <div className={boxStyle}>
                <h1>Accomplishment Reports:</h1>
                <div className='text-6xl my-auto'>{arbitrary.completed}</div>
            </div>
        </div>
    );
}
