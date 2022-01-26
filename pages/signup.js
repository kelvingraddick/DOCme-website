import React, { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon } from '@heroicons/react/solid';
import S3 from 'aws-s3';
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import Colors from '../constants/colors';
import UserTypes from '../constants/userTypes';
import Genders from '../constants/genders';
import Races from '../constants/races';
import { loadStripe } from "@stripe/stripe-js";

export default function SignUp() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);
  const imageInput = useRef(null);
  var stripe = null;

  const [isUserTypeSelectModalVisible, setIsUserTypeSelectModalVisible] = useState(false);
  const [selectedUserTypeOption, setSelectedUserTypeOption] = useState({});
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [emailAddress, setEmailAddress] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isGenderSelectModalVisible, setIsGenderSelectModalVisible] = useState(false);
  const [selectedGenderOption, setSelectedGenderOption] = useState({});
  const [isRaceSelectModalVisible, setIsRaceSelectModalVisible] = useState(false);
  const [selectedRaceOption, setSelectedRaceOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(async () => {
    stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  });
  
  const onUserTypeOptionSelected = function(option) {
    setSelectedUserTypeOption(option);
    setIsUserTypeSelectModalVisible(false);
  }

  const onGenderOptionSelected = function(option) {
    setSelectedGenderOption(option);
    setIsGenderSelectModalVisible(false);
  }

  const onRaceOptionSelected = function(option) {
    setSelectedRaceOption(option);
    setIsRaceSelectModalVisible(false);
  }

  const onChooseImage = async function() {
    setIsLoading(true);
    const file = imageInput.current.files[0];
    const config = {
      bucketName: 'wavelink-docme',
      dirName: 'images/user',
      region: 'us-east-1',
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_SECRET,
      s3Url: 'https://wavelink-docme.s3.amazonaws.com'
    };
    const fileName = 'user.' + Date.now() + '.' + Math.round(Math.random() * 1E9);
    const S3Client = new S3(config);
    S3Client
      .uploadFile(file, fileName)
      .then(data => {
        setImageUrl(data.location);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to upload image to S3');
        console.error(error);
        setIsLoading(false);
      });
  }

  const onSignUpButtonClicked = async function() {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await signUp();
    if (response) {
      if (response.isSuccess) {
        userContext.setToken(response.token);
        userContext.setPatient(response.patient || null);
        userContext.setDoctor(response.doctor || null);
        localStorage.setItem('TOKEN', response.token);
        setIsLoading(false);
        if (response.doctor) {
          stripe.redirectToCheckout({
            items: [{ plan: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID, quantity: 1 }],
            successUrl: window.location.protocol + '//' + window.location.host + '/myaccount/',
            cancelUrl: window.location.protocol + '//' + window.location.host + '/myaccount/',
            clientReferenceId: String(response.doctor.id),
            customerEmail: response.doctor.emailAddress
          })
          .then(function (result) {
            if (result.error) {
              
            }
          });
        } else {
          router.push('/myaccount/');
        }
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error signing in; please update credentials and try again');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;
    var emailAddressRegex = /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!selectedUserTypeOption.id) {
      errorMessage = 'User type (patient or doctor) must be selected.';
    } else if (!firstName || firstName.length <= 2 || firstName.length >= 30) {
      errorMessage = 'First name must be between 2 and 30 characters.';
    } else if (!lastName || lastName.length <= 2 || lastName.length >= 30) {
      errorMessage = 'Last name must be between 2 and 30 characters.';
    } else if (!emailAddressRegex.test(emailAddress)) {
      errorMessage = 'Valid email address is required.';
    } else if (!password || password.length <= 7) {
      errorMessage = 'Password must be greater than 7 characters.';
    } else if (password != passwordConfirm) {
      errorMessage = 'Password confirmation must match.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const signUp = async function () {
    var body = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: password,
      gender: selectedGenderOption.id,
      race: selectedRaceOption.id,
      imageUrl: imageUrl
    };
    return fetch('http://www.docmeapp.com/' + selectedUserTypeOption.id + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
            Welcome to DOCme!
          </div>
          <div className="text-md text-darkBlue">
            Sign up to manage your account and appointments.
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
              />
            </div>
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
                onChange={(input) => setEmailAddress(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Password"
                onChange={(input) => setPassword(input.target.value)}
              />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                Confirm password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Confirm password"
                onChange={(input) => setPasswordConfirm(input.target.value)}
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
            <div>
              <form>
                <input 
                  ref={imageInput}
                  type="file" 
                  name="image"
                  id="image"
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                  readOnly
                  onChange={onChooseImage}/>
                <label className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-mediumBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md cursor-pointer" htmlFor="image">Choose an account image</label>
              </form>
            </div>
            {imageUrl && (
              <div className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md">
                <img className="h-20 w-20 rounded-full" src={imageUrl} alt="" />
              </div>
            )}
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSignUpButtonClicked}
              disabled={isLoading}
            >
              Sign up
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
