import { React, useState} from 'react'
import { Menu } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Submit from '../../../../../components/buttons/Submit'
import axiosClient from '../../../../../axios/axios';
import Feedback from '../../../../../components/feedbacks/Feedback';
import ReactModal from 'react-modal';
import AddPrompt from '../../../../prompts/AddPrompt';


export default function AddUserModal() {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const [menuText, setMenu] = useState('');

    const [message, setAxiosMessage] = useState('');
    const [status, setAxiosStatus] = useState('');

    const [promptMessage, setPromptMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const action = "Confirm Add New User?";

     //<><><><><><>
    const addprompt = (ev) => {
      ev.preventDefault();
      const concatmessage = 'A new user: "' + userName +  '" will be created. Do you wish to proceed?';
      setPromptMessage(concatmessage);
      setShowPrompt(true);
    }

      const onSubmit = async (ev) => {
        setAxiosMessage('Loading...');
        setAxiosStatus('Loading');

        if(password !== confirmPassword){
          setAxiosMessage('Password does not match. Please try again.');
          setAxiosStatus(false);
          return;
        }
    
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

    //---
    const handlePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const inputType = showPassword ? 'text' : 'password';
    //---

  return (
    <div className='h-full grid place-items-center text-center'>

    <Feedback isOpen={message !== ''} onClose={() => setAxiosMessage('')} successMessage={message} status={status} refresh={false}/>

      <div>
        <form onSubmit={addprompt} className='flex flex-1 flex-col'>
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
                  placeholder={'Office/Department'}
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
                  type={inputType}
                  autoComplete="password"
                  required
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  className={style}
              />
            <label htmlFor="confirmpassword">Confirm Password: </label>
              <input
                  placeholder={'Confirm Password'}
                  id="confirmpassword"
                  name="confirmpassword"
                  type={inputType}
                  autoComplete="confirm password"
                  required
                  value={confirmPassword}
                  onChange={ev => setConfirmPassword(ev.target.value)}
                  className={style}
              />
              <div className='flex space-x-2 justify-end pt-1'>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handlePasswordVisibility}
                />
                <label htmlFor="showPassword" className="text-sm">Show Password</label>
              </div>
          </div>

          {/**For Roles */}
          <div className='pt-3'>
            <Menu >
              {({ open }) => (
                <>
                  <Menu.Button className="flex w-full justify-between  bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>{role ? menuText : 'Select Role'}</span>
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
                          onClick={() => {setRole('admin'); setMenu('Admin');}}>
                          Admin
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button 
                          className="hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                          onClick={() => {setRole('college'); setMenu('User');}}>
                          User
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
      {/*----------*/}
      <ReactModal
            isOpen={showPrompt}
            onRequestClose={() => setShowPrompt(false)}
            className="md:w-[1%]"
          >
            <div>
                <AddPrompt
                    closeModal={() => setShowPrompt(false)}
                    handleSave={onSubmit}
                    action={action}
                    promptMessage={promptMessage}
                />
            </div>
        </ReactModal>
    </div>
  )
}
