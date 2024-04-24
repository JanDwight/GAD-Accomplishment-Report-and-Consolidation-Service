import React, { useState, useEffect } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import NeutralButton from '../../../../../../components/buttons/NeutralButton';
import { TemplateHandler } from 'easy-template-x';
import ExtensionAccomplishmentReport from '../../../../../../components/printing/forms/ExtensionAccomplishmentReport.docx'
import axiosClient from '../../../../../../axios/axios';
import Modal from 'react-modal';
Modal.setAppElement('#root'); // Assuming '#root' is the ID of your root element

//For feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import AddImages from '../../../../../../components/image/Addimages';

export default function GenerateAccomplishmentReport({ selectedForm }) {
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');
  const tableBorder = "text-center border border-black border-solid text-center px-2";

    //----------for docx
    const fileUrl = ExtensionAccomplishmentReport; // Use the imported file directly

    const fetchData = async (url) => {
      const response = await fetch(url);
      return await response.blob();
    };

    const handleImagesChange = (selectedImages) => {
      // Update the formData state with the array of selected images
      setFormData(prevFormData => ({
        ...prevFormData,
        images: selectedImages
      }));
    };
  
    const populateDocx = async () => {
      try {
          const blob = await fetchData(fileUrl);
          console.log('Received blob:', blob); // Check the type and content of the blob
          const data = {
              programTitle: formData.program_title,
              projectTitle: formData.project_title,
              activityTitle: formData.title,
              dateAndVenue: formData.date_and_venue,
              clienteleTypeAndNumber: formData.clientele_type_and_number,
              estimatedcost: formData.estimated_cost,
              fundSource: formData.fund_source,
              proponents: formData.proponents_implementors,
              cooperatingAgency: formData.cooperating_agencies_units,
              // Include additional fields here as needed
              // For example, for budgetary requirements
              actualExpenditures: actualExpendatures.map(field => ({
                type: field.type,
                item: field.item,
                approvedBudget: field.approved_budget,
                actualExpenditure: field.actual_expenditure
            }))
          };
          console.log('aAE',actualExpendatures);
          const handler = new TemplateHandler();
          const processedBlob = await handler.process(blob, data); // Process the blob
          console.log('Processed Data:', data); // Check the processed blob
          saveFile('output.docx', processedBlob, data.activityTitle);
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

  const [actualExpendatures, setActualExpendatures] = useState([{
    type: '',
    item: '',
    approved_budget: '',
    actual_expenditure: '',
  }]);

  const expendituresArray = selectedForm.expenditures;

  const [proposedExpenditures, setProposedExpenditures] = useState([
    {item: '', estimated: '', approvred_budget: '', actual_expenditure: ''}
  ]);

  //------------------------------
  useEffect(() => {
    // Function to generate multiple sets of input fields
    const generateInputFields = () => {
      const newInputFields = expendituresArray.map(expenditure => ({
        id: expenditure.id,
        item: expenditure.items,
        estimated: expenditure.estimated_cost,
      }));
      setProposedExpenditures(newInputFields);
    };
  
    generateInputFields();
}, []);
  //------------------------------

  const handleFormChange = (index, event) => {
    let data = [...actualExpendatures];
    data[index][event.target.name] = event.target.value;
    setActualExpendatures(data);
  }

  const addFields = () => {
    let newfield = { type: '', item: '', approved_budget: '', actual_expenditure: '' }

    setActualExpendatures([...actualExpendatures, newfield])
  }

  const removeFields = (index) => {
    let data = [...actualExpendatures];
    data.splice(index, 1)
    setActualExpendatures(data)
}

  const [formData, setFormData] = useState({
    forms_id: selectedForm.id,
    title: selectedForm.title,
    date_and_venue: selectedForm.date_and_venue,
    clientele_type_and_number: selectedForm.clientele_type_and_number,
    male_participants: selectedForm.participants_male,
    female_participants: selectedForm.participants_female,
    no_of_participants: selectedForm.no_of_participants,
    estimated_cost: selectedForm.estimated_cost,
    cooperating_agencies_units: selectedForm.cooperating_agencies_units,
    expected_outputs: selectedForm.expected_outputs,
    fund_source: selectedForm.fund_source,
    proponents_implementors: selectedForm.proponents_implementors,

    date_of_activity: 'n/a',
    venue: 'n/a'
  });


  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //----------axiosClient
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

        if (response.data.success === true){
          populateDocx(); // Run the download of DOCX
          setAxiosMessage(response.data.message); // Set success message
          setAxiosStatus(response.data.success);
        }
      } catch (error) {
        setAxiosMessage(error.response.data.message);
        setAxiosStatus(false);
      }
    
  };

  //For Unified Inputs 
  const renderInput = (name, label) => (
    <div className="flex flex-1 flex-col">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        autoComplete={name}
        placeholder="I am empty..."
        required
        value={formData[name]}
        onChange={handleChange}
        className="bg-gray-100 border border-gray-200"
      />
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      {/**For Feedback */}
      <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message}  status={status}/>

      <h1 className='text-center'>
        Generate Extension Accomplishment Report
      </h1>

      <form onSubmit={handleSubmit} >
        {renderInput("title", "Title: ")}
        {renderInput("date_and_venue", "Date and Venue of Activity: ")}
        {renderInput("clientele_type_and_number", "Clientele Type and Number: ")}
        {renderInput("male_participants", "Male Participants: ")}
        {renderInput("female_participants", "Female Participants: ")}
        {renderInput("no_of_participants", "Total Number of Participants: ")}
        {renderInput("estimated_cost", "Estimated Cost: ")}
        {renderInput("cooperating_agencies_units", "Cooperating Agencies/Units: ")}
        {renderInput("expected_outputs", "Expected Outputs: ")}
        {renderInput("fund_source", "Fund Source: ")}
        {renderInput("proponents_implementors", "Proponents/Implementors: ")}

        <h1 className='text-center m-3'>
          Proposed Expenditures:
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Estimated Cost</th>
              {/*<th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium uppercase tracking-wider">Total</th>*/}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proposedExpenditures.map((input, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-no-wrap">{input.item}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{input.estimated}</td>
                  {/*<td className="px-6 py-4 whitespace-no-wrap">{input.total}</td>*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h1 className='text-center m-3'>
          Actual Expenditures:
        </h1>
        <div className="flex flex-col justify-center items-center w-full overflow-x-auto">
            <table>
              <thead className='bg-gray-300'>
                <tr>
                  <th className={tableBorder}>Type</th>
                  <th className={tableBorder}>Item</th>
                  <th className={tableBorder}>Approved Budget</th>
                  <th className={tableBorder}>Actual Expenditure</th>
                  <th className={tableBorder}>Action</th>
                </tr>
              </thead>
              <tbody>
                {actualExpendatures.map((input, index) => (
                  <tr key={index}>
                    <td className={tableBorder}>
                      <select
                        id={`type${index}`}
                        name="type"
                        autoComplete="type"
                        required
                        className="flex-1 px-2 py-1 mr-3"
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
                    <td className={tableBorder}>
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
                    <td className={tableBorder}>
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
                    <td className={tableBorder}>
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
                    <td className={tableBorder}>
                      <button type="button" title="Delete Row">
                        <MinusCircleIcon onClick={() => removeFields(index)} className="w-6 h-6 text-red-500 cursor-pointer transform transition-transform hover:scale-125" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-3">
              <NeutralButton label="Add more.." onClick={() => addFields()} />
            </div>

        </div>
        
        <div className='flex justify-center mt-5'>
          <AddImages onImagesChange={handleImagesChange} />
        </div>

        <div className='mt-5'>
          <Submit label="Submit"/>
        </div>
      </form>
    </div>
  )
  
}
