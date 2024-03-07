import { React, useState } from 'react'
import axiosClient from '../../../../../../axios/axios';
import WarningButton from '../../../../../../components/buttons/WarningButton';

//For feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function DeleteMandatesModal({selectedForm}) {
  // For feedback
  const [error, setError] = useState('');
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError({ __html: "" });

    try {
      const response = await axiosClient.put(`/deletemandate/${selectedForm[0].id}`, {});
      setAxiosMessage(response.data.message); // Set success message
      setAxiosStatus(response.data.success);
      setTimeout(() => {
        setAxiosMessage(''); // Clear success message
        setAxiosStatus('');
      }, 3000); // Timeout after 3 seconds
    } catch (error) {
      setAxiosMessage(error.response.data.message); // Set success message
    }
  };

  return (
    <div>
        Are you sure you want to delete? 
        This will delete the Mandate permanently

      {/**BUTTONS */}
      <div className='mt-5'>
        {/** For Feedback */}
        <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} />

          <WarningButton label="Delete User" onClick={onSubmit}/*disabled={ your condition }*/ />
        </div>
    </div>
  )
}
