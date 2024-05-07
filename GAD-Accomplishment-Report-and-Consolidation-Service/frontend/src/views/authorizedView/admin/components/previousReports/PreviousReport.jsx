import React, { useState, useEffect } from 'react'
import NeutralButton from '../../../../components/buttons/NeutralButton'
import UploadFile from '../../../../components/file/UploadFile'
import Feedback from '../../../../components/feedbacks/Feedback';
import Submit from '../../../../components/buttons/Submit';
import AddPrompt from '../../../prompts/AddPrompt';
import ReactModal from 'react-modal';
import LoadingHorizontalLine from '../../../../components/feedbacks/LoadingHorizontalLine';
import axiosClient from '../../../../axios/axios';

export default function PreviousReport() {
  const [fileData, setFileData] = useState({
    files: [] // Change to array to store multiple files
  });

  const [retrievedPdfs, setRetrievedPdfs] = useState([])

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');
  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

  const [promptMessage, setPromptMessage] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const action = "Confirm Edit Profile?";
  
  const addprompt = (ev) => {
    ev.preventDefault();
    const concatmessage = `Changes to your profile: "${fileData.files.map(file => file.name).join(', ')}" will be saved. Do you wish to proceed?`;
    setPromptMessage(concatmessage);
    setShowPrompt(true);
  }

  const handleFileChange = (selectedFiles) => {
    setFileData(prevData => ({
      ...prevData,
      files: selectedFiles // Store selected files in the state
    }));
  };

  useEffect(() => {
    const fetchBackupFiles = async () => {
        setIsHorizontalLoading(true);

        try {
            const response = await axiosClient.get('/showpdfs');
            setRetrievedPdfs(response.data.message); // Set titles to the array of backup file names
            setIsHorizontalLoading(false);
        } catch (error) {
            console.error(error);
            setIsHorizontalLoading(false); // Ensure loading state is updated even in case of error
        }
    };

      fetchBackupFiles();
  }, []);

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
    <div className='h-full'>
      
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <div className='p-2 mx-auto w-[20%]' contenteditable>
            <NeutralButton label={'Upload File'} />
          </div>
      <div className='bg-white h-full overflow-y-auto rounded-xl relative'>

      <LoadingHorizontalLine />


        <form 
          className=' flex flex-col'
          onSubmit={addprompt}>

          <table className='w-screen text-left'>
                <thead className='bg-secondary sticky top-0'>
                    <tr>
                        <th className='px-4 py-2'>Yearly Annual Reports</th>
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {retrievedPdfs.map((pdf, index) => ( // Changed title to titles here
                        <tr 
                            key={index}
                            className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                            onClick={() => addprompt(pdf)}
                        >
                            <td className='w-28 px-4 py-2'>{pdf}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

          <div className='flex justify-center text-center mt-5'>
            <UploadFile onFileChange={handleFileChange} />
          </div>

          <div className="flex justify-center text-center mt-5">
            <Submit label="Update" />
          </div>
        </form>
      </div>
      
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
  )
}
