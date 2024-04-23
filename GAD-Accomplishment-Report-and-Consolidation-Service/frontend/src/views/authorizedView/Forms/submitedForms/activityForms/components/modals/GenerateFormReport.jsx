import React, { useState, useEffect } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import NeutralButton from '../../../../../../components/buttons/NeutralButton';
import { TemplateHandler } from 'easy-template-x';
import axiosClient from '../../../../../../axios/axios';
import InsetEmployeeAccomplishmentReport from '../../../../../../components/printing/forms/InsetEmployeeAccomplishmentReport.docx'
import Addimages from '../../../../../../components/image/Addimages';

//For Feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';
import { MinusCircleIcon } from '@heroicons/react/20/solid';

export default function GenerateFormReport({ selectedForm }) {
  
  const [message, setAxiosMessage] = useState(''); // State for success message
  const [status, setAxiosStatus] = useState('');

  const [formData, setFormData] = useState({
    forms_id: selectedForm.id,
    title: selectedForm.title,
    fund_source: 'n/a',
    clientele_type: 'n/a',
    clientele_number: 'n/a',
    actual_cost: 'n/a',
    cooperating_agencies_units: 'n/a',
    ...(selectedForm.form_type !== "INSET" && { date_of_activity: selectedForm.date_of_activity }),
    ...(selectedForm.form_type === "INSET" && { date_of_activity: selectedForm.date_of_activity }),
    venue: selectedForm.venue,
    no_of_participants: '',
    male_participants: '',
    female_participants: '',
    proponents_implementors: selectedForm.proponents_implementors,
    images: [], //for images
  });

  const [actualExpendatures, setActualExpendatures] = useState([{
    type: '',
    item: '',
    approved_budget: '',
    actual_expenditure: '',
  }]);

  const handleImagesChange = (selectedImages) => {
    // Update the formData state with the array of selected images
    setFormData(prevFormData => ({
      ...prevFormData,
      images: selectedImages
    }));
  };
  
  // useEffect to log updated formData state
  useEffect(() => {
    console.log('Updated FormData with images:', formData);
  }, [formData]); // Trigger the effect whenever formData changes
  
  const expendituresArray = selectedForm.expenditures;

  const [proposedExpenditures, setProposedExpenditures] = useState([
    {type: '', item: '', per_item: '', no_item: '', times: '', total: ''}
  ]);

  //----------for docx
  const fileUrl = InsetEmployeeAccomplishmentReport; // Use the imported file directly

  const fetchData = async (url) => {
    const response = await fetch(url);
    return await response.blob();
  };

  const populateDocx = async () => {
    try {
        const blob = await fetchData(fileUrl);
         const data = {
            title: formData.title,
            dateOfActivity: formData.date_of_activity,
            venue: formData.venue,
            proponents: formData.proponents_implementors,
            maleParticipants: formData.male_participants,
            femaleParticipants: formData.female_participants,
            totalParticipants: formData.no_of_participants,
            // Include additional fields here as needed
            // For example, for budgetary requirements
            budgetaryExpenditure: actualExpendatures.map(field => ({
              item: field.item,
              approvedBudget: field.approved_budget,
              actualExpenditure: field.actual_expenditure
          }))
        };
        
        const handler = new TemplateHandler();
        const processedBlob = await handler.process(blob, data); // Process the blob
        saveFile('output.docx', processedBlob, data.title);
    } catch (error) {
        console.error('Error:', error);
    }
  };

    const saveFile = (filename, blob, title) => {
      try {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${title} - ${filename}`; // Include the title in the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error creating object URL:', error);
      }
    };
  //----------

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
      setProposedExpenditures(newInputFields);
    };
  
    generateInputFields();
}, []);
  //------------------------------
  
  const handleSubmit = async (ev) => {
    ev.preventDefault();
  
    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');
    
    // Create FormData object
    const formDataToSend = new FormData();
  
    // Append form data
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    // Append image files
    formData.images.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image);
    });
  
    // Append expenditures data as array
    actualExpendatures.forEach((expenditure, index) => {
      for (const key in expenditure) {
        formDataToSend.append(`expenditures[${index}][${key}]`, expenditure[key]);
      }
    });

    try {
      const response = await axiosClient.post('/accomplishment_report', formDataToSend);
      setAxiosMessage(response.data.message); // Set success message
      setAxiosStatus(response.data.success);
      if (response.data.success === true){
        populateDocx(); // Run the download of DOCX
      }
    } catch (error) {
      setAxiosMessage(error.response.data.message);
      setAxiosStatus(false);
    }
  };
  
  const handleFormChange = (index, event) => {
    let data = [...actualExpendatures];
    data[index][event.target.name] = event.target.value;
    setActualExpendatures(data);
  }
  
  const addFields = () => {
    let newfield = { type: '', item: '', approved_budget: '', actual_expenditure: '' }
    setActualExpendatures([...actualExpendatures, newfield])
    //will also add to DB
  }
  
  const removeFields = (index) => {
    let data = [...actualExpendatures];
    data.splice(index, 1)
    setActualExpendatures(data)
    //will also remove from DB
  }

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        placeholder="I am empty..."
        required
        // Include "required" attribute only if it's not INSET and not no_of_target_participants
        //{...(isRequired ? { required: true } : {})}
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

    <form onSubmit={handleSubmit} className="flex flex-1 flex-col" encType="multipart/form-data">
      {renderInput("title", "Title: ")}
      {renderInput(selectedForm.form_type === "INSET" ? "date_of_activity" : "date_of_activity", "Date of Activity: ")}
      {renderInput("venue", "Venue: ")}
      {renderInput("proponents_implementors", "Proponents/Implementors ")}
      {renderInput("male_participants", "Male Participants: ")}
      {renderInput("female_participants", "Female Participants: ")}
      {renderInput("no_of_participants", "Total Number of Participants: ")}

      <h1 className='text-center m-3'>
        Proposed Expenditures:
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Item Type</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Cost Per Item</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">No. of Items</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">X Times</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposedExpenditures.map((input, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-no-wrap">{input.type}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{input.item}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{input.per_item}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{input.no_item}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{input.times}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{input.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className='text-center m-3'>
        Actual Expenditures:
      </h1>
      <div className="flex flex-col justify-center items-center w-full overflow-x-auto">
        {/*------------------------------------------------------------------------------*/}
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Item Description</th>
              <th>Approved Budget</th>
              <th>Actual Expendatures</th>
            </tr>
          </thead>
          <tbody>
            {actualExpendatures.map((input, index) => (
              <tr key={index}>
                <td>
                  <select
                    id={`type${index}`}
                    name="type"
                    autoComplete="type"
                    required
                    className="flex-1 px-2 py-1"
                    value={input.type}
                    onChange={event => handleFormChange(index, event)}
                  >
                    <option value="" disabled>Select Type</option>
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
                <td>
                  <input
                    id={`item${index}`}
                    name="item"
                    type="text"
                    placeholder="Item"
                    autoComplete="item"
                    required
                    className="flex-1 px-2 py-1 mr-3"
                    value={input.item}
                    onChange={event => handleFormChange(index, event)}
                  />
                </td>
                <td>
                  <input
                    id={`approved_budget${index}`}
                    name="approved_budget"
                    type="text"
                    placeholder="Approved Budget"
                    autoComplete="approved_budget"
                    required
                    className="flex-1 px-2 py-1 mr-3"
                    value={input.approved_budget}
                    onChange={event => handleFormChange(index, event)}
                  />
                </td>
                <td>
                  <input
                    id={`actual_expenditure${index}`}
                    name="actual_expenditure"
                    type="text"
                    placeholder="Actual Expenditure"
                    autoComplete="actual_expenditure"
                    required
                    className="flex-1 px-2 py-1 mr-3"
                    value={input.actual_expenditure}
                    onChange={event => handleFormChange(index, event)}
                  />
                </td>
                  <td className='text-center'>
                    <button type="button" title="Delete Row" onClick={() => removeFields(index)}>
                      <MinusCircleIcon className="w-6 h-6 text-red-500 cursor-pointer transform transition-transform hover:scale-125" />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        
          {/*------------------------------------------------------------------------------*/}
          <div className="flex justify-center">

            <NeutralButton label="Add more.." onClick={() => addFields()} />
          {/* <button onClick={addFields} className='m-1'>Add More..</button> */}
          </div>
        
        </div>
        
        <div className='flex justify-center mt-5'>
          <Addimages onImagesChange={handleImagesChange} />
        </div>

        <div className="mt-5">
          <Submit label="Submit"/>
        </div>
      </form>

    </div>
  );
}
