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

export default function BookAppointment(props) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const doctorId = router.query.doctorId && Number(router.query.doctorId);
  const date = Moment(router.query.date);
  const time = Moment(router.query.time);

  const [doctor, setDoctor] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isSpecialtySearchModalVisible, setIsSpecialtySearchModalVisible] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [selectedSpecialtyOption, setSelectedSpecialtyOption] = useState({});

  const [notes, setNotes] = useState(null);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  useEffect(async () => {
    if(!router.isReady) return;
    var doctor = await fetch('http://www.docmeapp.com/doctor/' + doctorId, { method: 'GET' })
      .then((response) => { 
        if (response.status == 200) {
          return response.json()
          .then((responseJson) => {
            if (responseJson.isSuccess) {
              return responseJson.doctor;
            }
          })
        }
        return {};
      })
      .catch((error) => {
        console.error(error);
        setDoctor(null);
      });
    setDoctor(doctor);
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

  const onBookButtonClicked = async function () {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await book();
    if (response) {
      if (response.isSuccess) {
        setIsLoading(false);
        setIsConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error booking; please update entries and try again.');
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

  const book = async function () {
    var body = {
      patientId: userContext.patient.id,
      doctorId: doctorId,
      specialtyId: selectedSpecialtyOption.id,
      timestamp: time.toJSON(),
      isNewPatient: true,
      notes: notes
    };
    return await fetch('http://www.docmeapp.com/appointment/book', {
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
        { doctor &&
          <div className="bg-white shadow sm:rounded-lg mt-4">
            <DoctorRow doctor={doctor} />
          </div>
        }
        <div className="rounded-lg p-6 h-auto bg-lightBlue mt-4 mb-2">
          <div className="text-lg text-white">
            Date and time
          </div>
          <div className="text-md text-darkBlue">
            {date.format('dddd, MMMM Do') + ', ' + time.format('h:mma')}
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
                onChange={(input) => setNotes(input.target.value)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onBookButtonClicked}
              disabled={isLoading}
            >
              Book
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
          open={isConfirmationModalVisible}
          title={'Success! The appointment has been booked!'}
          description={'Thank you! You will recieve and email soon.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Close'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsConfirmationModalVisible(false);
            router.push('/appointments');
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
