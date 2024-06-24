import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../axios/axios';
import ReactModal from 'react-modal';
import SetMandateModal from './components/modals/SetMandateModal';
import Feedback from '../../../../components/feedbacks/Feedback';

export default function AssignMandates() {
  const [message, setAxiosMessage] = useState('');
  const [status, setAxiosStatus] = useState('');

    const [n_mandate, setMandate] = useState([]);
    const [report, setReport] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showMandate, setShowMandate] = useState(false);
    const [reportList, setReportList] = useState([]);

    useEffect(() => {
        fetchReports();
        fetchMandates();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axiosClient.get('/show_accomplishment_report');
            if (response.data) {
                setReport(response.data);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMandates = async () => {
        try {
            const response = await axiosClient.get('/showmandates');
            if (response.data) {
                setMandate(response.data);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

     // Function to toggle the selection of a row
    const toggleRowSelection = (index) => {
        const isSelected = selectedRows.includes(index);
        if (isSelected) {
          setSelectedRows(selectedRows.filter((i) => i !== index));
        } else {
          setSelectedRows([...selectedRows, index]);
        }
    };
      // Function to toggle the selection of all rows
    const toggleSelectAll = () => {
        if (selectAll) {
          setSelectedRows([]);
        } else {
          setSelectedRows(report.map((_, index) => index));
        }
        setSelectAll(!selectAll);
    };

    //<><><><><>
  const editprompt = (ev) => {
    ev.preventDefault();
    
    if (selectedRows.length === 0) {
      // No items selected, show an error message
      setAxiosMessage('No items selected.');
      setAxiosStatus(false);
      //console.log('Suc: ', success);
    } else {
      const selectedItems = selectedRows.map((index) => ({
        title: report[index].title,
        mandates_id: report[index].mandates_id,
      }));
  
      console.log('Selected: ', selectedItems);
      console.log('Mandates: ', n_mandate);
      
      setReportList(selectedItems);
      setShowMandate(true);
    }
  }

    return (
        <div className='bg-white h-full rounded-xl overflow-y-auto flex justify-center'>
            <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message}  status={status} refresh={false}/>
            <div className='overflow-y-auto rounded-xl w-full'>
              <table id="reports_table" className="w-full text-center h-fit">
                  <thead className='bg-secondary sticky top-0'>
                      <tr>
                          <th>
                              <input id='allselect' type="checkbox" className="ml-5" checked={selectAll} onChange={toggleSelectAll}/>
                              <label className="ml-2">Select All</label>
                          </th>
                          <th className='text-center bg-secondary p-2 '>Accomplishment Report</th>
                          <th className='text-center bg-secondary p-2 '>GAD Mandate</th>
                      </tr>
                  </thead>
                  <tbody>
                  {report.map((fileName, index) => (
                    <tr 
                      key={index} 
                      onClick={() => toggleRowSelection(index)}
                      className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                    >
                      <td className='text-center'>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                        />
                      </td>
                      <td className='text-left px-5'>{fileName.id}) {fileName.title}</td>
                      <td className='text-center'>{fileName.mandates_id}</td>
                    </tr>
                  ))}
                  </tbody>
              </table>
            </div>
            <div 
            //className='w-full flex pt-2 justify-end'
              className='w-[10%] flex justify-center absolute bottom-4 right-5 flex space-x-3 pt-5'
            >
                   <button
                    onClick={editprompt}
                    className={`rounded-md bg-primary hover:bg-accent hover:drop-shadow-gs px-3 py-1.5 text-xs xl:text-md font-semibold leading-6 text-white text-center shadow-sm`}
                   >
                    Set Mandates
                   </button>
            </div>
            <ReactModal
              isOpen={showMandate}
              onRequestClose={() => setShowMandate(false)}
              className="mx-auto my-[5%] bg-white w-full h-[75%] lg:w-2/5 px-4 py-4 shadow-lg rounded-lg ring-1 ring-black shadow-2xl "
            >
              <SetMandateModal
                closeModal={() => setShowMandate(false)}
                reportList={reportList}
                n_mandate={n_mandate}
              />
            </ReactModal>

        </div>
    );
}
