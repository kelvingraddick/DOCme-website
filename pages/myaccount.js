import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoginIcon, LogoutIcon, PencilAltIcon, InformationCircleIcon, EyeOffIcon, BadgeCheckIcon, ShareIcon, OfficeBuildingIcon, CalendarIcon, LockClosedIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import 'react-datepicker/dist/react-datepicker.css';

export default function MyAccount(props) {

  const router = useRouter();

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
    'Log out': { icon: <LogoutIcon className="h-6 w-6 text-darkBlue" aria-hidden="true" />, visible: 'signed-in', action: () => { this.signOut(); } }
  };

  const signOut = async function () {

  }

  return (
    <Layout>
      <div className="px-4 pt-4 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {Object.keys(options).map((option) => (
              options[option].visible == 'always' || 
              (options[option].visible == 'signed-in' && (props.patient != null || props.doctor != null)) ||
              (options[option].visible == 'signed-in-doctor' && props.patient == null && props.doctor != null) ||
              (options[option].visible == 'logged-out' && (props.patient == null && props.doctor == null)) ? 
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
