import React, { useState, useEffect, useContext } from 'react';
import { Switch } from '@headlessui/react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import { ExclamationIcon, CheckIcon } from '@heroicons/react/solid';
import Layout from '../components/layout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationModal from '../components/confirmationModal';
import Colors from '../constants/colors';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function EditSchedule() {
  
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [sundayIsEnabled, setSundayIsEnabled] = useState(false);
  const [sundayAvailabilityStartTime, setSundayAvailabilityStartTime] = useState(null);
  const [sundayAvailabilityEndTime, setSundayAvailabilityEndTime] = useState(null);
  const [sundayBreakStartTime, setSundayBreakStartTime] = useState(null);
  const [sundayBreakEndTime, setSundayBreakEndTime] = useState(null);

  const [mondayIsEnabled, setMondayIsEnabled] = useState(false);
  const [mondayAvailabilityStartTime, setMondayAvailabilityStartTime] = useState(null);
  const [mondayAvailabilityEndTime, setMondayAvailabilityEndTime] = useState(null);
  const [mondayBreakStartTime, setMondayBreakStartTime] = useState(null);
  const [mondayBreakEndTime, setMondayBreakEndTime] = useState(null);

  const [tuesdayIsEnabled, setTuesdayIsEnabled] = useState(false);
  const [tuesdayAvailabilityStartTime, setTuesdayAvailabilityStartTime] = useState(null);
  const [tuesdayAvailabilityEndTime, setTuesdayAvailabilityEndTime] = useState(null);
  const [tuesdayBreakStartTime, setTuesdayBreakStartTime] = useState(null);
  const [tuesdayBreakEndTime, setTuesdayBreakEndTime] = useState(null);

  const [wednesdayIsEnabled, setWednesdayIsEnabled] = useState(false);
  const [wednesdayAvailabilityStartTime, setWednesdayAvailabilityStartTime] = useState(null);
  const [wednesdayAvailabilityEndTime, setWednesdayAvailabilityEndTime] = useState(null);
  const [wednesdayBreakStartTime, setWednesdayBreakStartTime] = useState(null);
  const [wednesdayBreakEndTime, setWednesdayBreakEndTime] = useState(null);

  const [thursdayIsEnabled, setThursdayIsEnabled] = useState(false);
  const [thursdayAvailabilityStartTime, setThursdayAvailabilityStartTime] = useState(null);
  const [thursdayAvailabilityEndTime, setThursdayAvailabilityEndTime] = useState(null);
  const [thursdayBreakStartTime, setThursdayBreakStartTime] = useState(null);
  const [thursdayBreakEndTime, setThursdayBreakEndTime] = useState(null);

  const [fridayIsEnabled, setFridayIsEnabled] = useState(false);
  const [fridayAvailabilityStartTime, setFridayAvailabilityStartTime] = useState(null);
  const [fridayAvailabilityEndTime, setFridayAvailabilityEndTime] = useState(null);
  const [fridayBreakStartTime, setFridayBreakStartTime] = useState(null);
  const [fridayBreakEndTime, setFridayBreakEndTime] = useState(null);

  const [saturdayIsEnabled, setSaturdayIsEnabled] = useState(false);
  const [saturdayAvailabilityStartTime, setSaturdayAvailabilityStartTime] = useState(null);
  const [saturdayAvailabilityEndTime, setSaturdayAvailabilityEndTime] = useState(null);
  const [saturdayBreakStartTime, setSaturdayBreakStartTime] = useState(null);
  const [saturdayBreakEndTime, setSaturdayBreakEndTime] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  useEffect(() => {
    setSundayIsEnabled(userContext?.doctor?.schedule?.sundayAvailabilityStartTime != null);
    setSundayAvailabilityStartTime(userContext?.doctor?.schedule?.sundayAvailabilityStartTime);
    setSundayAvailabilityEndTime(userContext?.doctor?.schedule?.sundayAvailabilityEndTime);
    setSundayBreakStartTime(userContext?.doctor?.schedule?.sundayBreakStartTime);
    setSundayBreakEndTime(userContext?.doctor?.schedule?.sundayBreakEndTime);

    setMondayIsEnabled(userContext?.doctor?.schedule?.mondayAvailabilityStartTime != null);
    setMondayAvailabilityStartTime(userContext?.doctor?.schedule?.mondayAvailabilityStartTime);
    setMondayAvailabilityEndTime(userContext?.doctor?.schedule?.mondayAvailabilityEndTime);
    setMondayBreakStartTime(userContext?.doctor?.schedule?.mondayBreakStartTime);
    setMondayBreakEndTime(userContext?.doctor?.schedule?.mondayBreakEndTime);

    setTuesdayIsEnabled(userContext?.doctor?.schedule?.tuesdayAvailabilityStartTime != null);
    setTuesdayAvailabilityStartTime(userContext?.doctor?.schedule?.tuesdayAvailabilityStartTime);
    setTuesdayAvailabilityEndTime(userContext?.doctor?.schedule?.tuesdayAvailabilityEndTime);
    setTuesdayBreakStartTime(userContext?.doctor?.schedule?.tuesdayBreakStartTime);
    setTuesdayBreakEndTime(userContext?.doctor?.schedule?.tuesdayBreakEndTime);

    setWednesdayIsEnabled(userContext?.doctor?.schedule?.wednesdayAvailabilityStartTime != null);
    setWednesdayAvailabilityStartTime(userContext?.doctor?.schedule?.wednesdayAvailabilityStartTime);
    setWednesdayAvailabilityEndTime(userContext?.doctor?.schedule?.wednesdayAvailabilityEndTime);
    setWednesdayBreakStartTime(userContext?.doctor?.schedule?.wednesdayBreakStartTime);
    setWednesdayBreakEndTime(userContext?.doctor?.schedule?.wednesdayBreakEndTime);

    setThursdayIsEnabled(userContext?.doctor?.schedule?.thursdayAvailabilityStartTime != null);
    setThursdayAvailabilityStartTime(userContext?.doctor?.schedule?.thursdayAvailabilityStartTime);
    setThursdayAvailabilityEndTime(userContext?.doctor?.schedule?.thursdayAvailabilityEndTime);
    setThursdayBreakStartTime(userContext?.doctor?.schedule?.thursdayBreakStartTime);
    setThursdayBreakEndTime(userContext?.doctor?.schedule?.thursdayBreakEndTime);

    setFridayIsEnabled(userContext?.doctor?.schedule?.fridayAvailabilityStartTime != null);
    setFridayAvailabilityStartTime(userContext?.doctor?.schedule?.fridayAvailabilityStartTime);
    setFridayAvailabilityEndTime(userContext?.doctor?.schedule?.fridayAvailabilityEndTime);
    setFridayBreakStartTime(userContext?.doctor?.schedule?.fridayBreakStartTime);
    setFridayBreakEndTime(userContext?.doctor?.schedule?.fridayBreakEndTime);

    setSaturdayIsEnabled(userContext?.doctor?.schedule?.saturdayAvailabilityStartTime != null);
    setSaturdayAvailabilityStartTime(userContext?.doctor?.schedule?.saturdayAvailabilityStartTime);
    setSaturdayAvailabilityEndTime(userContext?.doctor?.schedule?.saturdayAvailabilityEndTime);
    setSaturdayBreakStartTime(userContext?.doctor?.schedule?.saturdayBreakStartTime);
    setSaturdayBreakEndTime(userContext?.doctor?.schedule?.saturdayBreakEndTime);
  }, [userContext]);

  const getDateTimeFrom24HourTime = function (time) {
    return time ? new Date(new Date().toDateString() + ' ' + time) : null;
  };

  const get24HourTimeFromDateTime = function (dateTime) {
    return dateTime && (((dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours()) + ':' + ((dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes()) + ':00');
  };

  const onSaveButtonClicked = async function() {
    setIsLoading(true);

    var isValidated = await validate();
    if (!isValidated) {
      setIsLoading(false);
      return;
    }

    var response = await save();
    if (response) {
      if (response.isSuccess) {
        userContext.setDoctor(response.doctor || null);
        setIsLoading(false);
        setIsConfirmationModalVisible(true);
      } else {
        setErrorMessage(response.errorMessage);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('There was an error saving changes; please update entries and try again');
      setIsLoading(false);
    }
  }

  const validate = async function () {
    var errorMessage = null;

    if (sundayIsEnabled) {
      if (!sundayAvailabilityStartTime) {
        errorMessage = 'Sunday availability start time is required.';
      } else if (!sundayAvailabilityEndTime) {
        errorMessage = 'Sunday availability end time is required.';
      } else if (!sundayBreakStartTime && sundayBreakEndTime) {
        errorMessage = 'Sunday break start time is required.';
      } else if (sundayBreakStartTime && !sundayBreakEndTime) {
        errorMessage = 'Sunday break end time is required.';
      }
    }

    if (mondayIsEnabled) {
      if (!mondayAvailabilityStartTime) {
        errorMessage = 'Monday availability start time is required.';
      } else if (!mondayAvailabilityEndTime) {
        errorMessage = 'Monday availability end time is required.';
      } else if (!mondayBreakStartTime && mondayBreakEndTime) {
        errorMessage = 'Monday break start time is required.';
      } else if (mondayBreakStartTime && !mondayBreakEndTime) {
        errorMessage = 'Monday break end time is required.';
      }
    }

    if (tuesdayIsEnabled) {
      if (!tuesdayAvailabilityStartTime) {
        errorMessage = 'Tuesday availability start time is required.';
      } else if (!tuesdayAvailabilityEndTime) {
        errorMessage = 'Tuesday availability end time is required.';
      } else if (!tuesdayBreakStartTime && tuesdayBreakEndTime) {
        errorMessage = 'Tuesday break start time is required.';
      } else if (tuesdayBreakStartTime && !tuesdayBreakEndTime) {
        errorMessage = 'Tuesday break end time is required.';
      }
    }

    if (wednesdayIsEnabled) {
      if (!wednesdayAvailabilityStartTime) {
        errorMessage = 'Wednesday availability start time is required.';
      } else if (!wednesdayAvailabilityEndTime) {
        errorMessage = 'Wednesday availability end time is required.';
      } else if (!wednesdayBreakStartTime && wednesdayBreakEndTime) {
        errorMessage = 'Wednesday break start time is required.';
      } else if (wednesdayBreakStartTime && !wednesdayBreakEndTime) {
        errorMessage = 'Wednesday break end time is required.';
      }
    }

    if (thursdayIsEnabled) {
      if (!thursdayAvailabilityStartTime) {
        errorMessage = 'Thursday availability start time is required.';
      } else if (!thursdayAvailabilityEndTime) {
        errorMessage = 'Thursday availability end time is required.';
      } else if (!thursdayBreakStartTime && thursdayBreakEndTime) {
        errorMessage = 'Thursday break start time is required.';
      } else if (thursdayBreakStartTime && !thursdayBreakEndTime) {
        errorMessage = 'Thursday break end time is required.';
      }
    }

    if (fridayIsEnabled) {
      if (!fridayAvailabilityStartTime) {
        errorMessage = 'Friday availability start time is required.';
      } else if (!fridayAvailabilityEndTime) {
        errorMessage = 'Friday availability end time is required.';
      } else if (!fridayBreakStartTime && fridayBreakEndTime) {
        errorMessage = 'Friday break start time is required.';
      } else if (fridayBreakStartTime && !fridayBreakEndTime) {
        errorMessage = 'Friday break end time is required.';
      }
    }

    if (saturdayIsEnabled) {
      if (!saturdayAvailabilityStartTime) {
        errorMessage = 'Saturday availability start time is required.';
      } else if (!saturdayAvailabilityEndTime) {
        errorMessage = 'Saturday availability end time is required.';
      } else if (!saturdayBreakStartTime && saturdayBreakEndTime) {
        errorMessage = 'Saturday break start time is required.';
      } else if (saturdayBreakStartTime && !saturdayBreakEndTime) {
        errorMessage = 'Saturday break end time is required.';
      }
    }
    
    setErrorMessage(errorMessage);
    return errorMessage ? false : true;
  };

  const save = async function () {
    var body = {
      sundayAvailabilityStartTime: sundayIsEnabled ? sundayAvailabilityStartTime : null,
      sundayAvailabilityEndTime: sundayIsEnabled ? sundayAvailabilityEndTime : null,
      sundayBreakStartTime: sundayIsEnabled ? sundayBreakStartTime : null,
      sundayBreakEndTime: sundayIsEnabled ? sundayBreakEndTime : null,
      mondayAvailabilityStartTime: mondayIsEnabled ? mondayAvailabilityStartTime : null,
      mondayAvailabilityEndTime: mondayIsEnabled ? mondayAvailabilityEndTime : null,
      mondayBreakStartTime: mondayIsEnabled ? mondayBreakStartTime : null,
      mondayBreakEndTime: mondayIsEnabled ? mondayBreakEndTime : null,
      tuesdayAvailabilityStartTime: tuesdayIsEnabled ? tuesdayAvailabilityStartTime : null,
      tuesdayAvailabilityEndTime: tuesdayIsEnabled ? tuesdayAvailabilityEndTime : null,
      tuesdayBreakStartTime: tuesdayIsEnabled ? tuesdayBreakStartTime : null,
      tuesdayBreakEndTime: tuesdayIsEnabled ? tuesdayBreakEndTime : null,
      wednesdayAvailabilityStartTime: wednesdayIsEnabled ? wednesdayAvailabilityStartTime : null,
      wednesdayAvailabilityEndTime: wednesdayIsEnabled ? wednesdayAvailabilityEndTime : null,
      wednesdayBreakStartTime: wednesdayIsEnabled ? wednesdayBreakStartTime : null,
      wednesdayBreakEndTime: wednesdayIsEnabled ? wednesdayBreakEndTime : null,
      thursdayAvailabilityStartTime: thursdayIsEnabled ? thursdayAvailabilityStartTime : null,
      thursdayAvailabilityEndTime: thursdayIsEnabled ? thursdayAvailabilityEndTime : null,
      thursdayBreakStartTime: thursdayIsEnabled ? thursdayBreakStartTime : null,
      thursdayBreakEndTime: thursdayIsEnabled ? thursdayBreakEndTime : null,
      fridayAvailabilityStartTime: fridayIsEnabled ? fridayAvailabilityStartTime : null,
      fridayAvailabilityEndTime: fridayIsEnabled ? fridayAvailabilityEndTime : null,
      fridayBreakStartTime: fridayIsEnabled ? fridayBreakStartTime : null,
      fridayBreakEndTime: fridayIsEnabled ? fridayBreakEndTime : null,
      saturdayAvailabilityStartTime: saturdayIsEnabled ? saturdayAvailabilityStartTime : null,
      saturdayAvailabilityEndTime: saturdayIsEnabled ? saturdayAvailabilityEndTime : null,
      saturdayBreakStartTime: saturdayIsEnabled ? saturdayBreakStartTime : null,
      saturdayBreakEndTime: saturdayIsEnabled ? saturdayBreakEndTime : null,
    };

    return fetch('http://www.docmeapp.com/doctor/' + userContext.doctor.id + '/update/schedule', {
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
        <div className="rounded-lg p-6 h-auto bg-lightBlue my-4 mb-2">
          <div className="text-md text-white">
            Edit and save your schedule details below.
          </div>
          <div className="">
            {/* Sunday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Sunday?</p>
                <Switch
                  checked={sundayIsEnabled}
                  onChange={(isEnabled) => setSundayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Sunday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      sundayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Sunday availability start time</p>
                <label htmlFor="sundayAvailabilityStartTime" className="sr-only">
                  Sunday availability start time
                </label>
                <DatePicker
                  id="sundayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(sundayAvailabilityStartTime)}
                  onChange={(date) => setSundayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Sunday availability end time</p>
                <label htmlFor="sundayAvailabilityEndTime" className="sr-only">
                  Sunday availability end time
                </label>
                <DatePicker
                  id="sundayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(sundayAvailabilityEndTime)}
                  onChange={(date) => setSundayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Sunday break start time</p>
                <label htmlFor="sundayBreakStartTime" className="sr-only">
                  Sunday break start time
                </label>
                <DatePicker
                  id="sundayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(sundayBreakStartTime)}
                  onChange={(date) => setSundayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Sunday break end time</p>
                <label htmlFor="sundayBreakEndTime" className="sr-only">
                  Sunday break end time
                </label>
                <DatePicker
                  id="sundayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(sundayBreakEndTime)}
                  onChange={(date) => setSundayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Monday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Monday?</p>
                <Switch
                  checked={mondayIsEnabled}
                  onChange={(isEnabled) => setMondayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Monday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      mondayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Monday availability start time</p>
                <label htmlFor="mondayAvailabilityStartTime" className="sr-only">
                  Monday availability start time
                </label>
                <DatePicker
                  id="mondayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(mondayAvailabilityStartTime)}
                  onChange={(date) => setMondayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Monday availability end time</p>
                <label htmlFor="mondayAvailabilityEndTime" className="sr-only">
                  Monday availability end time
                </label>
                <DatePicker
                  id="mondayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(mondayAvailabilityEndTime)}
                  onChange={(date) => setMondayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Monday break start time</p>
                <label htmlFor="mondayBreakStartTime" className="sr-only">
                  Monday break start time
                </label>
                <DatePicker
                  id="mondayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(mondayBreakStartTime)}
                  onChange={(date) => setMondayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Monday break end time</p>
                <label htmlFor="mondayBreakEndTime" className="sr-only">
                  Monday break end time
                </label>
                <DatePicker
                  id="mondayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(mondayBreakEndTime)}
                  onChange={(date) => setMondayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Tuesday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Tuesday?</p>
                <Switch
                  checked={tuesdayIsEnabled}
                  onChange={(isEnabled) => setTuesdayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Tuesday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tuesdayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Tuesday availability start time</p>
                <label htmlFor="tuesdayAvailabilityStartTime" className="sr-only">
                  Tuesday availability start time
                </label>
                <DatePicker
                  id="tuesdayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(tuesdayAvailabilityStartTime)}
                  onChange={(date) => setTuesdayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Tuesday availability end time</p>
                <label htmlFor="tuesdayAvailabilityEndTime" className="sr-only">
                  Tuesday availability end time
                </label>
                <DatePicker
                  id="tuesdayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(tuesdayAvailabilityEndTime)}
                  onChange={(date) => setTuesdayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Tuesday break start time</p>
                <label htmlFor="tuesdayBreakStartTime" className="sr-only">
                  Tuesday break start time
                </label>
                <DatePicker
                  id="tuesdayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(tuesdayBreakStartTime)}
                  onChange={(date) => setTuesdayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Tuesday break end time</p>
                <label htmlFor="tuesdayBreakEndTime" className="sr-only">
                  Tuesday break end time
                </label>
                <DatePicker
                  id="tuesdayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(tuesdayBreakEndTime)}
                  onChange={(date) => setTuesdayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Wednesday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Wednesday?</p>
                <Switch
                  checked={wednesdayIsEnabled}
                  onChange={(isEnabled) => setWednesdayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Wednesday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      wednesdayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Wednesday availability start time</p>
                <label htmlFor="wednesdayAvailabilityStartTime" className="sr-only">
                  Wednesday availability start time
                </label>
                <DatePicker
                  id="wednesdayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(wednesdayAvailabilityStartTime)}
                  onChange={(date) => setWednesdayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Wednesday availability end time</p>
                <label htmlFor="wednesdayAvailabilityEndTime" className="sr-only">
                  Wednesday availability end time
                </label>
                <DatePicker
                  id="wednesdayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(wednesdayAvailabilityEndTime)}
                  onChange={(date) => setWednesdayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Wednesday break start time</p>
                <label htmlFor="wednesdayBreakStartTime" className="sr-only">
                  Wednesday break start time
                </label>
                <DatePicker
                  id="wednesdayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(wednesdayBreakStartTime)}
                  onChange={(date) => setWednesdayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Wednesday break end time</p>
                <label htmlFor="wednesdayBreakEndTime" className="sr-only">
                  Wednesday break end time
                </label>
                <DatePicker
                  id="wednesdayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(wednesdayBreakEndTime)}
                  onChange={(date) => setWednesdayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Thursday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Thursday?</p>
                <Switch
                  checked={thursdayIsEnabled}
                  onChange={(isEnabled) => setThursdayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Thursday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      thursdayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Thursday availability start time</p>
                <label htmlFor="thursdayAvailabilityStartTime" className="sr-only">
                  Thursday availability start time
                </label>
                <DatePicker
                  id="thursdayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(thursdayAvailabilityStartTime)}
                  onChange={(date) => setThursdayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Thursday availability end time</p>
                <label htmlFor="thursdayAvailabilityEndTime" className="sr-only">
                  Thursday availability end time
                </label>
                <DatePicker
                  id="thursdayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(thursdayAvailabilityEndTime)}
                  onChange={(date) => setThursdayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Thursday break start time</p>
                <label htmlFor="thursdayBreakStartTime" className="sr-only">
                  Thursday break start time
                </label>
                <DatePicker
                  id="thursdayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(thursdayBreakStartTime)}
                  onChange={(date) => setThursdayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Thursday break end time</p>
                <label htmlFor="thursdayBreakEndTime" className="sr-only">
                  Thursday break end time
                </label>
                <DatePicker
                  id="thursdayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(thursdayBreakEndTime)}
                  onChange={(date) => setThursdayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Friday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Friday?</p>
                <Switch
                  checked={fridayIsEnabled}
                  onChange={(isEnabled) => setFridayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Friday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      fridayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Friday availability start time</p>
                <label htmlFor="fridayAvailabilityStartTime" className="sr-only">
                  Friday availability start time
                </label>
                <DatePicker
                  id="fridayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(fridayAvailabilityStartTime)}
                  onChange={(date) => setFridayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Friday availability end time</p>
                <label htmlFor="fridayAvailabilityEndTime" className="sr-only">
                  Friday availability end time
                </label>
                <DatePicker
                  id="fridayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(fridayAvailabilityEndTime)}
                  onChange={(date) => setFridayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Friday break start time</p>
                <label htmlFor="fridayBreakStartTime" className="sr-only">
                  Friday break start time
                </label>
                <DatePicker
                  id="fridayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(fridayBreakStartTime)}
                  onChange={(date) => setFridayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Friday break end time</p>
                <label htmlFor="fridayBreakEndTime" className="sr-only">
                  Friday break end time
                </label>
                <DatePicker
                  id="fridayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(fridayBreakEndTime)}
                  onChange={(date) => setFridayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            {/* Saturday */}
            <div className="py-4">
              <div>
                <p className="text-sm font-medium text-darkBlue">Available on Saturday?</p>
                <Switch
                  checked={saturdayIsEnabled}
                  onChange={(isEnabled) => setSaturdayIsEnabled(isEnabled)}
                  className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Available on Saturday?</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      saturdayIsEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-lightBlue',
                      'pointer-events-none inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Saturday availability start time</p>
                <label htmlFor="saturdayAvailabilityStartTime" className="sr-only">
                  Saturday availability start time
                </label>
                <DatePicker
                  id="saturdayAvailabilityStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(saturdayAvailabilityStartTime)}
                  onChange={(date) => setSaturdayAvailabilityStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Saturday availability end time</p>
                <label htmlFor="saturdayAvailabilityEndTime" className="sr-only">
                  Saturday availability end time
                </label>
                <DatePicker
                  id="saturdayAvailabilityEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(saturdayAvailabilityEndTime)}
                  onChange={(date) => setSaturdayAvailabilityEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Saturday break start time</p>
                <label htmlFor="saturdayBreakStartTime" className="sr-only">
                  Saturday break start time
                </label>
                <DatePicker
                  id="saturdayBreakStartTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(saturdayBreakStartTime)}
                  onChange={(date) => setSaturdayBreakStartTime(get24HourTimeFromDateTime(date))}
                />
              </div>
              <div>
                <p className="mt-3 text-sm font-medium text-darkBlue">Saturday break end time</p>
                <label htmlFor="saturdayBreakEndTime" className="sr-only">
                  Saturday break end time
                </label>
                <DatePicker
                  id="saturdayBreakEndTime"
                  className="time-picker mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm a"
                  isClearable
                  placeholderText="Select time"
                  selected={getDateTimeFrom24HourTime(saturdayBreakEndTime)}
                  onChange={(date) => setSaturdayBreakEndTime(get24HourTimeFromDateTime(date))}
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-4 mb-4 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onSaveButtonClicked}
              disabled={isLoading}
            >
              Save Changes
            </button>
            { errorMessage &&
              <div className="mt-2 flex flex-row text-sm text-white">
                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />&nbsp;&nbsp;{errorMessage}
              </div>
            }
          </div>
        </div>
        <ConfirmationModal
          open={isConfirmationModalVisible}
          title={'Success!'}
          description={'The changes were saved succesfully.'}
          icon={<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
          cancelButtonText={'Close'}
          cancelButtonColor={'white'}
          onCancelButtonPress={() => {
            setIsConfirmationModalVisible(false);
            router.push('/myaccount');
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
