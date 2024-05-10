import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios/axios';
import NeutralButton from '../buttons/NeutralButton';
import LoadingHorizontalLine from '../feedbacks/LoadingHorizontalLine';
import AddPrompt from '../../authorizedView/prompts/AddPrompt';
import ReactModal from 'react-modal';
import Feedback from '../feedbacks/Feedback';

export default function BackupList() {
    const [titles, setTitles] = useState([]); // Renamed title to titles to avoid confusion
    const [toBeRestored, setToBeRestored] = useState ('');
    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');
    const [password, setPassword] = useState(''); // State to hold the file title
    
    const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

    const [promptMessage, setPromptMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const action = "Confirm Restore Database?";

    useEffect(() => {
        const fetchBackupFiles = async () => {
            setIsHorizontalLoading(true);

            try {
                const response = await axiosClient.get('/showbackup');
                setTitles(response.data.message); // Set titles to the array of backup file names
                setIsHorizontalLoading(false);
            } catch (error) {
                console.error(error);
                setIsHorizontalLoading(false); // Ensure loading state is updated even in case of error
            }
        };

        fetchBackupFiles();
    }, []);

    //<><><><><><>
    const addprompt = (title) => {
       const concatmessage = '' + title +  '" will be restored. All of the data saved after said date will be lost. Do you wish to proceed?';
       setPromptMessage(concatmessage);
       setShowPrompt(true);
       setToBeRestored(title);
     }
          
     const onSubmit = async () => {
       
        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');
    
        try {
            const formData = new FormData();
            formData.append('fileTitle', toBeRestored); // Append the title to FormData
    
            const response = await axiosClient.post('/restore', formData);
            setAxiosMessage(response.data.message);
            setAxiosStatus(response.data.success);
        } catch (error) {
            setAxiosMessage(error.response.data.message);
            setAxiosStatus(false);
        }
    }

    return (
        <div className='bg-white flex h-[80%] rounded-xl'>
            
            <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

            <table className='w-screen text-left'>
                <thead className='bg-secondary sticky top-0'>
                    <tr>
                        <th className='px-4 py-2'>Backups</th>
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {titles.map((title, index) => ( // Changed title to titles here
                        <tr 
                            key={index}
                            className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                            onClick={() => addprompt(title)}
                        >
                            <td className='w-28 px-4 py-2'>{title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

          {/*----------*/}
          <ReactModal
            isOpen={showPrompt}
            onRequestClose={() => setShowPrompt(false)}
            className="md:w-[1%]"
          >
            <div>
                <AddPrompt
                    closeModal={() => setShowPrompt(false)}
                    handleSave={onSubmit}
                    action={action}
                    promptMessage={promptMessage}
                />
            </div>
          </ReactModal>
        </div>
    );
}
