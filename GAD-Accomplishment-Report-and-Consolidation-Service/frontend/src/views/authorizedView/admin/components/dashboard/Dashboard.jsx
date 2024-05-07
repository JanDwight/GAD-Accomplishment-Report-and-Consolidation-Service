import React, { useState } from "react";
import ReactModal from "react-modal";
import BackupList from "../../../../components/backupAndRestore/BackupList";
import Logs from "../../../../components/logs/Logs";
import UserDashboard from "./components/UserDashboard";
import UserReport from "./components/UserReport";

export default function Dashboard() {
  const [modals, setModals] = useState({
    showLogs: false,
    showUserReport: false
  });

  // Function to toggle the modal
  const toggleModal = (modalName, value) => {
    setModals(prevState => ({
      ...prevState,
      [modalName]: value
    }));
  };

  const style = "max-w-[90%] w-fit max-h-[95%] min-h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl my-[1%] mx-auto p-5 pt-0 overflow-y-auto"
    
  return (
    <div className='h-full p-2'>
      <div className='shadow-2xl ring-1 ring-black bg-[#FFFFFF] rounded-lg' onClick={() => toggleModal('showUserReport', true)}>
      <UserDashboard />
      </div>
      
      <div className="h-[70%] flex col-2 text-xs mt-5">
        <div 
          className="w-[49%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mx-auto hover:overflow-y-auto overflow-hidden"
          onClick={() => toggleModal('showLogs', true)}
        >
          <Logs />
        </div>
    
        <div className="w-[49%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mx-auto hover:overflow-y-auto overflow-hidden">
          <BackupList />
        </div>
      </div>

<ReactModal
    isOpen={modals.showLogs}
    onRequestClose={() => toggleModal('showLogs', false)} // Close the Logs modal
    className={style}
>
    <div>
        <Logs closeModal={() => toggleModal('showLogs', false)} />
    </div>
</ReactModal>

<ReactModal
    isOpen={modals.showUserReport} // Use showUserReport for this modal
    onRequestClose={() => toggleModal('showUserReport', false)} // Close the UserReport modal
    className={style}
>
    <div>
        <UserReport closeModal={() => toggleModal('showUserReport', false)} />
    </div>
</ReactModal>

    </div>
  );
}
