import React, { useState, useRef } from 'react'
import Submit from '../../../../../components/buttons/Submit';
import axiosClient from '../../../../../axios/axios';
import AddPrompt from '../../../../prompts/AddPrompt';
import ReactModal from 'react-modal';
import UploadFile from '../../../../../components/file/UploadFile';
import Feedback from '../../../../../components/feedbacks/Feedback';

export default function UploadPdf() {
    const [fileData, setFileData] = useState({
        files: [] // Change to array to store multiple files
      });

    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');
    const [promptMessage, setPromptMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const action = "Confirm Upload?";

    const handleFileChange = (selectedFiles) => {
        setFileData(prevData => ({
          ...prevData,
          files: selectedFiles // Store selected files in the state
        }));
      };

      const addprompt = (ev) => {
        ev.preventDefault();
        const concatmessage = `The PDF file: "${fileData.files.map(file => file.name).join(', ')}" will be uploaded. Do you wish to proceed?`;
        setPromptMessage(concatmessage);
        setShowPrompt(true);
      }

    //----Uploads the pdfs
    const onSubmit = async () => {
      setAxiosMessage('Loading...');
      setAxiosStatus('Loading');
    
      try {
        const formData = new FormData();
        fileData.files.forEach(file => {
          formData.append('pdfs[]', file); // Append each file to the FormData as an array
        });

        const response = await axiosClient.post('uploadpdf', formData);
      
        setAxiosMessage(response.data.message);
        setAxiosStatus(response.data.success);
      } catch (error) {
        setAxiosMessage(error.response.data.message);
        setAxiosStatus(false);
      }
    };

    
  return (
    <div>
        
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

        <form 
          className=' flex flex-col'
          onSubmit={addprompt}>
            <div className='flex justify-center text-center mt-5'>
              <UploadFile onFileChange={handleFileChange} />
            </div>
            <div className="flex justify-center text-center mt-5">
              <Submit label="Upload" />
            </div>
        </form>

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

      {/* <ReactModal
        isOpen={showUploadPdf}
        onRequestClose={() => setShowUploadPdf(false)}
        className="md:w-[1%]"
      >
        <div>
          <UploadFile
            closeModal={() => setShowUploadPdf(false)}
            handleSave={onSubmit}
            action={action}
            promptMessage={promptMessage}
          />
        </div>
      </ReactModal> */}
    </div>
  )
}
