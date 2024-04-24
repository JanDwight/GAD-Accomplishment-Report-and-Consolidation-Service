import React, { useState } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';

// For Feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function ArchiveActivityModal({ selectedForm }) {
  // For feedback
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try {
      const response = await axiosClient.put(`/archive_form/${selectedForm.id}`, {});
        setAxiosMessage(response.data.message);
        setAxiosStatus(response.data.success); 
    } catch (error) {
      setAxiosMessage(error.message);
      setAxiosStatus(false);
    }
  };

  return (
    <div className='text-center'>
      {/** For Feedback */}
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <h1>
        Are you sure you want to delete <b>{selectedForm.title}</b>?
      </h1>
      {/** BUTTONS */}
      <div className='mt-5'>
        <Submit label="Archive Activity Design" onClick={onSubmit} /* disabled={your condition} */ />
      </div>
    </div>
  );
}
