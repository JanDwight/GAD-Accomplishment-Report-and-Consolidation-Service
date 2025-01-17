import { React, useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { Menu } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import axiosClient from '../../../axios/axios';
import { ArchiveBoxArrowDownIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ReactModal from 'react-modal';
import EditActivityModal from '../submitedForms/activityForms/components/modals/EditActivityModal';
import ArchiveActivityModal from '../submitedForms/activityForms/components/modals/ArchiveActivityModal';
import GenerateAccomplishmentReport from '../submitedForms/activityForms/components/modals/GenerateAccomplishmentReport';
import GenerateFormReport from '../submitedForms/activityForms/components/modals/GenerateFormReport';
import EditEADModal from '../submitedForms/activityForms/components/modals/EditEADModal';
import LoadingHorizontalLine from '../../../components/feedbacks/LoadingHorizontalLine';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SubmitedForms() {
  const [employeeForms, setEmployeeForms] = useState([]);
  const [insetForms, setInsetForms] = useState([]);
  const [eadForm, setEadForm] = useState([]);
  const [selectedForm, setSelectedForm] = useState('')
  const [isGenerateAccomplishmentReportOpen, setIsGenerateAccomplishmentReportOpen] = useState(false);
  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false);

  //For Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isEditEADModalOpen, setIsEditEADModalOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);
  
  const fetchForms = async () => {
    setIsHorizontalLoading(true);

    try {
      const employeeFormData = await axiosClient.get('/show_form_employee');
      const insetFormData = await axiosClient.get('/show_form_inset');
      const eadFormData = await axiosClient.get('/show_form_ead');

      if (employeeFormData.data) {
        setEmployeeForms(employeeFormData.data);
      }
      if (insetFormData.data) {
        setInsetForms(insetFormData.data);
      } 
      if (eadFormData.data) {
        setEadForm(eadFormData.data);
      } 
      setIsHorizontalLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // For Form EDIT
  const handleEditClick = (selected_form) => {
    setIsEditModalOpen(true)
    setSelectedForm(selected_form)
  }

  // For Form Archive
  const handleArchiveClick = (selected_form) => {
    setIsArchiveModalOpen(true)
    setSelectedForm(selected_form)
  }

  // For Form EAD EDIT
  const handleEditEADClick = (selected_form) => {
    setIsEditEADModalOpen(true)
    setSelectedForm(selected_form)
  }

  // For Generate Accomplishment Report
  const handleGenerateAccomplishmentReportClick = (selected_form) => {
    setIsGenerateAccomplishmentReportOpen(true)
    setSelectedForm(selected_form)
  }

  const tabClassName = classNames(
    'flex-1 px-4 py-2 text-sm font-medium text-black rounded-lg bg-secondary hover:bg-accent focus:bg-accent',
  );
  
  return (
    <div className='h-full flex justify-center'>
      <div className="w-full mx-auto rounded-2xl bg-white p-2 h-full overflow-y-auto ">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-green-100 rounded-lg">
          <Tab
              key="Employee"
              className={tabClassName}
            >
              Employee
            </Tab>
            <Tab
              key="Inset"
              className={tabClassName}
            >
              Inset
            </Tab>
            <Tab
              key="EAD"
              className={tabClassName}
            >
              Extension Activity Design
          </Tab>
          </Tab.List>
          
          <Tab.Panels className="mt-2">
            <Tab.Panel
              key="Employee"
              className={classNames(
                'rounded-xl bg-white p-3 h-it',
              )}
            >

              {/**For Axios.GET method loading */}
              <div>
                <LoadingHorizontalLine isLoading={isHorizontalLoading}/>
              </div>

              <ul className='text-center'>
                {/*---------------------------------------*/}
                {employeeForms.length === 0 ? (
                <Menu as="div" className="space-y-2">
                    <div className="flex flex-col ">
                      <Menu.Item className="text-gray-500">
                        <p>No forms available.</p>
                      </Menu.Item>
                    </div>
                </Menu>
                ) : (
                <Menu as="div" className="space-y-2">
                  {employeeForms.map((user) => (
                    <Menu key={user.id}>
                      {({ open }) => (
                        <>
                          <Menu.Button className="border-b-2 border-secondary flex justify-between block w-full px-4 py-2 text-sm font-medium text-left hover:bg-accent focus:outline-none focus:bg-accent">
                            {user.username}
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-black`}
                            />
                          </Menu.Button>
                          {user.forms.length === 0 ? (
                            <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                              <div className="flex flex-col ">
                                <Menu.Item className="text-gray-500">
                                  <p>No forms available.</p>
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          ) : (
                          <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                            {user.forms.map((form) => (
                              <Menu.Item key={form.id}>
                                {({ active }) => (
                                  <li className='hover:bg-accent border-b-2 border-gray-300'>
                                    <ul className="mt-1  text-xs font-normal">
                                      <h3 className="text-sm font-medium leading-5">
                                        {form.title}
                                      </h3>
                                    </ul>
                                  <ul>
                                    <button title="Edit Activity Design" onClick={() => handleEditClick(form)}>
                                      <PencilIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Archive Activity Design" onClick={() => handleArchiveClick(form)}>
                                      <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Create Accomplishment Report" onClick={() => handleGenerateAccomplishmentReportClick(form)}>
                                      <SparklesIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                  </ul>
                                </li>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                          )}
                        </>
                      )}
                    </Menu>
                  ))}
                </Menu>
                )}
                {/*---------------------------------------*/}
              </ul>
            </Tab.Panel>
            <Tab.Panel
              key="Inset"
              className={classNames(
                'rounded-xl bg-white p-3 h-it',
              )}
            >
              <ul className='text-center'>
                {/*---------------------------------------*/}
                {insetForms.length === 0 ? (
                <Menu as="div" className="space-y-2">
                    <div className="flex flex-col ">
                      <Menu.Item className="text-gray-500">
                        <p>No forms available.</p>
                      </Menu.Item>
                    </div>
                </Menu>
                ) : (
                <Menu as="div" className="space-y-2">
                  {insetForms.map((user) => (
                    <Menu key={user.id}>
                      {({ open }) => (
                        <>
                          <Menu.Button className="border-b-2 border-secondary flex justify-between block w-full px-4 py-2 text-sm font-medium text-left hover:bg-accent focus:outline-none focus:bg-accent">
                            {user.username}
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-black`}
                            />
                          </Menu.Button>
                          {user.forms.length === 0 ? (
                            <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                              <div className="flex flex-col ">
                                <Menu.Item className="text-gray-500">
                                  <p>No forms available.</p>
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          ) : (
                          <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                            {user.forms.map((form) => (
                              <Menu.Item key={form.id}>
                                {({ active }) => (
                                  <li className='hover:bg-accent border-b-2 border-gray-300'>
                                    <ul className="mt-1  text-xs font-normal">
                                      <h3 className="text-sm font-medium leading-5">
                                        {form.title}
                                      </h3>
                                    </ul>
                                  <ul>
                                    <button title="Edit Activity Design" onClick={() => handleEditClick(form)}>
                                      <PencilIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Archive Activity Design" onClick={() => handleArchiveClick(form)}>
                                      <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Create Accomplishment Report" onClick={() => handleGenerateAccomplishmentReportClick(form)}>
                                      <SparklesIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                  </ul>
                                </li>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                          )}
                        </>
                      )}
                    </Menu>
                  ))}
                </Menu>
                )}
                {/*---------------------------------------*/}
              </ul>
            </Tab.Panel>
            <Tab.Panel
              key="EAD"
              className={classNames(
                'rounded-xl bg-white p-3 h-it',
              )}
            >
              <ul className='text-center'>
                {/*---------------------------------------*/}
                {eadForm.length === 0 ? (
                <Menu as="div" className="space-y-2">
                    <div className="flex flex-col ">
                      <Menu.Item className="text-gray-500">
                        <p>No forms available.</p>
                      </Menu.Item>
                    </div>
                </Menu>
                ) : (
                <Menu as="div" className="space-y-2">
                  {eadForm.map((user) => (
                    <Menu key={user.id}>
                      {({ open }) => (
                        <>
                          <Menu.Button className="border-b-2 border-secondary flex justify-between block w-full px-4 py-2 text-sm font-medium text-left hover:bg-accent focus:outline-none focus:bg-accent">
                            {user.username}
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-black`}
                            />
                          </Menu.Button>
                          {user.forms.length === 0 ? (
                            <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                              <div className="flex flex-col ">
                                <Menu.Item className="text-gray-500">
                                  <p>No forms available.</p>
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          ) : (
                          <Menu.Items className={`${open ? 'block' : 'hidden'} max-w-[100%] z-10 px-2 py-2 bg-white border rounded-md shadow-lg`}>
                            {user.forms.map((form) => (
                              <Menu.Item key={form.id}>
                                {({ active }) => (
                                  <li className='hover:bg-accent border-b-2 border-gray-300'>
                                    <ul className="mt-1  text-xs font-normal">
                                      <h3 className="text-sm font-medium leading-5">
                                        {form.title}
                                      </h3>
                                    </ul>
                                  <ul>
                                    <button title="Edit Activity Design" onClick={() => handleEditEADClick(form)}>
                                      <PencilIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Archive Activity Design" onClick={() => handleArchiveClick(form)}>
                                      <ArchiveBoxArrowDownIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                    <button title="Create Accomplishment Report" onClick={() => handleGenerateAccomplishmentReportClick(form)}>
                                      <SparklesIcon className='h-5 w-5 mx-1 cursor-pointer transform transition-transform hover:scale-1xl' />
                                    </button>
                                  </ul>
                                </li>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                          )}
                        </>
                      )}
                    </Menu>
                  ))}
                </Menu>
                )}
                {/*---------------------------------------*/}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/** Modal For User EDIT */}
        <ReactModal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            className="w-full md:w-[30%] lg:w-[90%] h-[95%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5 overflow-auto"
        >
            <div>
                <EditActivityModal
                 closeModal={() => setIsEditModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>

        {/** Modal For User ARCHIVE */}                
        <ReactModal
            isOpen={isArchiveModalOpen}
            onRequestClose={() => setIsArchiveModalOpen(false)}
            className="w-full md:w-[30%] h-fit bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[10%] mx-auto p-5"
        >
            <div>
                <ArchiveActivityModal
                 closeModal={() => setIsArchiveModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>
        
        
        {/** Modal For EADForm EDIT */}
        <ReactModal
            isOpen={isEditEADModalOpen}
            onRequestClose={() => setIsEditEADModalOpen(false)}
            className="w-full md:w-[30%] lg:w-[90%] h-[95%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5 overflow-auto"
        >
            <div>
                <EditEADModal
                 closeModal={() => setIsEditEADModalOpen(false)}
                 selectedForm={selectedForm}
                 />
            </div>
        </ReactModal>

        {/** Modal For Generate Accomplishment Report */}    
        <ReactModal
            isOpen={isGenerateAccomplishmentReportOpen}
            onRequestClose={() => setIsGenerateAccomplishmentReportOpen(false)}
            className="w-full md:w-[60%] lg:w-[90%] h-[90%] bg-[#FFFFFF] rounded-3xl ring-1 ring-black shadow-2xl mt-[1%] mx-auto p-5 overflow-auto"
        >
          <div>
              {selectedForm.form_type === 'EAD' ? (
                  <GenerateAccomplishmentReport
                      closeModal={() => setIsGenerateAccomplishmentReportOpen(false)}
                      selectedForm={selectedForm}
                  />
              ) : (
                  <GenerateFormReport
                      closeModal={() => setIsGenerateAccomplishmentReportOpen(false)}
                      selectedForm={selectedForm}
                  />
              )}
          </div>
        </ReactModal>
    </div>
  )
}
