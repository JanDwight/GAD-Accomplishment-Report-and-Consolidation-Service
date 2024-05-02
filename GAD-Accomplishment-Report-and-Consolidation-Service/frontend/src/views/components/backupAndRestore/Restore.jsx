import React, { useEffect, useState } from 'react';
import Submit from '../buttons/Submit';
import axiosClient from '../../axios/axios';
import Feedback from '../feedbacks/Feedback';

export default function Restore() {
    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');
    const [fileTitle, setFileTitle] = useState(''); // State to hold the file title


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Extract the file title
        setFileTitle(file.name);
        // Do something with the selected file
        console.log('Selected file:', file);

    };

    const onSubmit = async (ev) => {
        ev.preventDefault();
    
        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');
    
        try {
            const formData = new FormData();
            formData.append('fileTitle', fileTitle); // Append the title to FormData
    
            const response = await axiosClient.post('/restore', formData);
            setAxiosMessage(response.data.message);
            setAxiosStatus(response.data.success);
        } catch (error) {
            setAxiosMessage(error.response.data.message);
            setAxiosStatus(false);
        }
    }
    

    return (
        <div>
            <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false} />

            <form onSubmit={onSubmit}>
                <input type="file" onChange={handleFileChange} />
                <div className='mt-5'>
                    <Submit label="Add User" /*disabled={ your condition }*/ />
                </div>
            </form>
        </div>
    );
}
