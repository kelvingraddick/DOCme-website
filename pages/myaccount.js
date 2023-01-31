import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { LoginIcon, LogoutIcon, PencilAltIcon, InformationCircleIcon, EyeOffIcon, BadgeCheckIcon, ShareIcon, OfficeBuildingIcon, CalendarIcon, LockClosedIcon, ExclamationIcon, CheckIcon, CheckCircleIcon, BookmarkIcon, CreditCardIcon } from '@heroicons/react/solid';
import ConfirmationModal from '../components/confirmationModal';
import Layout from '../components/layout';
import 'react-datepicker/dist/react-datepicker.css';
import { loadStripe } from "@stripe/stripe-js";

export async function getStaticProps(context) {
  return {
    props: {}
  }
}

export default function MyAccount(props) {

  const router = useRouter();
  const userContext = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const [isCancelSubscriptionConfirmationModalVisible, setIsCancelSubscriptionConfirmationModalVisible] = useState(false);
  const [isCancelSubscriptionSuccessModalVisible, setIsCancelSubscriptionSuccessModalVisible] = useState(false);
  const [cancelSubscriptionErrorMessage, setCancelSubscriptionErrorMessage] = useState(null);

  const [isSpecialtySearchModalVisible, setIsSpecialtySearchModalVisible] = useState(false);
  const [isSpecialtyConfirmationModalVisible, setIsSpecialtyConfirmationModalVisible] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [selectedSpecialtyOptionIds, setSelectedSpecialtyOptionIds] = useState([]);
  const [saveSpecialtiesErrorMessage, setSaveSpecialtiesErrorMessage] = useState(null);
  const [saveSpecialtiesIsLoading, setSaveSpecialtiesIsLoading] = useState(false);

  const options = {
    'Sign in': { icon: <LoginIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signin'); } },
    'Sign up': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signup'); } },
    'Edit Account': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/editaccount'); } },
    'Change Password': { icon: <LockClosedIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/changepassword'); } },
    'Edit Practice': { icon: <OfficeBuildingIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editpractice'); } },
    'Edit Schedule': { icon: <CalendarIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editschedule'); } },
    'Edit Specialties': { icon: <BookmarkIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { setIsSpecialtySearchModalVisible(true); } },
    'Terms of use': { icon: <InformationCircleIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { router.push('/termsofuse'); } },
    'Privacy Policy': { icon: <EyeOffIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { router.push('/privacypolicy'); } },
    'Give site feedback': { icon: <BadgeCheckIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { window.open('mailto:faguebor@gmail.com?subject=DOCme%20-%20Give%20site%20feedback%21&body=Please%20share%20your%20feedback%20-%20be%20sure%20to%20include%20your%20account%20info%2C%20screenshots%2C%20and%2For%20any%20other%20information%20that%20could%20be%20useful.'); } },
    'Share this site': { icon: <ShareIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
    'Log out': { icon: <LogoutIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { signOut(); } }
  };

  useEffect(async () => {
    if (userContext.doctor) {
      setSelectedSpecialtyOptionIds(userContext.doctor.specialties.map(specialty => { return specialty.id; }));
      await getSpecialtyOptions();
    }
  }, [userContext]);

  const signOut = async function () {
    userContext.setToken(null);
    userContext.setPatient(null);
    userContext.setDoctor(null);
    localStorage.removeItem('TOKEN');
    /*
    OneSignal.removeExternalUserId((results) => {
      console.log('OneSignal: Results of removing external user id: ' + JSON.stringify(results));
      if (results.push && results.push.success) {
        console.log('OneSignal: Results of removing external user id push status: ' + results.push.success);
      }
    });
    */
  }

  const setupSubscription = async function() {
    setIsLoading(true);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    await stripe.redirectToCheckout({
      items: [{ plan: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID, quantity: 1 }],
      successUrl: window.location.href,
      cancelUrl: window.location.href,
      clientReferenceId: String(userContext.doctor.id),
      customerEmail: userContext.doctor.emailAddress
    })
    .then(function (result) {
      if (result.error) {

      }
      setIsLoading(false);
    })
    .catch(function (error) {
      console.error(error);
      setIsLoading(false);
    });
  }

  const cancelSubscription = function () {
    return fetch('https://www.docmeapp.com/doctor/' + userContext.doctor.id + '/cancel/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userContext.token
      }
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

  const getSpecialtyOptions = async function(text) {
    var url = 'https://www.docmeapp.com/specialty/' + ((text && text.length > 0) ? ('search/' + encodeURIComponent(text)) : 'list/');
    var specialties = await fetch(url, { method: 'GET' })
      .then((response) => { 
        if (response.status == 200) {
          return response.json()
          .then((responseJson) => {
            if (responseJson.isSuccess) {
              return responseJson.specialties;
            }
          })
        }
        return [];
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
    setSpecialtyOptions(specialties);
  }

  const onToggleSpecialtyOption = async function(id) {
    var optionIds = JSON.parse(JSON.stringify(selectedSpecialtyOptionIds));
    if (optionIds.includes(id)) {
      optionIds = optionIds.filter(function(value, index, arr){ 
        return value !== id;
      });
    } else {
      optionIds.push(id);
    }
    setSelectedSpecialtyOptionIds(optionIds);
  }

  const onSaveSpecialtiesButtonClicked = async function() {
    setSaveSpecialtiesIsLoading(true);
    var response = await saveSpecialties();
    if (response && response.isSuccess) {
      userContext.setDoctor(response.doctor || null);
      setSaveSpecialtiesErrorMessage(null);
      setIsSpecialtySearchModalVisible(false);
      setIsSpecialtyConfirmationModalVisible(true);
    } else {
      setSaveSpecialtiesErrorMessage((response && response.errorMessage) || 'There was an error saving changes; please update entries and try again');
    }
    setSaveSpecialtiesIsLoading(false);
  }

  const saveSpecialties = async function () {
    var body = {
      specialtyIds: selectedSpecialtyOptionIds
    };
    return fetch('https://www.docmeapp.com/doctor/' + userContext.doctor.id + '/update/specialties', {
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
      { userContext.patient &&
        <div className="bg-white shadow sm:rounded-lg mt-4">
          <div className="grid justify-items-center px-4 py-5 sm:p-6">
            <p className="text-lg font-medium text-darkBlue truncate">{userContext.patient.firstName} {userContext.patient.lastName}</p>
            <p className="text-sm font-light text-darkBlue truncate">{userContext.patient.emailAddress}</p>
            {userContext.patient.imageUrl && (
              <img className="mt-5 h-20 w-20 rounded-full" src={userContext.patient.imageUrl || '/images/placeholder-user.png'} alt="" />
            )}
          </div>
        </div>
      }
      { userContext.doctor &&
        <div className="bg-white shadow sm:rounded-lg mt-4">
          <div className="grid justify-items-center px-4 py-5 sm:p-6">
            <p className="text-lg font-medium text-darkBlue truncate">{userContext.doctor.firstName} {userContext.doctor.lastName}</p>
            <p className="text-sm font-light text-darkBlue truncate">{userContext.doctor.emailAddress}</p>
            {userContext.doctor.imageUrl && (
              <img className="mt-5 h-20 w-20 rounded-full" src={userContext.doctor.imageUrl || '/images/placeholder-user.png'} alt="" />
            )}
          </div>
        </div>
      }
      { !isLoading && (userContext.doctor != null && !['trialing', 'active'].includes(userContext.doctor.stripeSubscriptionStatus || '')) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={() => setupSubscription()}>
          <CreditCardIcon className="h-6 w-6" aria-hidden="true" />&nbsp;Doctor&nbsp;<b>subscription</b>&nbsp;inactive. Tap to&nbsp;<u><i>add payment</i></u>!
        </div>
      }
      { !isLoading && (userContext.doctor != null && ['trialing', 'active'].includes(userContext.doctor.stripeSubscriptionStatus || '')) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-green flex flex-row text-sm font-light text-white" onClick={() => setIsCancelSubscriptionConfirmationModalVisible(true)}>
          Doctor subscription is&nbsp;<span className="font-bold">{userContext.doctor.stripeSubscriptionStatus}</span>&nbsp;<CheckCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />&nbsp;-&nbsp;
          <span style={{ textDecorationLine: "underline", fontStyle: "italic" }}>Cancel?</span>
        </div>
      }
      { !isLoading && (userContext.doctor != null && !userContext.doctor.practice) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={options['Edit Practice'].action}>
          <OfficeBuildingIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;No&nbsp;<b>location</b>&nbsp;entered! Tap to&nbsp;<u><i>edit practice</i></u>
        </div>
      }
      { !isLoading && (userContext.doctor != null && !userContext.doctor.schedule) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={options['Edit Schedule'].action}>
          <CalendarIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;No&nbsp;<b>availability</b>&nbsp;set! Tap to&nbsp;<u><i>set schedule</i></u>
        </div>
      }
      { !isLoading && (userContext.doctor != null && (!userContext.doctor.specialties || userContext.doctor.specialties.length === 0)) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={options['Edit Specialties'].action}>
          <BookmarkIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;No&nbsp;<b>specialties</b>&nbsp;set! Tap to&nbsp;<u><i>set specialties</i></u>
        </div>
      }
      { isLoading &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-green flex flex-row text-sm font-light font-italic text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      }
      <div className="px-4 pt-4 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {Object.keys(options).map((option) => (
              options[option].visible == 'always' || 
              (options[option].visible == 'signed-in' && (userContext.patient != null || userContext.doctor != null)) ||
              (options[option].visible == 'signed-in-doctor' && userContext.patient == null && userContext.doctor != null) ||
              (options[option].visible == 'logged-out' && (userContext.patient == null && userContext.doctor == null)) ? 
                (
                  <li key={option}>
                    <div onClick={options[option].action} className="flex flex-row block text-darkGray text-md font-medium hover:bg-gray-50 p-5">
                      {options[option].icon}&nbsp;&nbsp;&nbsp;&nbsp;{option}
                    </div>
                  </li>
                ) :
                null
            ))}
          </ul>
        </div>
        <ConfirmationModal
          open={isCancelSubscriptionConfirmationModalVisible}
          title={'Cancel doctor subscription?'}
          description={'Your account won\'t show up for potential patients in this app anymore. Are you sure?'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'No'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsCancelSubscriptionConfirmationModalVisible(false);
          }}
          confirmButtonText={'Yes'}
          confirmButtonColor={'red'}
          onConfirmButtonPress={async () => {
            setIsCancelSubscriptionConfirmationModalVisible(false);
            setIsLoading(true);
            var response = await cancelSubscription();
            if (response && response.isSuccess) {
              userContext.setDoctor(response.doctor || null);
              setIsCancelSubscriptionSuccessModalVisible(true);
              setCancelSubscriptionErrorMessage(null);
            } else {
              setCancelSubscriptionErrorMessage((response && response.errorMessage) || 'There was an error cancelling. Please try again.');
            }
            setIsLoading(false);
          }}
          >
        </ConfirmationModal>
        <ConfirmationModal
          open={isCancelSubscriptionSuccessModalVisible}
          title={'Subscription cancelled.'}
          description={'You can activate a new subscription at any time on the My Account tab.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Done'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsCancelSubscriptionSuccessModalVisible(false);
          }}
          >
        </ConfirmationModal>
        <ConfirmationModal
          open={isSpecialtyConfirmationModalVisible}
          title={'Specialties saved successfully!'}
          description={'Your account is now searchable by these specialties.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Done'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsSpecialtyConfirmationModalVisible(false);
          }}
          >
        </ConfirmationModal>
        <Transition.Root show={isSpecialtySearchModalVisible} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={() => setIsSpecialtySearchModalVisible(false)}>
            <div className="absolute inset-0 overflow-hidden">
              <Dialog.Overlay className="absolute inset-0" />

              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">Find and select all your <b>specialties</b> below:</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setIsSpecialtySearchModalVisible(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="px-1 py-2 border-b border-gray-200">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="block w-full border-0 border-transparent focus:ring-0 sm:text-sm"
                          placeholder="Type here to filter specialties.."
                          onChange={(input) => getSpecialtyOptions(input.target.value)}
                        />
                      </div>
                      <ul role="list" className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                        {specialtyOptions.map((option) => (
                          <li key={option.id} onClick={() => onToggleSpecialtyOption(option.id)} className="border-b border-gray-200">
                            <div className="relative group py-4 px-4 flex items-center">
                              <div className="flex flex-1 justify-between">
                                <div className="flex-shrink-0 sm:text-sm">{option.name}</div>
                                { selectedSpecialtyOptionIds.includes(option.id) &&
                                  <CheckCircleIcon className="h-5 w-5 text-green" aria-hidden="true" />
                                }
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="p-4 border-t border-gray-200">
                        <button
                          type="submit"
                          className="group relative w-full flex justify-center py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={onSaveSpecialtiesButtonClicked}
                          disabled={saveSpecialtiesIsLoading}
                        >
                          Save Changes
                        </button>
                        { saveSpecialtiesErrorMessage &&
                          <div className="mt-2 flex flex-row text-sm text-white">
                            <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{saveSpecialtiesErrorMessage}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <style jsx>{`

        `}</style>
      </div>
    </Layout>
  )
}
