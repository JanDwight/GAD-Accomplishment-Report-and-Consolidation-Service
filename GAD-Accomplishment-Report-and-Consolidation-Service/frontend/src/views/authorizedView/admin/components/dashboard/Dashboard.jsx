import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../axios/axios';
import { PencilIcon, ArchiveBoxArrowDownIcon } from '@heroicons/react/24/solid';
import LoadingHorizontalLine from '../../../../components/feedbacks/LoadingHorizontalLine';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState(''); //for search
  const [isHorizontalLoading, setIsHorizontalLoading] = useState(false)
  // for search function
  const filteredData = users.filter(
    (user) => user.username && user.username.toString().includes(filterText)
  );

  useEffect(() => {
    const fetchCurriculum = async () => {
      setIsHorizontalLoading(true);

      try {
        const response = await axiosClient.get('/showusers');
          setUsers(response.data);
          setIsHorizontalLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurriculum();
  }, []);

  const handleEditClick = (user) => {
    // Handle edit click
  };

  const handleArchiveClick = (user) => {
    // Handle archive click
  };
  
  const headerStyles = 'font-bold text-xs'

  return (
    <div className='h-full'>
      <div className='bg-white flex h-full overflow-y-auto rounded-xl relative'>

        {/* Loading Horizontal Line */}
        {isHorizontalLoading && (
          <div className="absolute top-[5%] left-0 w-full">
            <LoadingHorizontalLine isLoading={isHorizontalLoading}/>
          </div>
        )}

        <table className='w-screen text-center h-fit'>
          <thead className='bg-secondary sticky top-0'>
            <tr>
              <td className={`${headerStyles} w-[40%]`}>USERS</td>
              <td className={headerStyles}>SUBMITTED ACTIVITY DESIGN<div>TOTAL</div></td>
              <td className={headerStyles}>ACCOMPLISHMENT REPORTS<div>TOTAL</div></td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr 
                key={index} 
                className='px-10 border-b-2 border-secondary hover:bg-accent hover:drop-shadow-gs transition-transform hover:scale-sm'
              >
                <td className="text-center p-2">{user.username}</td>
                <td className="text-center p-2">{user.forms_count}</td> {/* Display submitted activity count */}
                <td className="text-center p-2">{user.accomplishment_report_count}</td> {/* Display completed activity count */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
