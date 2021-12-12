import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { LoginIcon, LogoutIcon, PencilAltIcon, InformationCircleIcon, EyeOffIcon, BadgeCheckIcon, ShareIcon, OfficeBuildingIcon, CalendarIcon, LockClosedIcon, ExclamationIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import 'react-datepicker/dist/react-datepicker.css';
import { loadStripe } from "@stripe/stripe-js";

export default function MyAccount(props) {

  const router = useRouter();
  const userContext = useContext(UserContext);
  var stripe = null;

  const [errorMessage, setErrorMessage] = useState(null);
  const [errorAction, setErrorAction] = useState(null);

  const options = {
    'Sign in': { icon: <LoginIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signin'); } },
    'Sign up': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'logged-out', action: () => { router.push('/signup'); } },
    'Edit Account': { icon: <PencilAltIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/editaccount'); } },
    'Change Password': { icon: <LockClosedIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { router.push('/changepassword'); } },
    'Edit Practice': { icon: <OfficeBuildingIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editpractice'); } },
    'Edit Schedule': { icon: <CalendarIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in-doctor', action: () => { router.push('/editschedule'); } },
    'Terms of use': { icon: <InformationCircleIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
    'Privacy Policy': { icon: <EyeOffIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
    'Give app feedback': { icon: <BadgeCheckIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
    'Share this app': { icon: <ShareIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'always', action: () => {  } },
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
      { errorMessage &&
        <div className="mt-4 p-4 shadow sm:rounded-lg bg-red flex flex-row text-sm font-light text-white" onClick={errorAction}>
          <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
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
        <style jsx>{`

        `}</style>
      </div>
    </Layout>
  )
}
