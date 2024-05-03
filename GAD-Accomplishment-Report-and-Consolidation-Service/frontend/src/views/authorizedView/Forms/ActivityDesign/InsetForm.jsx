import { React, useState } from 'react'
import Submit from '../../../components/buttons/Submit';
import axiosClient from '../../../axios/axios';
import NeutralButton from '../../../components/buttons/NeutralButton';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { TemplateHandler } from 'easy-template-x';
import InsetNEWLEADSFORM from '../../../components/printing/forms/InsetNEWLEADSFORM.docx'
import ReactModal from 'react-modal';
import AddPrompt from '../../prompts/AddPrompt';

//For Feedback
import Feedback from '../../../components/feedbacks/Feedback';


export default function InsetForm() {
  //For feedback
  const [message, setAxiosMessage] = useState(''); // State for success message
  const [status, setAxiosStatus] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    legal_bases: '',
    date_of_activity: '',
    venue: '',
    participants: '',
    learning_service_providers: '',
    expected_outputs: '',
    fund_source: '',
    proponents_implementors: '',
  });

      //----------for docx
      const fileUrl = InsetNEWLEADSFORM; // Use the imported file directly

      const [promptMessage, setPromptMessage] = useState('');
      const [showPrompt, setShowPrompt] = useState(false);
      const action = "Confirm Add New Inset New Leads Activity Form?";
  
       //<><><><><><>
      const addprompt = (ev) => {
        ev.preventDefault();
        const concatmessage = 'A new inset new leads form for the activity: "' + formData['title'] +  '" will be created. Do you wish to proceed?';
        setPromptMessage(concatmessage);
        setShowPrompt(true);
      }

      const fetchData = async (url) => {
        const response = await fetch(url);
        return await response.blob();
      };
    
      const populateDocx = async () => {
        try {
            const blob = await fetchData(fileUrl);
            console.log('Received blob:', blob); // Check the type and content of the blob
            const data = {
                title: formData.title,
                purpose: formData.purpose,
                legalBases: formData.legal_bases,
                dateOfActivity: formData.date_of_activity,
                venue: formData.venue,
                participants: formData.participants,
                numberOftargetParticipants: formData.no_of_target_participants,
                learningServiceProviders: formData.learning_service_providers,
                expectedOutputs: formData.expected_outputs,
                fundSource: formData.fund_source,
                // Include additional fields here as needed
                // For example, for budgetary requirements
                budgetaryRequirements: inputFields.reduce((acc, field) => {
                  const existingField = acc.find(item => item.type === field.type);
                  if (existingField) {
                      existingField.items.push({
                          item: `-${field.item}`,
                          perItem: field.per_item,
                          noItem: field.no_item,
                          times: field.times,
                          total: field.total
                      });
                  } else {
                      acc.push({
                          type: field.type,
                          items: [{
                              item: `-${field.item}`,
                              perItem: field.per_item,
                              noItem: field.no_item,
                              times: field.times,
                              total: field.total
                          }],
                      });
                  }
                  return acc;
              }, [])
            };
            console.log(data);
            const handler = new TemplateHandler();
            const processedBlob = await handler.process(blob, data); // Process the blob
            console.log('Processed blob:', processedBlob); // Check the processed blob
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
    
    
  //----------for exenditure

  const [inputFields, setInputFields] = useState([
    {type: '', item: '', per_item: '', no_item: '', times: 1, total: '0'}
  ])// <><><>

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

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  }

  const addFields = () => {
    let newfield = {type: '', item: '', per_item: '', no_item: '', times: 1, total: '0'}

    setInputFields([...inputFields, newfield])
  }

  const removeFields = (index) => {
    if (inputFields.length > 1) {
      let data = [...inputFields];
      data.splice(index, 1)
      setInputFields(data);
    }
  }

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //----------axiosClient
  const handleSubmit = async () => {
    
    setAxiosMessage('Loading...');
    setAxiosStatus('Loading');

    try{
      const response = await axiosClient.post('/form_inset', { 
        form_data: formData, 
        xp_data: inputFields 
      });
        if (response.data.success === true){
          populateDocx(); // Run the download of DOCX
        }

        setAxiosMessage(response.data.message);
        setAxiosStatus(response.data.success); 
        
    } catch (error) {
      setAxiosMessage(error.message);
      setAxiosStatus(false);
    }
  };

  //For Unified Inputs 
  const renderInput = (name, label) => (
    <div className="flex flex-1 flex-col">
      <label htmlFor={name}>{label}</label>
      {name === "purpose" ? ( // Check if the input is for "Purpose"
        <textarea
          id={name}
          name={name}
          autoComplete={name}
          required
          value={formData[name]}
          onChange={handleChange}
          className="bg-white"
          rows={4} // Set the number of rows to accommodate long text
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          autoComplete={name}
          required
          value={formData[name]}
          onChange={handleChange}
          className="bg-white"
        />
      )}
    </div>
  );

  return (
    <div className='bg-gray-100 m-5 p-3'>
    {/**For Feedback */}
    <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <h1 className='text-center'>
        Inset New Leads Form
      </h1>

      <form onSubmit={addprompt} >
        {renderInput("title", "Title: ")}
        {renderInput("purpose", "Purpose: ")}
        {renderInput("legal_bases", "Legal Bases: ")}
        {renderInput("date_of_activity", "Date of Lead Activity: ")}
        {renderInput("venue", "Venue: ")}
        {renderInput("participants", "Participants: ")}
        {renderInput("learning_service_providers", "Learning Service Providers: ")}
        {renderInput("expected_outputs", "Expected Outputs: ")}
        {renderInput("fund_source", "Fund Source: ")}
        {renderInput("proponents_implementors", "Proponents/Implementors: ")}
        <h1 className='text-center m-3'>
          Budgetary Requirements
        </h1>
            
        <div>
        <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Cost Per Item</th>
                  <th>Number of Items</th>
                  <th>Number of Times</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inputFields.map((input, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        id="type"
                        name="type"
                        autoComplete="type"
                        required
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
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
                    <td className='text-center'>
                      <button type="button" title="Delete Row" onClick={() => removeFields(index)}>
                        <MinusCircleIcon className="w-6 h-6 text-red-500 cursor-pointer transform transition-transform hover:scale-125" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <NeutralButton label="Add more.." onClick={() => addFields()} />
            </div>
          
        </div>
            <div className='mt-5'>
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
