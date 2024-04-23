import React, { useState } from 'react'
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';

export default function AddMandatesModal() {

  const [formData, setFormData] = useState({
    gender_issue: '',
    cause_of_gender_issue: '',
    gad_result_statement: '',
    gad_activity: '',
    performance_indicators: '',
    target_result: '',
    focus: '',
  })

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
          <option value="">Select Focus</option>
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
            className="bg-gray-200 border border-black"
            rows={2}
        />
      )}
    </div>
  );

  //----------axiosClient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosClient.post('/createmandates', {
            form_data: formData
        });
        setAxiosMessage(response.data.Message); // Set success message
        setAxiosStatus(response.data.Success);
        
        if (response.data.Success === true){
          populateDocx(); // Run the download of DOCX
        }
        setTimeout(() => {
            setAxiosMessage(''); // Clear success message
            setAxiosStatus('');
        }, 3000); // Timeout after 3 seconds
    } catch (error) {
        if (error.response) {
            const finalErrors = Object.values(error.response.data.errors).reduce(
                (accum, next) => [...accum, ...next],
                []
            );
            setError(finalErrors.join('<br>'));
        }
        console.error(error);
    }
  };
  //----------

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
    </div>
  )
}
