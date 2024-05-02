import React, { useState, useEffect } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';
import NeutralButton from '../../../../../../components/buttons/NeutralButton';

//For Feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';
import Error from '../../../../../../components/feedbacks/Error';

export default function ViewEADReportModal({selectedForm}) {
  const selectedForms = selectedForm.forms;
  console.log('this is the selected form:', selectedForm);
  const expendituresArray = selectedForm.expenditures;

  const [error, setError] = useState('');
  const [message, setAxiosMessage] = useState(''); // State for success message
  const [status, setAxiosStatus] = useState('');

  //----------for exenditure

  const [inputFields, setInputFields] = useState([
    {type: '', item: '', estimated: '', remarks: '', source_of_funds: ''}
  ])


    //------------------------------
    useEffect(() => {
      // Function to generate multiple sets of input fields
      const generateInputFields = () => {
        const newInputFields = expendituresArray.map(expenditure => ({
          id: expenditure.id,
          type: expenditure.type,
          item: expenditure.items,
          estimated: expenditure.estimated_cost,
          remarks: expenditure.remarks,
          source_of_funds: expenditure.source_of_funds
        }));
        setInputFields(newInputFields);
      };
    
      generateInputFields();
  }, []);
    //------------------------------causing mapping error

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  }

  const addFields = () => {
    let newfield = { type: '', item: '', estimated: '', remarks: '', source_of_funds: '' }

    setInputFields([...inputFields, newfield])
  }

  const removeFields = (index) => {
    let data = [...inputFields];
    data.splice(index, 1)
    setInputFields(data)
}

  const [formData, setFormData] = useState({
    title: selectedForms.title,
    date_of_activity: selectedForms.date_of_activity,
    venue: selectedForms.venue,
    clientele_type: selectedForms.clientele_type,
    clientele_number: selectedForms.clientele_number,
    estimated_cost: selectedForms.estimated_cost,
    cooperating_agencies_units: selectedForms.cooperating_agencies_units,
    expected_outputs: selectedForms.expected_outputs,
    fund_source: selectedForms.fund_source,
    proponents_implementors: selectedForms.proponents_implementors,
  });

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //----------axiosClient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosClient.put(`/update_form_ead/${selectedForm.id}`, {
            form_data: formData,
            xp_data: inputFields
        });
        setAxiosMessage(response.data.Message); // Set success message
        setAxiosStatus(response.data.Success);
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

  //For Unified Inputs 
  const renderInput = (name, label) => (
    <div className="flex flex-1 flex-col">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        autoComplete={name}
        required
        value={formData[name]}
        onChange={handleChange}
        className="bg-gray-100"
      />
    </div>
  );

  return (
    <div className='bg-gray-300 m-5 p-3'>
      {/**For Feedback */}
      <Error isOpen={error !== ''} onClose={() => setError('')} errorMessage={error} />
      
      {/* Integrate the Success component */}
      <Feedback isOpen={message !== ''} onClose={() => setSuccess('')} successMessage={message}  status={status}/>

      <h1 className='text-center'>
        Extension Activity Design Form
      </h1>

      <form onSubmit={handleSubmit} >
        {renderInput("title", "Title: ")}
        {renderInput("date_of_activity", "Date of Activity: ")}
        {renderInput("venue", "Venue: ")}
        {renderInput("clientele_type", "Clientele Type: ")}
        {renderInput("clientele_number", "Clientele Number: ")}
        {renderInput("estimated_cost", "Estimated Cost: ")}
        {renderInput("cooperating_agencies_units", "Cooperating Agencies/Units: ")}
        {renderInput("expected_outputs", "Expected Outputs: ")}
        {renderInput("fund_source", "Fund Source: ")}
        {renderInput("proponents_implementors", "Proponents/Implementors: ")}
        <h1 className='text-center m-3'>
          Budgetary Requirements
        </h1>
        <div>
            {inputFields.map((input, index) => {
              return(
                <div key={index} className="space-x-4 space-y-2">
                  <select
                    id="type"
                    name="type"
                    autoComplete="type"
                    required
                    className="flex-1 px-2 py-1"
                    onChange={event => handleFormChange(index, event)}
                  >
                    <option value={input.type}>{input.type}</option>
                    <option value="Meals and Snacks">Meals and Snacks</option>
                    <option value="Function Room/Venue">Venue</option>
                    <option value="Accomodation">Accomodation</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Professional Fee/Honoria">Professional Fee/Honoria</option>
                    <option value="Token/s">Token/s</option>
                    <option value="Materials and Supplies">Materials and Supplies</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Others">Others...</option>
                  </select>
                  <input
                    id="item"
                    name="item"
                    type="text"
                    placeholder="Item"
                    autoComplete="item"
                    required
                    className="flex-1 px-2 py-1"
                    value={input.item}
                    onChange={event => handleFormChange(index, event)}
                  />
                  <input
                    id="estimated"
                    name="estimated"
                    type="text"
                    placeholder="Estimated Cost"
                    autoComplete="estimated"
                    required
                    className="flex-1 px-2 py-1"
                    value={input.estimated}
                    onChange={event => handleFormChange(index, event)}
                  />
                  <input
                    id="remarks"
                    name="remarks"
                    type="text"
                    placeholder="Remarks"
                    autoComplete="remarks"
                    required
                    className="flex-1 px-2 py-1"
                    value={input.remarks}
                    onChange={event => handleFormChange(index, event)}
                  />
                  <input
                    id="source_of_funds"
                    name="source_of_funds"
                    type="text"
                    placeholder="Source of Funds"
                    autoComplete="source_of_funds"
                    required
                    className="flex-1 px-2 py-1"
                    value={input.source_of_funds}
                    onChange={event => handleFormChange(index, event)}
                  />
                  <button onClick={() => removeFields(index)}>Remove</button>
                </div>
                
              )
            })}
            <div className="flex justify-center">
              <NeutralButton label="Add more.." onClick={() => addFields()} />
            </div>
          
        </div>
      </form>
    </div>
  )
  
}
