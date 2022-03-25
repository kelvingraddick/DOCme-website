import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { LocationMarkerIcon, StarIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Layout from '../../components/layout';
import RatingStarsView from '../../components/ratingStarsView';
import 'react-datepicker/dist/react-datepicker.css';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import Moment from 'moment';
import Genders from '../../constants/genders';
import Races from '../../constants/races';

export async function getStaticProps(context) {
  var doctor = await fetch('http://www.docmeapp.com/doctor/' + context.params.id, { method: 'GET' })
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
      return {};
    });

  var coordinates = {
    center: {
      lat: 37.78825,
      lng: -122.4324
    },
    zoom: 13
  };
  if (doctor.practice) {
    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    if (process.env.NODE_ENV == 'development') Geocode.enableDebug();
    coordinates = await Geocode.fromAddress(doctor.practice.addressLine1 + " " + doctor.practice.addressLine2 + " " + doctor.practice.city + ", " + doctor.practice.state + " " + doctor.practice.postalCode)
      .then((response) => { 
        return {
          center: {
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng
          },
          zoom: 13
        };
      })
      .catch((error) => {
        console.error(error);
        return {};
      });
  }

  return {
    props: {
      doctor,
      coordinates
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  var doctors = await fetch('http://www.docmeapp.com/doctor/search/', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.doctors;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

  const paths = doctors.map((doctor) => ({
    params: { id: doctor.id + '' },
  }));

  return { paths, fallback: 'blocking' };
}

export default function Doctor(props) {
  const router = useRouter();

  const [doctor, setDoctor] = useState(props.doctor);
  const [date, setDate] = useState(Moment().startOf('date'));
  const [times, setTimes] = useState([]);

  const CHANGE_DATE_DIRECTION = { BACK: 0, FORWARD: 1 }

  const changeTimes = function () {
    var times = [];
    var schedule = doctor.schedule;
    if (schedule) {
      var dayOfWeek = date.format('dddd').toLowerCase();
      var availabilityStartTime = getTimeFromString(schedule[dayOfWeek + 'AvailabilityStartTime']);
      var availabilityEndTime = getTimeFromString(schedule[dayOfWeek + 'AvailabilityEndTime']);
      var breakStartTime = getTimeFromString(schedule[dayOfWeek + 'BreakStartTime']);
      var breakEndTime = getTimeFromString(schedule[dayOfWeek + 'BreakEndTime']);
      if (availabilityStartTime && availabilityEndTime) {
        var time = Moment(availabilityStartTime);
        while(time.isBefore(availabilityEndTime)) {
          if (!breakStartTime || !breakEndTime || (!time.isSame(breakStartTime) && !time.isBetween(breakStartTime, breakEndTime))) { 
            times.push(Moment(time)); 
          }
          time.add(30, 'minutes');
        }
      }
    }
    setTimes(times);
  };

  const getTimeFromString = function (string) {
    return string ? 
      Moment(date.format('YYYY-MM-DD') + ' ' + string, "YYYY-MM-DD HH:mm:ss") : null;
  };

  const changeDate = function (direction) {
    if (direction == CHANGE_DATE_DIRECTION.FORWARD) setDate(date.add(1, 'days'));
    else if (date.isSameOrAfter(Moment())) setDate(date.subtract(1, 'days'));
    changeTimes();
  };

  return (
    <Layout>
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <div className="grid justify-items-center px-4 py-5 sm:p-6">
          <div className="flex-shrink-0 mb-2">
            <img className="h-20 w-20 rounded-full" src={props.doctor.imageUrl || '/images/placeholder-user.png'} alt="" />
          </div>
          <div className="min-w-0 flex-1 text-center">
              <p className="text-lg font-medium text-darkBlue truncate">{props.doctor.firstName + ' ' + props.doctor.lastName}</p>
              <p className="mt-1 text-sm font-light text-darkBlue truncate">{props.doctor.emailAddress}</p>
              <div className="mt-1 grid justify-items-center">
                <RatingStarsView doctor={props.doctor} />
              </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <div className="grid justify-items-center px-4 py-5 sm:p-6">
          <div className="min-w-0 flex-1 text-center">
              <p className="text-lg font-medium text-darkBlue">Book an appointment</p>
          </div>
          <div className="min-w-full flex flex-row items-center text-center">
            <ChevronLeftIcon className="arrow-button flex-none h-12 w-12 text-green" aria-hidden="true"
              onClick={() => changeDate(CHANGE_DATE_DIRECTION.BACK)}
            />
            <div className="flex-grow">
              <div className="flex flex-row text-darkGray justify-center">
                <CalendarIcon className="h-5 w-5" aria-hidden="true" />&nbsp;
                <span className="text-md font-medium text-darkGray">{date.format('ddd, MMM D')}</span>
              </div>
            </div>
            <ChevronRightIcon className="arrow-button flex-none h-12 w-12 text-green" aria-hidden="true"
              onClick={() => changeDate(CHANGE_DATE_DIRECTION.FORWARD)}
            />
          </div>
          { times && times.length > 0 &&
            <div className="max-w-full flex flex-row items-center overflow-x-scroll">
              {times.map((time) => (
                <Link
                  href={{
                    pathname: "/bookappointment",
                    query: { doctorId: props.doctor.id, date: date.toJSON(), time: time.toJSON() },
                  }}
                >
                  <button className="group relative w-full flex justify-center mt-1 mb-3 mr-3 py-2 px-2 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {time.format('h:mma')}
                  </button>
                </Link>
              ))}
            </div>
          }
          { !times || times.length == 0 &&
            <div className="text-sm text-darkGray">No times available</div>
          }
        </div>
      </div>
      { props.coordinates && props.doctor.practice &&
        <div className="bg-white shadow sm:rounded-lg mt-4">
          <div className="grid justify-items-center px-4 py-5 sm:p-6">
            <div className="min-w-full flex-1 text-center">
                <p className="text-lg font-medium text-darkBlue">Location</p>
                { props.coordinates &&
                  <div className="mt-1" style={{ height: '200px', width: '100%' }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY }}
                      defaultCenter={props.coordinates.center}
                      defaultZoom={props.coordinates.zoom}
                    >
                      <LocationMarkerIcon className="h-12 w-12 relative bottom-12 text-red" aria-hidden="true"
                        lat={props.coordinates.center.lat}
                        lng={props.coordinates.center.lng}
                        text="Marker"
                      />
                    </GoogleMapReact>
                  </div>
                }
                { props.doctor.practice &&
                  <p className="mt-1 text-base font-thin text-darkGray">{props.doctor.practice.addressLine1} {props.doctor.practice.addressLine2} {props.doctor.practice.city}, {props.doctor.practice.state} {props.doctor.practice.postalCode}</p>
                }
            </div>
          </div>
        </div>
      }
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <div className="grid justify-items-center px-4 py-5 sm:p-6">
          <div className="min-w-0 flex-1 text-center">
            <p className="text-lg font-medium text-darkBlue">About</p>
          </div>
          <div className="min-w-0 justify-self-start">
            <p className="mt-1 text-sm text-darkGray">{props.doctor.description}</p>
          </div>
        </div>
      </div>
      { props.doctor.images && props.doctor.images.length > 0 &&
        <div className="bg-white shadow sm:rounded-lg mt-4">
          <div className="grid justify-items-center px-4 py-5 sm:p-6">
            <div className="min-w-0 flex-1 text-center">
              <p className="text-lg font-medium text-darkBlue">Images</p>
            </div>
            <div className="mt-4 max-w-full flex flex-row space-x-4 overflow-x-scroll">
              {props.doctor.images.map((image) => (
                <img src={image.url} alt="" className="h-52 w-52 object-cover pointer-events-none group-hover:opacity-75" />
              ))}
            </div>
          </div>
        </div>
      }
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <div className="grid justify-items-center px-4 py-5 sm:p-6">
          <div className="min-w-0 flex-1 text-center">
            <p className="text-lg font-medium text-darkBlue">Additional Information</p>
          </div>
          <div className="min-w-0 justify-self-start">
            <p className="mt-1 text-sm text-darkGray">
              Gender - { Genders.find(x => { return x.id === props.doctor.gender })?.name || 'Not set'}<br />
              Race - { Races.find(x => { return x.id === props.doctor.race })?.name || 'Not set'}
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .arrow-button {
          cursor: pointer;
        }
      `}</style>
    </Layout>
  )
}
