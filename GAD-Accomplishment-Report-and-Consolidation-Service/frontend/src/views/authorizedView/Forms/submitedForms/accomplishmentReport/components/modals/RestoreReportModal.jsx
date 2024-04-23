import { React, useState } from 'react'
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function RestoreReportModal({selectedForm}) {

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

    const onSubmit = async (ev) => {
        ev.preventDefault();

        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');
    
        try {
          const response = await axiosClient.put(`/restore_accomplishment_report/${selectedForm.id}`);
          setAxiosMessage(response.data.message);
          setAxiosStatus(response.data.success);
        } catch (error) {
          setAxiosMessage(error.response.data.message);
          setAxiosStatus(false);
          };
        };

        console.log(selectedForm);
  return (
    <div>
      
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <h1>
        Are you sure you want to Restore <b>{selectedForm.title}</b>
      </h1>
      {/**BUTTONS */}
      <div className='mt-5'>
          <Submit label="Restore Accomplishment Report" onClick={onSubmit}/*disabled={ your condition }*/ />
        </div>
    </div>
  )
}
