import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios/axios';
import NeutralButton from '../buttons/NeutralButton';

export default function Logs() {
  const [filterText, setFilterText] = useState(''); //for search
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axiosClient.get('/showlogs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  // for search function
  const filteredData = logs.filter(
    (log) =>
      log.id && log.id.toString().includes(filterText) ||
      log.description && log.description.toString().includes(filterText) ||
      log.causer_id && log.causer_id.toString().includes(filterText)
  );

  const printLogsToFile = () => {
    const formattedLogs = filteredData.map(log => {
      return `Log ID: ${log.id}, By: ${log.causer_username}, Properties: ${JSON.stringify(log.properties)}, On: ${log.formated_updated_at}\n`;
    }).join('');

    const blob = new Blob([formattedLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `logs_${dateString}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
        <div className="h-full">
          <div className='bg-white flex h-full rounded-xl'>
            <table className='w-screen text-left'>
              <thead className='bg-secondary sticky top-0'>
                <tr>
                  <th className='w-28 px-4 py-2'>Log ID</th>
                  <th className='px-4 py-2'>By</th>
                  <th className='px-4 py-2'>Properties</th>
                  <th className='px-4 py-2'>On</th>
                  {/* Add more table headers as needed */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((log, index) => (
                  <tr 
                    key={index}
                    className='border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs'
                  >
                    <td className='px-4 py-2'>{log.id}</td>
                    <td className='px-4 py-2'>{log.causer_username}</td>
                    <td className='px-4 py-2'>
                      {/* Render properties based on their types */}
                      {renderProperties(log.properties)}
                    </td>
                    <td className='w-28 px-4 py-2'>{log.formated_updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute bottom-10 right-20 mr-10">
            <NeutralButton label="Print Logs" onClick={() => printLogsToFile()} />
          </div>
        </div>
  );
}

// Function to render properties based on their types
const renderProperties = (properties) => {
  // If properties is an empty array, return empty string
  if (Array.isArray(properties) && properties.length === 0) {
    return '';
  }

  // If properties is an object, render its keys and values
  if (typeof properties === 'object' && properties !== null) {
    return Object.keys(properties).map((key, index) => (
      <div key={index}>
        <strong>{key}:</strong> {renderPropertyValue(properties[key])}
      </div>
    ));
  }

  // If properties is a string or other type, render it directly
  return renderPropertyValue(properties);
};

// Function to render property values based on their types
const renderPropertyValue = (value) => {
  // If value is an object, stringify it
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  // If value is null or undefined, return empty string
  if (value === null || value === undefined) {
    return '';
  }

  // Otherwise, render the value directly
  return value;
};
