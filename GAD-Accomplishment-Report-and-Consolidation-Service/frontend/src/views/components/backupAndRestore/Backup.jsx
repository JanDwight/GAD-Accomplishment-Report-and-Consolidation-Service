import React from 'react'
import NeutralButton from '../buttons/NeutralButton'
import axiosClient from '../../axios/axios';
import ReactModal from 'react-modal';
import AddPrompt from '../../authorizedView/prompts/AddPrompt';

export default function Backup() {

  const [promptMessage, setPromptMessage] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const action = "Confirm Backup System?";

   //<><><><><><>
  const addprompt = (ev) => {
    ev.preventDefault();
    const concatmessage = "This action will create a backup of your system at it's current state. Do you wish to proceed?";
    setPromptMessage(concatmessage);
    setShowPrompt(true);
  }

        const handleBackup = () => {
          // Make an HTTP POST request to trigger the backup process
          axiosClient.post('/backup/create')
            .then(response => {
              // Backup process initiated successfully, handle any further actions if needed
              console.log('Backup initiated:', response.data);
            })
            .catch(error => {
              // Handle errors if backup process failed
              console.error('Error initiating backup:', error);
            });
        };
        
  return (
    <div>
        <NeutralButton onClick={addprompt}>Backup Database</NeutralButton>
        {/*----------*/}
        <ReactModal
              isOpen={showPrompt}
              onRequestClose={() => setShowPrompt(false)}
              className="md:w-[1%]"
            >
              <div>
                  <AddPrompt
                      closeModal={() => setShowPrompt(false)}
                      handleSave={handleBackup}
                      action={action}
                      promptMessage={promptMessage}
                  />
              </div>
        </ReactModal>
    </div>
  )
}
