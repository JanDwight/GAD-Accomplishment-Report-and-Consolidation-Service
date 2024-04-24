import React, { useState, useEffect } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import NeutralButton from '../../../../../../components/buttons/NeutralButton';
import axiosClient from '../../../../../../axios/axios';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function EditActivityModal({ selectedForm }) {

  const expendituresArray = selectedForm.expenditures;
  const [message, setAxiosMessage] = useState(''); // State for success message
  const [status, setAxiosStatus] = useState('');
  const tableBorder = "text-center border border-black border-solid text-center px-2";
  
  const [inputFields, setInputFields] = useState([
    {type: '', item: '', per_item: '', no_item: '', times: '', total: '0'}
  ])

  const handleChangeNumbers = (index, event) => {
    const C_per_item = parseFloat(inputFields[index].per_item || 0, 10);
    const t_no_item = parseFloat(inputFields[index].no_item || 0, 10);
    let n_times = parseFloat(inputFields[index].times || 0, 10);
    
    if (!n_times) {
      n_times = 1;
    }

    const total_cost = (C_per_item * t_no_item) * n_times;
    const updatedInputFields = [...inputFields];

    // Update the total_cost for the current index
    updatedInputFields[index] = {
      ...updatedInputFields[index],
      total: total_cost
  };
  setInputFields(updatedInputFields);
  }

  //------------------------------
  useEffect(() => {
    // Function to generate multiple sets of input fields
    const generateInputFields = () => {
      const newInputFields = expendituresArray.map(expenditure => ({
        id: expenditure.id,
        type: expenditure.type,
        item: expenditure.items,
        per_item: expenditure.per_item,
        no_item: expenditure.no_item,
        times: expenditure.times,
        total: expenditure.total
      }));
      setInputFields(newInputFields);
    };
  
    generateInputFields();
}, []);
  //------------------------------

  //-----
  
  const [removeID, setRemoveID] = useState([]);
  //send to update only when submit is pressed

  //-----

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  }
  
  const addFields = () => {
    let newfield = { type: '', item: '', per_item: '', no_item: '', times: 1, total: '0' }
    setInputFields([...inputFields, newfield])
    //will also add to DB
  }
  
  const removeFields = (index, id) => {
    if (inputFields.length === 1) {
      // Do not remove the field if there's only one row
      //add error message that says: Text Field Cannot be deleted please edit
      //One row must remain
      //if no fields, will cause error in request
      //if submit is pressed should warn the user that expenditures will be deleted
      return;
    }

    let data = [...inputFields];
    data.splice(index, 1)
    setInputFields(data)

    // Update the removeID array by adding the id
    setRemoveID(prevRemoveID => [...prevRemoveID, id]);
    //will also remove from DB
   
  }

  const [formData, setFormData] = useState({
    title: selectedForm.title,
    purpose: selectedForm.purpose,
    legal_bases: selectedForm.legal_bases,
    //Change date_of_activity to date_of_LEAD_activity depending of the form_type
    ...(selectedForm.form_type !== "INSET" && { date_of_activity: selectedForm.date_of_activity }),
    ...(selectedForm.form_type === "INSET" && { date_of_activity: selectedForm.date_of_activity }),
    venue: selectedForm.venue,
    participants: selectedForm.participants,
    learning_service_providers: selectedForm.learning_service_providers,
    expected_outputs: selectedForm.expected_outputs,
    fund_source: selectedForm.fund_source,
    proponents_implementors: selectedForm.proponents_implementors,
    // Exclude no_of_target_participants if form type is INSET
    ...(selectedForm.form_type !== "INSET" && { no_of_target_participants: selectedForm.no_of_target_participants }),
  });
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    if(selectedForm.form_type === "EMPLOYEE"){
      //For EMPLOYEE UPDATE
      try {
        const response = await axiosClient.put(`/update_form_employee/${selectedForm.id}`, {
          form_data: formData,
          xp_data: inputFields,
          to_remove: removeID
        });
        setAxiosMessage(response.data.message);
        setAxiosStatus(response.data.success); 
      } catch (error) {
        setAxiosMessage(error.message);
        setAxiosStatus(false);
      }
    } else {
      //For INSET UPDATE
      try {
        const response = await axiosClient.put(`/update_form_inset/${selectedForm.id}`, {
          form_data: formData,
          xp_data: inputFields,
          to_remove: removeID
        });
        setAxiosMessage(response.data.message);
        setAxiosStatus(response.data.success); 
      } catch (error) {
        setAxiosMessage(error.message);
        setAxiosStatus(false);
      }
    }
  };

  // For Unified Inputs 
  const renderInput = (name, label) => {
    // Check if the input field should be required based on form type and field name
    const isRequired = selectedForm.form_type !== "INSET" && name == "no_of_target_participants";

    return (
      <div className='flex flex-1 flex-col'>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type="text"
          autoComplete={name}
          // Include "required" attribute only if it's not INSET and not no_of_target_participants
          {...(isRequired ? { required: true } : {})}
          value={formData[name]}
          onChange={handleChange}
          className="bg-gray-100"
        />
      </div>
    );
  };

  return (
    <div>

         <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            {renderInput("title", "Title: ")}
            {renderInput("purpose", "Purpose: ")}
            {renderInput("legal_bases", "Legal Bases: ")}
            {renderInput(selectedForm.form_type === "INSET" ? "date_of_activity" : "date_of_activity", "Date of Activity: ")}
            {renderInput("venue", "Venue: ")}
            {renderInput("participants", "Participants: ")}
            {selectedForm.form_type !== "INSET" && renderInput("no_of_target_participants", "Number of Target Participants: ")} {/**Render this only when the form is inset */}
            {renderInput("learning_service_providers", "Learning Service Providers: ")}
            {renderInput("expected_outputs", "Expected Outputs: ")}
            {renderInput("fund_source", "Fund Source: ")}
            {renderInput("proponents_implementors", "Proponents/Implementors ")}
            <h1 className='text-center m-3'>
              Budgetary Requirements:
            </h1>
            <div className="overflow-x-auto">
              <table>
                    <thead className="bg-gray-200">
                      <tr>
                        <th className={tableBorder}>Type</th>
                        <th className={tableBorder}>Item</th>
                        <th className={tableBorder}>Cost Per Item</th>
                        <th className={tableBorder}>Number of Items</th>
                        <th className={tableBorder}>Number of Times</th>
                        <th className={tableBorder}>Total</th>
                        <th className={tableBorder}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inputFields.map((input, index) => (
                        <tr key={index}>
                          <td className={tableBorder}>
                            <select
                              id="type"
                              name="type"
                              autoComplete="type"
                              required
                              value={input.type}
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
                          </td>
                          <td className={tableBorder}>
                            <input
                              id="item"
                              name="item"
                              type="text"
                              placeholder="Item"
                              autoComplete="item"
                              required
                              value={input.item}
                              onChange={event => handleFormChange(index, event)}
                            />
                          </td>
                          <td className={tableBorder}>
                            <input
                              id="per_item"
                              name="per_item"
                              type="text"
                              pattern="[0-9]*\.?[0-9]*"
                              placeholder="Cost Per Item"
                              autoComplete="per_item"
                              required
                              value={input.per_item}
                              onChange={event => { handleFormChange(index, event); 
                                handleChangeNumbers(index, event.target.value); }}
                            />
                          </td>
                          <td className={tableBorder}>
                            <input
                              id="no_item"
                              name="no_item"
                              type="text"
                              pattern="[0-9]*\.?[0-9]*"
                              placeholder="Number of Items"
                              autoComplete="no_item"
                              required
                              value={input.no_item}
                              onChange={event => { handleFormChange(index, event); 
                                handleChangeNumbers(index, event.target.value); }}
                            />
                          </td>
                          <td className={tableBorder}>
                            <input
                              id="times"
                              name="times"
                              type="text"
                              pattern="[0-9]*"
                              placeholder="Number of Times"
                              autoComplete="times"
                              required
                              value={input.times}
                              onChange={event => { handleFormChange(index, event); 
                                handleChangeNumbers(index, event.target.value); }}
                            />
                          </td>
                          <td className={tableBorder}>
                            <input
                              id="total"
                              name="total"
                              type="text"
                              pattern="[0-9]*"
                              placeholder="Total"
                              autoComplete="Total"
                              required
                              readOnly
                              value={input.total}
                              onChange={event => { handleFormChange(index, event);}}
                            />
                            </td>
                          <td className={tableBorder}>
                            <button type="button" title="Delete Item" onClick={() => removeFields(index, input.id)}>
                              <MinusCircleIcon className="w-6 h-6 text-red-500 cursor-pointer transform transition-transform hover:scale-125" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    
                    
                    
              {/*------------------------------------------------------------------------------*/}
                <div className="mt-2 flex justify-center">
                    
                <NeutralButton label="Add more.." onClick={() => addFields()} />
                {/* <button onClick={addFields} className='m-1'>Add More..</button> */}
                </div>
                    
            </div>
        <div className="mt-5">
          <Submit label="Submit"/>
        </div>
      </form>

    </div>
  );
}
