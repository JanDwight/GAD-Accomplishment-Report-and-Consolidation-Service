import React, { useState, useEffect } from 'react';
import Submit from '../../../../../../components/buttons/Submit';
import axiosClient from '../../../../../../axios/axios';

//For Feedback
import Feedback from '../../../../../../components/feedbacks/Feedback';

export default function ViewMandatesModal({ mandateSelected }) {

  const renderInput = (name, label) => (
    <div className="flex flex-1 flex-col flex text-center">
      <label htmlFor={name}>{label}</label>
          <textarea 
            id={name}
            name={name}
            autoComplete={name}
            disabled
            value={mandateSelected[name]}
            className="px-2 border border-black"
            rows={2}
        />
    </div>
  );

  return (
    <div className="w-[50vw] h-[80vh] overflow-auto">
      <div className='text-center pb-5'>
        <strong className="text-lg">Gender Issue/GAD Mandate</strong>
      </div>
      <form>
        {renderInput('gender_issue', 'Gender Issues/GAD Mandate')}
        {renderInput('cause_of_gender_issue', 'Cause of Gender Issues:')}
        {renderInput('gad_result_statement', 'GAD Result Statement:s')}
        {renderInput('gad_activity', 'GAD Activity:')}
        {renderInput('performance_indicators', 'Performance Indicator/Targets:')}
        {renderInput('target_result', 'Target Result:')}
        {renderInput('focus', 'Activity Focus:')}
      </form>
    </div>
  );
}
