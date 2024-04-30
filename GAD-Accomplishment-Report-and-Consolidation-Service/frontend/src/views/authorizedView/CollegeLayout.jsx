import { React, Fragment, useState, useEffect } from 'react'
import { useStateContext } from '../../context/ContextProvider'
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import axiosClient from '../axios/axios';
import GADLogo from '../../TMP/GAD_Logo.png'

const navigation = [
  //{ name: 'Home', href: '#', current: false },
  { name: 'Activity Design Forms', to: '/college/forms'},
  { name: 'Submitted Forms', to: '/college/submitedforms'},
  { name: 'Accomplishment Reports', to: '/college/accomplishmentreport'},
  //{ name: 'Employee Activity Form', to: '/college/printemployeeactivityform'}
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CollegeLayout() {
    const { userToken, setCurrentUser, setUserToken  } = useStateContext();
    const [userData, setUserData] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const { userToken } = useStateContext();

    useEffect(() => {
      fetchUser();
      console.log('name: ', userDetails);
    }, []);

    const fetchUser = async () => {
      try {
        const response = await axiosClient.get('/profile');
        setUserDetails(response.data.message.username);
        console.log('Return: ', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const logout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout')
          .then(res => {
            setCurrentUser({})
            setUserToken(null)
          })
      };

      useEffect(() => {
        (async () => {
          try {
            const response = await axiosClient.get('/profile');
            setUserData(response.data.message); // Assuming response.data contains email, username, etc.
          } catch (error) {
            console.error(error);
          }
        })();
      }, []);

    if(!userToken){
        return <Navigate to='/' />
    }

    console.log('This is the User', userData);
    return (
      <>
        <div className='h-screen overflow-hidden'>
        {/*NavBar*/}
        <Disclosure as="nav" className="bg-primary">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">

                <div className="relative flex h-16 items-center justify-between">

                  {/* Mobile menu button*/}
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  <div className="flex h-full items-center sm:items-stretch sm:justify-start">

                    <div className="flex flex-shrink-0 items-center">
                      <img src={GADLogo} alt="" className='w-full h-[80%]  transform transition-transform hover:scale-125' />
                    </div>

                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex justify-center items-center h-full space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => classNames(
                              isActive ? 'bg-accent text-black drop-shadow-gs'  
                                       : 'text-black hover:bg-accent hover:text-black hover:drop-shadow-gs',
                              'flex justify-center items-center px-3 py-2 h-full text-base md:text-sm xl:text-md font-medium'
                            )}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <strong className='mx-2'>
                     {userDetails}
                    </strong>
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          {userData.logo?.original_path ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`${import.meta.env.VITE_API_BASE_URL}${userData.logo.original_path}`}
                            alt=""
                          />
                        ) : (
                          <UserIcon className="h-8 w-8 rounded-full" />
                        )}
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/college/profile"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={(ev) => logout(ev)}
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>

                        </Menu.Items>

                      </Transition>

                    </Menu>

                  </div>

                </div>
                
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) => classNames(
                        isActive
                          ? 'bg-[#CCEFCC] text-[#737373]'
                          : 'text-[#737373] hover:bg-[#CCEFCC] hover:text-[#737373]',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}  
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="flex h-full">
          <div className="max-h-[90%] max-w-[100%] min-w-[100%] pt-1 sm:px-6 lg:px-6`">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
