import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Login from '../helpers/login';
import { UserContext } from '../context/userContext';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Colors from '../constants/colors';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }) {

  const userContext = useContext(UserContext);

  const router = useRouter();

  const navigation = [
    { name: 'Search', href: '/', current: router.pathname == '/' },
    { name: 'Appointments', href: '/appointments/', current: router.pathname == '/appointments' },
    { name: 'My Account', href: '/myaccount/', current: router.pathname == '/myaccount' },
  ]
  const userNavigation = [
    { name: 'My Account', href: '/myaccount/' }
  ]

  useEffect(async () => {
    var token = localStorage.getItem('TOKEN');
    if (token) { 
      userContext.setToken(token);
      var response = await Login.withToken('patient', token);
      if (response?.patient) {
        userContext.setPatient(response.patient || null);
      } else {
        var response = await Login.withToken('doctor', token);
        if (response?.doctor) {
          userContext.setDoctor(response.doctor || null);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <img
                      className="block lg:hidden h-10 w-auto"
                      src="/images/docme-logo-icon-and-text.png"
                      alt="DOCme"
                    />
                    <img
                      className="hidden lg:block h-10 w-auto"
                      src="/images/docme-logo-icon-and-text.png"
                      alt="DOCme"
                    />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'navigation-button-selected text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="hidden bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  { (userContext.doctor || userContext.patient) &&
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={(userContext.doctor && userContext.doctor.imageUrl) || (userContext.patient && userContext.patient.imageUrl)} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  }

                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'navigation-button-selected text-indigo-900'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              { (userContext.doctor || userContext.patient) &&
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={(userContext.doctor && userContext.doctor.imageUrl) || (userContext.patient && userContext.patient.imageUrl)} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{(userContext.doctor && userContext.doctor.firstName + ' ' + userContext.doctor.lastName) || (userContext.patient && userContext.patient.firstName + ' ' + userContext.patient.lastName)}</div>
                      <div className="text-sm font-medium text-gray-500">{(userContext.doctor && userContext.doctor.emailAddress) || (userContext.patient && userContext.patient.emailAddress)}</div>
                    </div>
                    <button
                      type="button"
                      className="hidden ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              }
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div>
        <main>
          <div className="min-h-screen max-w-7xl mx-auto sm:px-6 lg:px-8 pb-4">
            {children}
          </div>
        </main>
      </div>
      <style jsx>{`
        .navigation-button-selected {
          border-bottom: 4px solid ${Colors.LIGHT_BLUE};
        }
      `}</style>
    </div>
  )
}