import { React, useState } from 'react'
import axiosClient from '../../../../../../axios/axios';
import WarningButton from '../../../../../../components/buttons/WarningButton'
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function DeleteReportModal({selectedForm}) {

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try {
      const response = await axiosClient.put(`/delete_accomplishment_report/${selectedForm.id}`);
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

      <h1>
        Are you sure you want to delete <b>{selectedForm.title}</b>
      </h1>

      {/**BUTTONS */}
      <div className='mt-5'>
          <WarningButton label="Delete Accomplishment Report" onClick={onSubmit}/*disabled={ your condition }*/ />
        </div>
    </div>
  )
}
