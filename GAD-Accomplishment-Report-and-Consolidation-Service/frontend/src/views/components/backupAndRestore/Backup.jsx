import React from 'react'
import NeutralButton from '../buttons/NeutralButton'
import axiosClient from '../../axios/axios';

export default function Backup() {
        const handleBackup = () => {
          // Make an HTTP POST request to trigger the backup process
          axiosClient.post('/backup/create')
            .then(response => {
              // Backup process initiated successfully, handle any further actions if needed
              console.log('Backup initiated:', response.data);
            })
            .catch(error => {
              // Handle errors if backup process failed
              console.error('Error initiating backup:', error);
            });
        };
        
  return (
    <div>
        <NeutralButton onClick={handleBackup}>Backup Database</NeutralButton>
    </div>
  )
}
