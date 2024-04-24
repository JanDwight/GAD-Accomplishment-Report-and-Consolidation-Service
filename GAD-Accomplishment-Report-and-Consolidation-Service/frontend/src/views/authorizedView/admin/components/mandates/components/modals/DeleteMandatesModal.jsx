import { React, useState } from 'react'
import axiosClient from '../../../../../../axios/axios';
import WarningButton from '../../../../../../components/buttons/WarningButton';

//For feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function DeleteMandatesModal({selectedForm}) {
  // For feedback
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try {
      const response = await axiosClient.put(`/deletemandate/${selectedForm[0].id}`, {});
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };

  return (
    <div className='text-center'>

      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <h1>
        Are you sure you want to delete <b>{selectedForm[0].gender_issue}</b>?
      </h1>

      {/**BUTTONS */}
      <div className='mt-5'>
        {/** For Feedback */}
        <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} />

          <WarningButton label="Delete Mandate" onClick={onSubmit}/*disabled={ your condition }*/ />
        </div>
    </div>
  )
}
