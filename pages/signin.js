import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import Login from '../helpers/login';
import SearchModal from '../components/searchModal';
import Colors from '../constants/colors';
import UserTypes from '../constants/userTypes';

export default function SignIn() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [isUserTypeSelectModalVisible, setIsUserTypeSelectModalVisible] = useState(false);
  const [selectedUserTypeOption, setSelectedUserTypeOption] = useState({});
  const [emailAddress, setEmailAddress] = useState(null);
  const [password, setPassword] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const onUserTypeOptionSelected = function(option) {
    setSelectedUserTypeOption(option);
    setIsUserTypeSelectModalVisible(false);
  }

  const onSignInButtonClicked = async function() {
    setIsLoading(true);
    var response = await Login.withEmailAddressAndPassword(selectedUserTypeOption.id, emailAddress, password);
    if (response) {
      userContext.setToken(response.token);
      userContext.setPatient(response.patient || null);
      userContext.setDoctor(response.doctor || null);
      localStorage.setItem('TOKEN', response.token);
      setIsLoading(false);
      router.push('/myaccount');
    } else {
      setErrorMessage('There was an error signing in; please update credentials and try again');
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0">
        <div className="rounded-lg p-6 h-auto bg-lightBlue mt-4 mb-2">
          <div className="text-lg text-white">
            Welcome back to DOCme!
          </div>
          <div className="text-md text-darkBlue">
            Sign in to manage your account and appointments.
          </div>
          <div className="py-4">
            <div>
              <label htmlFor="userType" className="sr-only">
                Patient or doctor?
              </label>
              <input
                type="text"
                name="userType"
                id="userType"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Patient or doctor?"
                readOnly
                value={selectedUserTypeOption.name}
                onClick={() => setIsUserTypeSelectModalVisible(true)}
              />
            </div>
            <div>
              <label htmlFor="notes" className="sr-only">
                Notes
              </label>
              <input
                type="email"
                name="emailAddress"
                id="emailAddress"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Email Address"
                onChange={(input) => setEmailAddress(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="notes" className="sr-only">
                Notes
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Password"
                onChange={(input) => setPassword(input.target.value)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSignInButtonClicked}
              disabled={isLoading}
            >
              Sign in
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <SearchModal
          open={isUserTypeSelectModalVisible}
          title={"Select patient or doctor:"}
          options={UserTypes}
          onOptionSelected={onUserTypeOptionSelected}
          onCancelButtonPress={() => setIsUserTypeSelectModalVisible(false)}
          >
        </SearchModal>
        <style jsx>{`
          ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: ${Colors.DARK_BLUE};
            opacity: 0.5;
          }
          :-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: ${Colors.DARK_BLUE};
          } 
          ::-ms-input-placeholder { /* Microsoft Edge */
            color: ${Colors.DARK_BLUE};
          }
        `}</style>
      </div>
    </Layout>
  )
}
