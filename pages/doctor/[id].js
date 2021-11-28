import React, { useState, useEffect } from 'react';
import { LocationMarkerIcon, StarIcon } from '@heroicons/react/solid';
import Layout from '../../components/layout';
import 'react-datepicker/dist/react-datepicker.css';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
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

  return { paths, fallback: false };
}

export default function Doctor(props) {

  const [doctor, setDoctor] = useState(props.doctor);

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
                <div className="flex">
                  <StarIcon className="h-5 w-5 text-green" aria-hidden="true" />
                  <StarIcon className="h-5 w-5 text-green" aria-hidden="true" />
                  <StarIcon className="h-5 w-5 text-green" aria-hidden="true" />
                  <StarIcon className="h-5 w-5 text-green" aria-hidden="true" />
                  <StarIcon className="h-5 w-5 text-green" aria-hidden="true" />
                  <p className="ml-1 text-sm font-light text-gray-600">(471)</p>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <div className="grid justify-items-center px-4 py-5 sm:p-6">
          <div className="min-w-0 flex-1 text-center">
              <p className="text-lg font-medium text-darkBlue">Book an appointment</p>
          </div>
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
          
      `}</style>
    </Layout>
  )
}
