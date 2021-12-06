import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon, CheckIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import ConfirmationModal from '../components/confirmationModal';
import Colors from '../constants/colors';
import Cities from '../constants/cities';
import Countries from '../constants/countries';
import States from '../constants/states';

export default function EditPractice() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [website, setWebsite] = useState(null);
  const [emailAddress, setEmailAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [faxNumber, setFaxNumber] = useState(null);
  const [addressLine1, setAddressLine1] = useState(null);
  const [addressLine2, setAddressLine2] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [image, setImage] = useState(null);
  const [isCitySelectModalVisible, setIsCitySelectModalVisible] = useState(false);
  const [selectedCityOption, setSelectedCityOption] = useState({});
  const [isStateSelectModalVisible, setIsStateSelectModalVisible] = useState(false);
  const [selectedStateOption, setSelectedStateOption] = useState({});
  const [isCountryCodeSelectModalVisible, setIsCountryCodeSelectModalVisible] = useState(false);
  const [selectedCountryCodeOption, setSelectedCountryCodeOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  useEffect(() => {
    setName(userContext.doctor?.practice?.name);
    setDescription(userContext.doctor?.practice?.description);
    setWebsite(userContext.doctor?.practice?.website);
    setEmailAddress(userContext.doctor?.practice?.emailAddress);
    setPhoneNumber(userContext.doctor?.practice?.phoneNumber);
    setFaxNumber(userContext.doctor?.practice?.faxNumber);
    setAddressLine1(userContext.doctor?.practice?.addressLine1);
    setAddressLine2(userContext.doctor?.practice?.addressLine2);
    setPostalCode(userContext.doctor?.practice?.postalCode);
    setImage(null);
    setSelectedCityOption(Cities.find(x => x.id == userContext.doctor?.practice?.city));
    setSelectedStateOption(States.find(x => x.id == userContext.doctor?.practice?.state));
    setSelectedCountryCodeOption(Countries.find(x => x.id == userContext.doctor?.practice?.countryCode));
  }, [userContext]);

  const onCityOptionSelected = function(option) {
    setSelectedCityOption(option);
    setIsCitySelectModalVisible(false);
  }

  const onStateOptionSelected = function(option) {
    setSelectedStateOption(option);
    setIsStateSelectModalVisible(false);
  }

  const onCountryCodeOptionSelected = function(option) {
    setSelectedCountryCodeOption(option);
    setIsCountryCodeSelectModalVisible(false);
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
    if (!userContext.doctor) {
      errorMessage = 'You must be logged in as a doctor to edit practice. Please log in and try again.';
    } else if (!name || name.length <= 2 || name.length >= 30) {
      errorMessage = 'Name must be between 2 and 30 characters.';
    } else if (!description || description.length <= 2 || description.length >= 1000) {
      errorMessage = 'Description must be between 2 and 1000 characters.';
    } else if (!emailAddressRegex.test(emailAddress)) {
      errorMessage = 'Valid email address is required.';
    } else if (isNaN(phoneNumber)) {
      errorMessage = 'A fully numberic phone number is required.';
    } else if (!addressLine1 || addressLine1.length <= 2 || addressLine1.length >= 50) {
      errorMessage = 'Address line 1 must be between 2 and 50 characters.';
    } else if (!selectedCityOption.id) {
      errorMessage = 'City is required.';
    } else if (!selectedStateOption.id) {
      errorMessage = 'State is required.';
    } else if (isNaN(postalCode)) {
      errorMessage = 'A fully numberic postal code is required.';
    } else if (!selectedCountryCodeOption.id) {
      errorMessage = 'Country is required.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const save = async function () {
    var body = {
      name: name,
      description: description,
      website: website,
      emailAddress: emailAddress,
      phoneNumber: phoneNumber,
      faxNumber: faxNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: selectedCityOption.id,
      state: selectedStateOption.id,
      postalCode: postalCode,
      countryCode: selectedCountryCodeOption.id,
      imageUrl: image && image.url
    };
    return fetch('http://www.docmeapp.com/doctor/' + userContext.doctor.id + '/update/practice', {
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
            Edit and save your practice details below.
          </div>
          <div className="py-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Name"
                value={name}
                onChange={(input) => setName(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Description"
                value={description}
                onChange={(input) => setDescription(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="website" className="sr-only">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Website"
                value={website}
                onChange={(input) => setWebsite(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="emailAddress"
                id="emailAddress"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Email address"
                value={emailAddress}
                onChange={(input) => setEmailAddress(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(input) => setPhoneNumber(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="faxNumber" className="sr-only">
                Fax number
              </label>
              <input
                type="tel"
                name="faxNumber"
                id="faxNumber"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Fax number"
                value={faxNumber}
                onChange={(input) => setFaxNumber(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="addressLine1" className="sr-only">
                Address line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                id="addressLine1"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Address line 1"
                value={addressLine1}
                onChange={(input) => setAddressLine1(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="addressLine2" className="sr-only">
                Address line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                id="addressLine2"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Address line 2"
                value={addressLine2}
                onChange={(input) => setAddressLine2(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="city" className="sr-only">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="City"
                readOnly
                value={selectedCityOption.name}
                onClick={() => setIsCitySelectModalVisible(true)}
              />
            </div>
            <div>
              <label htmlFor="state" className="sr-only">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="State"
                readOnly
                value={selectedStateOption.name}
                onClick={() => setIsStateSelectModalVisible(true)}
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="sr-only">
                Postal code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Postal code"
                value={postalCode}
                onChange={(input) => setPostalCode(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="countryCode" className="sr-only">
                Country
              </label>
              <input
                type="text"
                name="countryCode"
                id="countryCode"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Country"
                readOnly
                value={selectedCountryCodeOption.name}
                onClick={() => setIsCountryCodeSelectModalVisible(true)}
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
          open={isCitySelectModalVisible}
          title={"Select city:"}
          options={Cities}
          onOptionSelected={onCityOptionSelected}
          onCancelButtonPress={() => setIsCitySelectModalVisible(false)}
          >
        </SearchModal>
        <SearchModal
          open={isStateSelectModalVisible}
          title={"Select state:"}
          options={States}
          onOptionSelected={onStateOptionSelected}
          onCancelButtonPress={() => setIsStateSelectModalVisible(false)}
          >
        </SearchModal>
        <SearchModal
          open={isCountryCodeSelectModalVisible}
          title={"Select country:"}
          options={Countries}
          onOptionSelected={onCountryCodeOptionSelected}
          onCancelButtonPress={() => setIsCountryCodeSelectModalVisible(false)}
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
            router.push('/myaccount');
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
