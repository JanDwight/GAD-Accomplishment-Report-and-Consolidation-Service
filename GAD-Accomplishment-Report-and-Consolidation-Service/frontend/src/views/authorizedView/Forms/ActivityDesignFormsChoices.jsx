import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

import EmployeeForm from './ActivityDesign/EmployeeForm';
import InsetForm from './ActivityDesign/InsetForm';
import EADForm from './ActivityDesign/EADForm';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ActivityDesignFormsChoices() {

  const tabClassName = classNames(
    'flex-1 px-4 py-2 text-sm font-medium text-black rounded-lg bg-secondary hover:bg-accent focus:bg-accent',
  );

  return (
    <div className='h-full'>
      <div className="h-full overflow-auto">
        <div className="mx-auto rounded-2xl bg-white p-2">
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 bg-green-100 rounded-lg">
              <Tab
                className={tabClassName}
              >
                Employees Activity Form
              </Tab>
              <Tab
                className={tabClassName}
              >
                Inset New Leads Form
              </Tab>
              <Tab
                className={tabClassName}
              >
                Extension Activity Design Form
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <EmployeeForm />
              </Tab.Panel>
              <Tab.Panel>
                <InsetForm />
              </Tab.Panel>
              <Tab.Panel>
                <EADForm />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
