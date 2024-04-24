import { React, useState} from 'react'
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';

//---------For Feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function ArchiveMandateModal({ mandateSelected }) {

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const onSubmit = async (ev) => {
    ev.preventDefault();
    
    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try {
      const response = await axiosClient.put(`/archivemandate/${mandateSelected[0].id}`, {});
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };

  console.log('This is the selected Mandate', mandateSelected);
  return (
    <div className='text-center'>
      {/** For Feedback */}
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <h1>
        Are you sure you want to delete <b>{mandateSelected[0].gender_issue}</b>?
      </h1>
      {/** BUTTONS */}
      <div className='mt-5 flex justify-center'>
        <Submit label="Archive Activity Design" onClick={onSubmit} /* disabled={your condition} */ />
      </div>
    </div>
  )
}
