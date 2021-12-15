import React, { useEffect, useContext } from 'react';
import { SearchIcon, LoginIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import Layout from '../components/layout';
import Colors from '../constants/colors';

export default function Appointments() {

  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(async () => {
    await getAppointments();
  }, [userContext]);

  const getAppointments = async function () {
    if ((!userContext.patient && !userContext.doctor) || !userContext.token) return;

    var url = 'http://www.docmeapp.com/appointment/' + (userContext.patient ? ('patient/' + userContext.patient.id) : ('doctor/' + userContext.doctor.id)) + '/list';
    var appointments = await fetch(url, { 
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + userContext.token }
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.appointments;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

    userContext.setAppointments(appointments);
  };

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0 min-h-screen">
        <div className="bg-local bg-top bg-cover rounded-lg mb-1 h-96" style={{ backgroundImage: "url('/images/background-2.jpg')" }}></div>
        <div className="form rounded-lg py-6 h-auto">
          <div className="pt-1">
            { ((!userContext.patient && !userContext.doctor) || userContext.appointments.length == 0) &&
              <>
                <div className="text text-center text-md text-grey font-medium">
                  Search for a doctor to set an appointment
                </div>
                <button
                  type="submit"
                  className="form-button group relative w-full flex justify-center mt-4 py-4 px-4 border border-transparent text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Search
                  <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
                  </span>
                </button>
                { (!userContext.patient && !userContext.doctor) &&
                  <>
                    <div className="text text-center text-md text-grey font-medium mt-8">
                      ..or sign in/up to see your appointments
                    </div>
                    <button
                      type="submit"
                      className="form-button group relative w-full flex justify-center mt-4 py-4 px-4 border border-transparent text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign In or Sign Up
                      <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                        <LoginIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
                      </span>
                    </button>
                  </>
                }
              </>
            }
          </div>
        </div>
        <style jsx>{`
          .text {
            color: ${Colors.DARK_GRAY}; 
          }
          .form-select {
            background-color: ${Colors.HIGH_LIGHT};
            border: none;
            color: ${Colors.DARK_BLUE};
          }
          .form-button {
            background-color: ${Colors.DARK_BLUE};
          }
        `}</style>
      </div>
    </Layout>
  )
}
