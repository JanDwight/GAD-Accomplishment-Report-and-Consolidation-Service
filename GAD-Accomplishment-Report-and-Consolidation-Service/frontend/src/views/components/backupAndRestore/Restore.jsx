import React, { useEffect, useState } from 'react';
import Submit from '../buttons/Submit';
import axiosClient from '../../axios/axios';
import Feedback from '../feedbacks/Feedback';
import ReactModal from 'react-modal';
import AddPrompt from '../../authorizedView/prompts/AddPrompt';

export default function Restore() {
    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');
    const [fileTitle, setFileTitle] = useState(''); // State to hold the file title

    const [promptMessage, setPromptMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const action = "Confirm Restore?";

    //<><><><><><>
    const addprompt = (ev) => {
        ev.preventDefault();
        const concatmessage = "Proceeding with the backup restore will delete then replace the contents of your existing database. Any modifications made after the backup file was created will be permanently lost. Are you sure you want to continue?";
        setPromptMessage(concatmessage);
        setShowPrompt(true);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Extract the file title
        setFileTitle(file.name);
        // Do something with the selected file
        console.log('Selected file:', file);

    };

    const onSubmit = async () => {
       
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

            <form onSubmit={addprompt}>
                <input type="file" onChange={handleFileChange} />
                <div className='mt-5'>
                    <Submit label="Add User" /*disabled={ your condition }*/ />
                </div>
            </form>
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
