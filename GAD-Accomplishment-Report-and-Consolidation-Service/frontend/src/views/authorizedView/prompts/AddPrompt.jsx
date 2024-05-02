import React from 'react';

export default function AddPrompt({closeModal, handleSave, action, promptMessage }) {

  const handleYes = () => {
    handleSave();
    closeModal()
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full lg:w-2/5 px-4 py-6 shadow-lg rounded-lg border-2 border-black">
            <div className="mb-6 text-center"> 
            <strong className="text-2xl">{action}</strong>
                <p className='pt-2'>
                  {promptMessage}
                </p>
            </div>
            <div id="decision" className='text-center space-x-3'>
                <button onClick={handleYes} className="rounded-md bg-green-700 px-5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400">
                    Yes
                </button>
                <button onClick={closeModal} className="rounded-md bg-red-700 px-5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400">
                    No
                </button>
            </div>
      </div>
    </div>
  );
}