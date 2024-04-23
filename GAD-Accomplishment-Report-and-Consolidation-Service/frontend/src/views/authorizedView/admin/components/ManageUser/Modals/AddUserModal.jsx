import { React, useState} from 'react'
import { Menu } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Submit from '../../../../../components/buttons/Submit'
import axiosClient from '../../../../../axios/axios';
import Feedback from '../../../../../components/feedbacks/Feedback';


export default function AddUserModal() {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');


      const onSubmit = async (ev) => {
        ev.preventDefault();
    
        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');
    
        try {
          const response = await axiosClient.post('/adduser', { email, username: userName, password, role });
          setAxiosMessage(response.data.message);
          setAxiosStatus(response.data.success);
        } catch (error) {
          setAxiosMessage(error.response.data.message);
          setAxiosStatus(false);
        }
      }
  
    const style = 'text-center border border-black'

  return (
    <div className='h-full grid place-items-center text-center'>

    <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <div>
        <form onSubmit={onSubmit} className='flex flex-1 flex-col'>
          {/**For inputs */}
          <div className='flex flex-col'>
            <label htmlFor="email">Email: </label>
              <input 
                  placeholder={'example@email.com'}
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={ev => setEmail(ev.target.value)}
                  className={style}
              />
            <label htmlFor="username">User Name: </label>
              <input
                  placeholder={'Name of College'}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={userName}
                  onChange={ev => setUserName(ev.target.value)}
                  className={style}
              />
            <label htmlFor="password">Password: </label>
              <input
                  placeholder={'Input Password'}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  className={style}
              />
          </div>

          {/**For Roles */}
          <div className='pt-3'>
            <Menu >
              {({ open }) => (
                <>
                  <Menu.Button className="flex w-full justify-between  bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Select Role</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                    />
                  </Menu.Button>

                  <Menu.Items className="px-4 pb-2 pt-4 text-sm text-gray-500 bg-purple-50">
                    <div className="flex flex-col ">
                      <Menu.Item>
                        <button 
                          className="hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                          onClick={() => setRole('admin')}>
                          Admin
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button 
                          className="hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                          onClick={() => setRole('college')}>
                          College
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </>
              )}
            </Menu >
          </div>
          
          {/**BUTTONS */}
          <div className='mt-5'>
            <Submit label="Add User" /*disabled={ your condition }*/ />
          </div>
        </form>
      </div>
    </div>
  )
}
