import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { LoginIcon, LogoutIcon, PencilAltIcon, InformationCircleIcon, EyeOffIcon, BadgeCheckIcon, ShareIcon, OfficeBuildingIcon, CalendarIcon, LockClosedIcon, ExclamationIcon, CheckIcon, CheckCircleIcon } from '@heroicons/react/solid';
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
  var stripe = null;

  const [errorMessage, setErrorMessage] = useState(null);
  const [errorAction, setErrorAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const options = {
    'Sign in': { icon: <LoginIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signin'); } },
    'Sign up': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signup'); } },
    'Edit Account': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/editaccount'); } },
    'Change Password': { icon: <LockClosedIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/changepassword'); } },
    'Edit Practice': { icon: <OfficeBuildingIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editpractice'); } },
    'Edit Schedule': { icon: <CalendarIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editschedule'); } },
    'Terms of use': { icon: <InformationCircleIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { router.push('/termsofuse'); } },
    'Privacy Policy': { icon: <EyeOffIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { router.push('/privacypolicy'); } },
    'Give site feedback': { icon: <BadgeCheckIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => { window.open('mailto:faguebor@gmail.com?subject=DOCme%20-%20Give%20site%20feedback%21&body=Please%20share%20your%20feedback%20-%20be%20sure%20to%20include%20your%20account%20info%2C%20screenshots%2C%20and%2For%20any%20other%20information%20that%20could%20be%20useful.'); } },
    'Share this site': { icon: <ShareIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
    'Log out': { icon: <LogoutIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { signOut(); } }
  };

  useEffect(async () => {
    stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    checkForErrorMessage();
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

  const checkForErrorMessage = function () {
    if (userContext.doctor != null && !['trialing', 'active'].includes(userContext.doctor.stripeSubscriptionStatus || '')) {
      setErrorMessage('Doctor subscription inactive. Tap to add payment!');

      var errorAction = () => {
        stripe.redirectToCheckout({
          items: [{ plan: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID, quantity: 1 }],
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          clientReferenceId: String(userContext.doctor.id),
          customerEmail: userContext.doctor.emailAddress
        })
        .then(function (result) {
          if (result.error) {
            
          }
        });
      };

      setErrorAction(() => errorAction);
    } else {
      setErrorMessage(null);
      setErrorAction(null);
    }
  }

  const cancelSubscription = function () {
    return fetch('http://www.docmeapp.com/doctor/' + userContext.doctor.id + '/cancel/subscription', {
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
      { !isLoading && errorMessage &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={errorAction}>
          <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
        </div>
      }
      { !isLoading && (userContext.doctor != null && ['trialing', 'active'].includes(userContext.doctor.stripeSubscriptionStatus || '')) &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-green flex flex-row text-sm font-light text-white" onClick={() => setIsConfirmationModalVisible(true)}>
          Doctor subscription is&nbsp;<span className="font-bold">{userContext.doctor.stripeSubscriptionStatus}</span>&nbsp;<CheckCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />&nbsp;-&nbsp;
          <span style={{ textDecorationLine: "underline", fontStyle: "italic" }}>Cancel?</span>
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
          open={isConfirmationModalVisible}
          title={'Cancel doctor subscription?'}
          description={'Your account won\'t show up for potential patients in this app anymore. Are you sure?'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'No'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsConfirmationModalVisible(false);
          }}
          confirmButtonText={'Yes'}
          confirmButtonColor={'red'}
          onConfirmButtonPress={async () => {
            setIsConfirmationModalVisible(false);
            setIsLoading(true);
            var response = await cancelSubscription();
            if (response) {
              if (response.isSuccess) {
                userContext.setDoctor(response.doctor || null);
                setIsSuccessModalVisible(true);
              } else {
                setErrorMessage(response.errorMessage);
              }
              setIsLoading(false);
            } else {
              setErrorMessage('There was an error cancelling. Please try again.');
              setIsLoading(false);
            }
          }}
          >
        </ConfirmationModal>
        <ConfirmationModal
          open={isSuccessModalVisible}
          title={'Subscription cancelled.'}
          description={'You can activate a new subscription at any time on the My Account tab.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Done'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsSuccessModalVisible(false);
          }}
          >
        </ConfirmationModal>
        <style jsx>{`

        `}</style>
      </div>
    </Layout>
  )
}
