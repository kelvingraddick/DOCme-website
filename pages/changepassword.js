import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon, CheckIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import ConfirmationModal from '../components/confirmationModal';
import Colors from '../constants/colors';

export default function ChangePassword() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const onSaveButtonClicked = async function() {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await save();
    if (response) {
      if (response.isSuccess) {
        userContext.setPatient(response.patient || null);
        userContext.setDoctor(response.doctor || null);
        setIsLoading(false);
        setIsConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error changing the password; please update entries and try again');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;
    if (!userContext.patient && !userContext.doctor) {
      errorMessage = 'You must be logged in to change password. Please log in and try again.';
    } else if (!currentPassword || currentPassword.length <= 0) {
        errorMessage = 'Current password is required.';
    } else if (!newPassword || newPassword.length <= 7) {
      errorMessage = 'New password must be greater than 7 characters.';
    } else if (newPassword != newPasswordConfirm) {
      errorMessage = 'Password confirmation must match.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const save = async function () {
    var url = 'https://www.docmeapp.com' + (userContext.patient ? '/patient/' + userContext.patient.id : '/doctor/' + userContext.doctor.id) + '/update/password';
    var body = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userContext.token
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
          <div className="text-md text-darkBlue">
            Change your password below.
          </div>
          <div className="py-4">
            <div>
              <label htmlFor="currentPassword" className="sr-only">
                Current password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Current password"
                onChange={(input) => setCurrentPassword(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="New password"
                onChange={(input) => setNewPassword(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPasswordConfirm" className="sr-only">
                Confirm new password
              </label>
              <input
                type="password"
                name="newPasswordConfirm"
                id="newPasswordConfirm"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Confirm new password"
                onChange={(input) => setNewPasswordConfirm(input.target.value)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSaveButtonClicked}
              disabled={isLoading}
            >
              Save
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <ConfirmationModal
          open={isConfirmationModalVisible}
          title={'Success!'}
          description={'The password was saved succesfully.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Close'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsConfirmationModalVisible(false);
            router.push('/myaccount/');
          }}
          //confirmButtonText={'Confirm'}
          //confirmButtonColor={'red'}
          //onConfirmlButtonPress={() => setIsConfirmationModalVisible(false)}
          >
        </ConfirmationModal>
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
