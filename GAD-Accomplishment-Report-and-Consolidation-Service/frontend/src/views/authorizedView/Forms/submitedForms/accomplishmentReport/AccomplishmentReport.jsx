import { React, useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import axiosClient from '../../../../axios/axios';
import { ArchiveBoxArrowDownIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import ReactModal from 'react-modal';
import ViewEADReportModal from '../activityForms/components/modals/ViewEADReportModal';
import ArchiveReportModal from './components/modals/ArchiveReportModal';
import EditActivityModal from '../activityForms/components/modals/EditActivityModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AccomplishmentReport() {
  const [accomplishmentReport, setAccomplishmentreport] = useState([]);
  const [selectedForm, setSelectedForm] = useState('')

  //For Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);
  
  const fetchForms = async () => {
    try {
      const accomplishmentReport = await axiosClient.get('/show_accomplishment_report');

        setAccomplishmentreport(accomplishmentReport.data);

    } catch (error) {
      console.error(error);
    }
  };

  // For Form EDIT
  const handleEditClick = (selected_form) => {
    setIsEditModalOpen(true)
    setSelectedForm(selected_form)
    console.log('this is the selected form: ', selected_form);
  }

  // For Form Archive
  const handleArchiveClick = (selected_form) => {
    setIsArchiveModalOpen(true)
    setSelectedForm(selected_form)
  }

  console.log(accomplishmentReport);
  return (
    <div className='flex justify-center'>
      <div className="w-full max-w-md px-2 py-5 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              key="AccomplishmentReport"
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              Employee
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
              key="AccomplishmentReport"
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <ul>
                {accomplishmentReport.map((formEntry) => (
                  <li
                  key={(formEntry).id}
                  className="relative rounded-md p-3 hover:bg-gray-100"
                >
                  <h3 className="text-sm font-medium leading-5">
                    Title
                  </h3>

                  <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">  
                      <li>{formEntry.forms.title}</li>
                  </ul>

                  <ul>
                      
                      <button onClick={() => handleArchiveClick((formEntry))}>
                          <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                      </button>
                      <button onClick={() => handleEditClick((formEntry))}>
                          <PresentationChartLineIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-125' />
                      </button>
                    </ul>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/** Modal For User EDIT */}
      <ReactModal
    isOpen={isEditModalOpen}
    onRequestClose={() => setIsEditModalOpen(false)}
    className="w-full md:w-[30%] lg:w-[60%] h-[80%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[5%] mx-auto p-5 overflow-auto"
>
    <div>
        {selectedForm && selectedForm.forms && selectedForm.forms.form_type === 'EAD' ? (
            <ViewEADReportModal closeModal={() => setIsEditModalOpen(false)} selectedForm={selectedForm} />
        ) : (
            <EditActivityModal closeModal={() => setIsEditModalOpen(false)} selectedForm={selectedForm} />
        )}
    </div>
</ReactModal>


        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isArchiveModalOpen}
            onRequestClose={() => setIsArchiveModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <ArchiveReportModal
                 closeModal={() => setIsArchiveModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>
    </div>
  )
}
