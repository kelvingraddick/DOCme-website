import React, { useEffect, useContext } from 'react';
import { SearchIcon, LoginIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Link from "next/link";
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import Moment from 'moment';
import Layout from '../components/layout';
import Colors from '../constants/colors';

export async function getStaticProps(context) {
  return {
    props: {}
  }
}

export default function Appointments(props) {

  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(async () => {
    await getAppointments();
  }, [userContext.patient, userContext.doctor, userContext.token]);

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
        { ((!userContext.patient && !userContext.doctor) || userContext.appointments.length == 0) &&
        <div className="form rounded-lg py-6 h-auto">
          <div className="pt-1">
            <div className="text text-center text-md text-grey font-medium">
              Search for a doctor to set an appointment
            </div>
            <button
              type="submit"
              className="form-button group relative w-full flex justify-center mt-4 py-4 px-4 border border-transparent text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => router.push('/')}
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
                  onClick={() => router.push('/myaccount/')}
                >
                  Sign In or Sign Up
                  <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                    <LoginIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
                  </span>
                </button>
              </>
            }
          </div>
        </div>
        }
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {userContext.appointments.map((appointment) => (
              <li key={appointment.id}>
                { userContext.patient &&
                  <Link
                    href={{
                      pathname: Moment(appointment.timestamp).isAfter(Moment()) ? "/editappointment" : "/rateappointment",
                      query: { appointmentId: appointment.id },
                    }}
                    className="block hover:bg-gray-50"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-20 w-20 rounded-full" src={appointment.doctor.imageUrl || '/images/placeholder-user.png'} alt="" />
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                            <p className="text-base font-medium text-darkBlue truncate">{appointment.doctor.firstName + ' ' + appointment.doctor.lastName}</p>
                            { appointment.doctor.practice &&
                              <p className="mt-1 text-sm font-light text-gray-600 truncate">{appointment.doctor.practice.addressLine1} {appointment.doctor.practice.addressLine2} {appointment.doctor.practice.city}, {appointment.doctor.practice.state} {appointment.doctor.practice.postalCode}</p>
                            }
                            <p className="mt-1 text-sm font-light text-darkBlue truncate">{Moment(appointment.timestamp).isBefore(Moment()) ? '(Past)' : '' } {Moment(appointment.timestamp).format('dddd, MMMM Do') + ', ' + Moment(appointment.timestamp).format('h:mma')}</p>
                            <p className="mt-1 text-sm font-light text-darkBlue truncate">{appointment.specialty.name}</p>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                }
                { userContext.doctor &&
                  <Link
                    href={{
                      pathname: "/editappointment",
                      query: { appointmentId: appointment.id },
                    }}
                    className="block hover:bg-gray-50"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-20 w-20 rounded-full" src={appointment.patient.imageUrl || '/images/placeholder-user.png'} alt="" />
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                            <p className="text-base font-medium text-darkBlue truncate">{appointment.patient.firstName + ' ' + appointment.patient.lastName}</p>
                            <p className="mt-1 text-sm font-light text-darkBlue truncate">{Moment(appointment.timestamp).isBefore(Moment()) ? '(Past)' : '' } {Moment(appointment.timestamp).format('dddd, MMMM Do') + ', ' + Moment(appointment.timestamp).format('h:mma')}</p>
                            <p className="mt-1 text-sm font-light text-darkBlue truncate">Specialty: {appointment.specialty.name}</p>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                }
              </li>
            ))}
          </ul>
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
