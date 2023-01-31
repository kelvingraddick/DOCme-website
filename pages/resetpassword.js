import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ExclamationIcon } from '@heroicons/react/solid';
import { LoginIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import Colors from '../constants/colors';
import UserTypes from '../constants/userTypes';

export default function ResetPassword() {
  
  const router = useRouter();
  const { code } = router.query;

  const [isUserTypeSelectModalVisible, setIsUserTypeSelectModalVisible] = useState(false);
  const [selectedUserTypeOption, setSelectedUserTypeOption] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onUserTypeOptionSelected = function(option) {
    setSelectedUserTypeOption(option);
    setIsUserTypeSelectModalVisible(false);
  }

  const onResetButtonClicked = async function() {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await submit();
    if (response) {
      if (response.isSuccess) {
        setSuccessMessage('Your password was successfully reset!');
        setSelectedUserTypeOption({ name: '' });
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage(null);
      } else {
        setErrorMessage(response.errorMessage);
      }
    } else {
      setErrorMessage('There was an error submitting the password reset; please try again');
    }
    setIsLoading(false);
  }

  const validate = async function () {
    var errorMessage = null;
    if (!selectedUserTypeOption.id) {
      errorMessage = 'User type (patient or doctor) must be selected.';
    } else if (!newPassword || newPassword.length <= 7) {
      errorMessage = 'New password must be greater than 7 characters.';
    } else if (newPassword !== confirmPassword) {
      errorMessage = 'Password confirmation must match.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const submit = async function () {
    var url = 'https://www.docmeapp.com/' + selectedUserTypeOption.id + '/update/password/' + code;
    var body = {
      newPassword: newPassword
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          return responseJson;
        })
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
  }

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0">
        <div className="rounded-lg p-6 h-auto bg-lightBlue mt-4 mb-2">
          <div className="text-lg text-white">
            Reset Password
          </div>
          <div className="text-md text-darkBlue">
            Enter in your new password below:
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
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Patient or doctor?"
                readOnly
                value={selectedUserTypeOption.name}
                onClick={() => setIsUserTypeSelectModalVisible(true)}
                disabled={successMessage}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md disabled:opacity-50"
                placeholder="New password"
                value={newPassword}
                onChange={(input) => setNewPassword(input.target.value)}
                disabled={successMessage}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Confirm password
              </label>
              <input
                type="password"
                name="comfirmPassword"
                id="comfirmPassword"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md disabled:opacity-50"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(input) => setConfirmPassword(input.target.value)}
                disabled={successMessage}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={onResetButtonClicked}
              disabled={isLoading || successMessage}
            >
              Reset
            </button>
            { successMessage &&
              <>
                <div className="mt-2 flex flex-row text-sm text-white">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 text-green" aria-hidden="true" />&nbsp;&nbsp;{successMessage}
                </div>
                <div className="flex flex-row text-md text-darkBlue mt-2 cursor-pointer" onClick={() => router.push('/signin/')}>
                  <LoginIcon className="h-6 w-6 text-green-600" aria-hidden="true" />&nbsp;&nbsp;<span className="underline">Go to sign page</span>
                </div>
              </>
            }
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600 text-red" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
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
