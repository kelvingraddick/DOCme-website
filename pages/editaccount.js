import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon, CheckIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import ConfirmationModal from '../components/confirmationModal';
import Colors from '../constants/colors';
import Genders from '../constants/genders';
import Races from '../constants/races';

export default function EditAccount() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [emailAddress, setEmailAddress] = useState(null);
  const [image, setImage] = useState(null);
  const [isGenderSelectModalVisible, setIsGenderSelectModalVisible] = useState(false);
  const [selectedGenderOption, setSelectedGenderOption] = useState({});
  const [isRaceSelectModalVisible, setIsRaceSelectModalVisible] = useState(false);
  const [selectedRaceOption, setSelectedRaceOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  useEffect(() => {
    setFirstName((userContext.patient || userContext.doctor || {}).firstName);
    setLastName((userContext.patient || userContext.doctor || {}).lastName);
    setEmailAddress((userContext.patient || userContext.doctor || {}).emailAddress);
    setImage(null);
    setSelectedGenderOption(Genders.find(x => x.id == (userContext.patient || userContext.doctor || {}).gender));
    setSelectedRaceOption(Races.find(x => x.id == (userContext.patient || userContext.doctor || {}).race));
  }, [userContext]);

  const onGenderOptionSelected = function(option) {
    setSelectedGenderOption(option);
    setIsGenderSelectModalVisible(false);
  }

  const onRaceOptionSelected = function(option) {
    setSelectedRaceOption(option);
    setIsRaceSelectModalVisible(false);
  }

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
      setErrorMessage('There was an error saving changes; please update entries and try again');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;
    var emailAddressRegex = /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!userContext.patient && !userContext.doctor) {
      errorMessage = 'You must be logged in to edit account. Please log in and try again.';
    } else if (!firstName || firstName.length <= 2 || firstName.length >= 30) {
      errorMessage = 'First name must be between 2 and 30 characters.';
    } else if (!lastName || lastName.length <= 2 || lastName.length >= 30) {
      errorMessage = 'Last name must be between 2 and 30 characters.';
    } else if (!emailAddressRegex.test(emailAddress)) {
      errorMessage = 'Valid email address is required.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const save = async function () {
    var url = 'http://www.docmeapp.com' + (userContext.patient ? '/patient/' + userContext.patient.id : '/doctor/' + userContext.doctor.id) + '/update';
    var body = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      gender: selectedGenderOption.id,
      race: selectedRaceOption.id,
      imageUrl: image && image.url
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
            Edit and save your account details below.
          </div>
          <div className="py-4">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="First name"
                value={firstName}
                onChange={(input) => setFirstName(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Last name"
                value={lastName}
                onChange={(input) => setLastName(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="sr-only">
                Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                id="emailAddress"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(input) => setEmailAddress(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="gender" className="sr-only">
                Gender
              </label>
              <input
                type="text"
                name="gender"
                id="gender"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Gender"
                readOnly
                value={selectedGenderOption.name}
                onClick={() => setIsGenderSelectModalVisible(true)}
              />
            </div>
            <div>
              <label htmlFor="race" className="sr-only">
                Race
              </label>
              <input
                type="text"
                name="race"
                id="race"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Race"
                readOnly
                value={selectedRaceOption.name}
                onClick={() => setIsRaceSelectModalVisible(true)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSaveButtonClicked}
              disabled={isLoading}
            >
              Save Changes
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <SearchModal
          open={isGenderSelectModalVisible}
          title={"Select gender:"}
          options={Genders}
          onOptionSelected={onGenderOptionSelected}
          onCancelButtonPress={() => setIsGenderSelectModalVisible(false)}
          >
        </SearchModal>
        <SearchModal
          open={isRaceSelectModalVisible}
          title={"Select race:"}
          options={Races}
          onOptionSelected={onRaceOptionSelected}
          onCancelButtonPress={() => setIsRaceSelectModalVisible(false)}
          >
        </SearchModal>
        <ConfirmationModal
          open={isConfirmationModalVisible}
          title={'Success!'}
          description={'The changes were saved succesfully.'}
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
