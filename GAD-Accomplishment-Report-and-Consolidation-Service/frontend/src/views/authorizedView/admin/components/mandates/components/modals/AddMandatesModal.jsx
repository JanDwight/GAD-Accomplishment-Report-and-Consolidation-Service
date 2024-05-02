import React, { useState } from 'react'
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';
import Feedback from '../../../../../../components/feedbacks/Feedback';
import ReactModal from 'react-modal';
import AddPrompt from '../../../../../prompts/AddPrompt';

export default function AddMandatesModal() {

  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

  const [formData, setFormData] = useState({
    gender_issue: 'TBA',
    cause_of_gender_issue: 'TBA',
    gad_result_statement: 'TBA',
    gad_activity: 'TBA',
    performance_indicators: 'TBA',
    target_result: 'TBA',
    focus: 'Client',
  })

    const [promptMessage, setPromptMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const action = "Confirm Add New Mandate?";

     //<><><><><><>
    const addprompt = (ev) => {
      ev.preventDefault();
      const concatmessage = 'A new mandate/gender issue: "' + formData['gender_issue'] +  '" will be created. Do you wish to proceed?';
      setPromptMessage(concatmessage);
      setShowPrompt(true);
    }

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderInput = (name, label) => (
    <div className="flex flex-1 flex-col">
      <label htmlFor={name}>{label}</label>
      {name === "focus" ? (
        <select
          id={name}
          name={name}
          onChange={handleChange}
          value={formData[name]}
          className='border border-black'
          required
        >
          <option value="Client">Client-Focused</option>
          <option value="Organization">Organization-Focused</option>
        </select>
      ):(
          <textarea 
            id={name}
            name={name}
            autoComplete={name}
            required
            value={formData[name]}
            onChange={handleChange}
            className="px-2 bg-gray-200 border border-black"
            rows={2}
        />
      )}
    </div>
  );

  //----------axiosClient
  const handleSubmit = async () => {
    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');
    
    try {
      const response = await axiosClient.post('/createmandates', {
          form_data: formData
      });
      setAxiosMessage(response.data.message);
      setAxiosStatus(response.data.success);
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };
  //----------

  return (
    <div>

      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <form onSubmit={addprompt}>
        {renderInput('gender_issue', 'Gender Issues/GAD Mandate')}
        {renderInput('cause_of_gender_issue', 'Cause of Gender Issues')}
        {renderInput('gad_result_statement', 'GAD Result Statements')}
        {renderInput('gad_activity', 'GAD Activity')}
        {renderInput('performance_indicators', 'Performance Indicator/Targets')}
        {renderInput('target_result', 'Target Result')}
        {renderInput('focus', 'Focus')}

        <div className='mt-5 flex justify-center'>
          <Submit label="Submit"/>
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
                    handleSave={handleSubmit}
                    action={action}
                    promptMessage={promptMessage}
                />
            </div>
        </ReactModal>
    </div>
  )
}
