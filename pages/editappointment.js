import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import ConfirmationModal from '../components/confirmationModal';
import DoctorRow from '../components/doctorRow';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'moment';
import Colors from '../constants/colors';

export default function EditAppointment(props) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const appointmentId = router.query.appointmentId && Number(router.query.appointmentId);

  const [appointment, setAppointment] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isSpecialtySearchModalVisible, setIsSpecialtySearchModalVisible] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [selectedSpecialtyOption, setSelectedSpecialtyOption] = useState({});

  const [notes, setNotes] = useState(null);

  const [isUpdateConfirmationModalVisible, setIsUpdateConfirmationModalVisible] = useState(false);
  const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false);

  useEffect(async () => {
    if(!router.isReady) return;
    var appointment = await fetch('http://www.docmeapp.com/appointment/' + appointmentId, { 
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userContext.token
      }
    })
      .then((response) => { 
        if (response.status == 200) {
          return response.json()
          .then((responseJson) => {
            if (responseJson.isSuccess) {
              return responseJson.appointment;
            }
          })
        }
        return {};
      })
      .catch((error) => {
        console.error(error);
        setAppointment(null);
      });
      setAppointment(appointment);
      setSelectedSpecialtyOption(appointment.specialty);
      setNotes(appointment.notes);
  }, [router.isReady]);

  const onSpecialtySearchBoxChangeText = async function(text) {
    if (!text) return [];

    var specialties = await fetch('http://www.docmeapp.com/specialty/search/' + encodeURIComponent(text), { method: 'GET' })
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
  
  const onSpecialtyOptionSelected = function(option) {
    setSelectedSpecialtyOption(option);
    setIsSpecialtySearchModalVisible(false);
    setSpecialtyOptions([]);
  }

  const onUpdateButtonClicked = async function () {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await update();
    if (response) {
      if (response.isSuccess) {
        setIsLoading(false);
        setIsUpdateConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error updating the appointment; please update entries and try again.');
      setIsLoading(false);
    }
  }

  const onDeleteButtonClicked = async function () {
    setIsLoading(true);

    var response = await deleteAppointment();
    if (response) {
      if (response.isSuccess) {
        setIsLoading(false);
        setIsDeleteConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error deleting the appointment; please update entries and try again.');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;
    if (!selectedSpecialtyOption.id) {
      errorMessage = 'Must select a speciality.';
    } else if (!userContext.patient || !userContext.token) {
      errorMessage = 'Must sign in or sign up as a patient to book.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  }

  const update = async function () {
    var body = {
      specialtyId: selectedSpecialtyOption.id,
      timestamp: appointment.timestamp,
      isNewPatient: true,
      notes: notes
    };
    return await fetch('http://www.docmeapp.com/appointment/' + appointment.id + '/update/', {
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

  const deleteAppointment = async function () {
    return await fetch('http://www.docmeapp.com/appointment/' + appointment.id + '/delete/', {
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
      <div className="px-4 pt-1 sm:px-0">
        { appointment.doctor &&
          <div className="bg-white shadow sm:rounded-lg mt-4">
            <DoctorRow doctor={appointment.doctor} />
          </div>
        }
        <div className="rounded-lg p-6 h-auto bg-lightBlue mt-4 mb-2">
          <div className="text-lg text-white">
            Date and time
          </div>
          <div className="text-md text-darkBlue">
            {Moment(appointment.timestamp).format('dddd, MMMM Do') + ', ' + Moment(appointment.timestamp).format('h:mma')}
          </div>
          <div className="py-4">
            <div className="text-lg text-white">
              Speciality
            </div>
            <div>
              <label htmlFor="speciality" className="sr-only">
                Specialty
              </label>
              <input
                type="text"
                name="specialty"
                id="specialty"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Select a specialty"
                readOnly
                value={selectedSpecialtyOption.name}
                onClick={() => setIsSpecialtySearchModalVisible(true)}
              />
            </div>
            <div className="text-lg text-white mt-4">
              Reason for visit / notes
            </div>
            <div>
              <label htmlFor="notes" className="sr-only">
                Notes
              </label>
              <input
                type="text"
                name="notes"
                id="notes"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Reason for visit / notes"
                value={notes}
                onChange={(input) => setNotes(input.target.value)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onUpdateButtonClicked}
              disabled={isLoading}
            >
              Update
            </button>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-red hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onDeleteButtonClicked}
              disabled={isLoading}
            >
              Delete
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <SearchModal
          open={isSpecialtySearchModalVisible}
          title={"Select a specialty:"}
          placeholder={"Search here.."}
          options={specialtyOptions}
          onSearchBoxChangeText={onSpecialtySearchBoxChangeText}
          onOptionSelected={onSpecialtyOptionSelected}
          onCancelButtonPress={() => setIsSpecialtySearchModalVisible(false)}
          >
        </SearchModal>
        <ConfirmationModal
          open={isUpdateConfirmationModalVisible}
          title={'Success! The appointment has been booked!'}
          description={'Thank you! You will recieve and email soon.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Close'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsUpdateConfirmationModalVisible(false);
            router.push('/appointments');
          }}
          //confirmButtonText={'Confirm'}
          //confirmButtonColor={'red'}
          //onConfirmlButtonPress={() => setIsConfirmationModalVisible(false)}
          >
        </ConfirmationModal>
        <ConfirmationModal
          open={isDeleteConfirmationModalVisible}
          title={'The appointment was deleted.'}
          description={'The appointment has been cancelled an the physician/office notified.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Close'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsDeleteConfirmationModalVisible(false);
            router.push('/appointments');
          }}
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
