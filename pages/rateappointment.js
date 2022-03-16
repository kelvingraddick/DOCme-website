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
import RatingValues from '../constants/ratingValues';

export default function RateAppointment(props) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const appointmentId = router.query.appointmentId && Number(router.query.appointmentId);

  const [appointment, setAppointment] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isValueSelectModalVisible, setIsValueSelectModalVisible] = useState(false);
  const [selectedValueOption, setSelectedValueOption] = useState({});
  const [notes, setNotes] = useState(null);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

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
  }, [router.isReady]);

  const onValueOptionSelected = function(option) {
    setSelectedValueOption(option);
    setIsValueSelectModalVisible(false);
  }

  const onSubmitButtonClicked = async function () {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await upsert();
    if (response) {
      if (response.isSuccess) {
        setIsLoading(false);
        setIsConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error submitting the rating; please update entries and try again.');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;
    if (!selectedValueOption.id) {
      errorMessage = 'Must select a rating value.';
    } else if (!userContext.patient || !userContext.token) {
      errorMessage = 'Must sign in or sign up as a patient to rate.';
    }
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  }

  const upsert = async function () {
    var body = {
      patientId: userContext.patient?.id,
      doctorId: appointment.doctor.id,
      timestamp: Moment().toJSON(),
      value: selectedValueOption.id,
      notes: notes
    };
    return await fetch('http://www.docmeapp.com/rating/upsert', {
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
              Rate your experience from 1 (lowest) to 5 (highest)
            </div>
            <div>
              <label htmlFor="value" className="sr-only">
                Rate your experience from 1 (lowest) to 5 (highest)
              </label>
              <input
                type="text"
                name="value"
                id="value"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Select rating value"
                readOnly
                value={selectedValueOption.name}
                onClick={() => setIsValueSelectModalVisible(true)}
              />
            </div>
            <div className="text-lg text-white mt-4">
              Any comments about your experience?
            </div>
            <div>
              <label htmlFor="notes" className="sr-only">
              Any comments about your experience?
              </label>
              <input
                type="text"
                name="notes"
                id="notes"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Enter comments"
                value={notes}
                onChange={(input) => setNotes(input.target.value)}
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSubmitButtonClicked}
              disabled={isLoading}
            >
              Submit
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <SearchModal
          open={isValueSelectModalVisible}
          title={"Select rating value:"}
          options={RatingValues}
          onOptionSelected={onValueOptionSelected}
          onCancelButtonPress={() => setIsValueSelectModalVisible(false)}
          >
        </SearchModal>
        <ConfirmationModal
          open={isConfirmationModalVisible}
          title={'Success! The rating has been submitted!'}
          description={'Thank you! The the rating will be posted soon.'}
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
