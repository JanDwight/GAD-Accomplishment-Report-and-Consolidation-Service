import { React, useState} from 'react'
import axiosClient from '../../../../../axios/axios';

//For Feedback
import Feedback from '../../../../../components/feedbacks/Feedback';
import Error from '../../../../../components/feedbacks/Error';

export default function SetMandateModal({closeModal, reportList, n_mandate}) {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);
  const [mandateSelected, setMandateSelected] = useState("1");

  console.log('List: ', reportList);
  console.log('Mandate: ', n_mandate);

  const handleYes = () => {
    handleSave();
    closeModal();
  }

  const handleSetMandates = async (ev) => {
    ev.preventDefault();
    axiosClient.put('/setmandates', {
      reportList: reportList,
      mandate_id: mandateSelected
    })
        .then(response => {
            console.log('Success:', response.data);
            setMessage(response.data.message);
            setSuccess(response.data.success);
        })
  }

  return (
    <div className='w-full'>
      <Feedback isOpen={message !== ''} onClose={() => setSuccess('')} successMessage={message}  status={success}/>
        <div className='relative text-center w-full'>
          <strong className="text-2xl">Set GAD Mandate</strong>
        </div>
        <form 
          onSubmit={handleSetMandates}
          className='w-full overflow-y-auto bg-white h-full rounded-xl'
        >
          <div className="relative max-h-[50vh] mb-5 overflow-y-auto"> 
                  <table className="w-full text-center h-fit ">
                    <thead className='bg-secondary sticky top-0'>
                      <tr className='border border-gray-300'>
                        <th className="text-left bg-secondary p-2 ">Accomplisment Report Title</th>
                        <th className="text-left bg-secondary p-2 ">Current Mandate</th>
                      </tr>
                    </thead>
                    <tbody>
                    {reportList.map((item, index) => (
                      <tr 
                        key={index}
                        className='border-b-2 border-secondary'
                      >
                        <td className='text-center'>{item.title}</td>
                        <td className='text-center'>{item.mandates_id}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
          </div>
          <strong className='relative pt-1'>
            Assign to Gender Issue:
          </strong>
          <div className='relative mb-2'>
          <select
            className='relative w-full border border-gray-300'
            onChange={(e) => setMandateSelected(e.target.value)}
          >
            {n_mandate.map((mandate, index) => (
              <option key={index} value={mandate.id}>
                {mandate.id}) {mandate.gender_issue}
              </option>
            ))}
          </select>
          </div>
          <div className='flex justify-center relative text-center space-x-3'>
            <button type="submit" className="bg-[#397439] hover:bg-[#0FE810] rounded-2xl  px-7 py-2 text-white font-size">
              Confirm
            </button>
            <button type="button" onClick={closeModal} className="bg-red-600 hover:bg-red-700 rounded-2xl  px-7 py-2 text-white font-size">
              Cancel
            </button>
          </div>
        </form>
    </div>
  )
}
