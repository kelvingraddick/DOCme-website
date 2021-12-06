import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
import DoctorRow from '../components/doctorRow';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Colors from '../constants/colors';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export default function Home() {
  
  const [isSpecialtySearchModalVisible, setIsSpecialtySearchModalVisible] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [selectedSpecialtyOption, setSelectedSpecialtyOption] = useState({});
  
  const [isLocationSearchModalVisible, setIsLocationSearchModalVisible] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocationOption, setSelectedLocationOption] = useState({});
 
  const {placePredictions, getPlacePredictions} = usePlacesService({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isInsuranceCarrierSearchModalVisible, setIsInsuranceCarrierSearchModalVisible] = useState(false);
  const [insuranceCarrierOptions, setInsuranceCarrierOptions] = useState([]);
  const [selectedInsuranceCarrierOption, setSelectedInsuranceCarrierOption] = useState({});

  const [isInsurancePlanSearchModalVisible, setIsInsurancePlanSearchModalVisible] = useState(false);
  const [insurancePlanOptions, setInsurancePlanOptions] = useState([]);
  const [selectedInsurancePlanOption, setSelectedInsurancePlanOption] = useState({});

  const [doctors, setDoctors] = useState([]);

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

  const onLocationSearchBoxChangeText = async function(text) {
    if (!text) return [];
    getPlacePredictions({ input: text });
  }

  useEffect(() => {
    if (placePredictions.length) 
      setLocationOptions(placePredictions.map((placePrediction) => ({ id: placePrediction.place_id, name: placePrediction.description })));
  }, [placePredictions]);

  const onLocationOptionSelected = function(option) {
    setSelectedLocationOption(option);
    setIsLocationSearchModalVisible(false);
    setLocationOptions([]);
  }

  const onInsuranceCarrierSearchBoxChangeText = async function(text) {
    if (!text) return [];

    var insuranceCarriers = await fetch('http://www.docmeapp.com/insurance/carriers/search/' + encodeURIComponent(text), { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.insuranceCarriers;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

    setInsuranceCarrierOptions(insuranceCarriers);
  }

  const onInsuranceCarrierOptionSelected = async function(option) {
    setSelectedInsuranceCarrierOption(option);
    setIsInsuranceCarrierSearchModalVisible(false);
    setInsuranceCarrierOptions([]);
    setSelectedInsurancePlanOption({});
    setIsInsurancePlanSearchModalVisible(false);
    setInsurancePlanOptions([]);

    var insurancePlans = await fetch('http://www.docmeapp.com/insurance/carrier/' + option.id + '/plans', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.insurancePlans;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

    setInsurancePlanOptions(insurancePlans);
  }

  const onInsurancePlanOptionSelected = function(option) {
    setSelectedInsurancePlanOption(option);
    setIsInsurancePlanSearchModalVisible(false);
  }

  const onFindButtonClicked = async function() {
    if (!selectedSpecialtyOption || !selectedLocationOption) return [];

    var doctors = await fetch('http://www.docmeapp.com/doctor/search', { method: 'GET' })
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

    setDoctors(doctors);
  }

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0">
        <div className="bg-local bg-center bg-cover rounded-lg mb-1 h-96" style={{ backgroundImage: "url('../images/background-1.jpg')" }}></div>
        <div className="rounded-lg p-6 h-auto bg-lightBlue mb-2">
          <div className="text-center text-2xl text-white font-semibold">
            Welcome to DOCme!
          </div>
          <div className="text-center text-xl text-white">
            Tell us what you need below
          </div>
          <div className="py-6">
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
            <div>
              <label htmlFor="location" className="sr-only">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Select a location"
                readOnly
                value={selectedLocationOption.name}
                onClick={() => setIsLocationSearchModalVisible(true)}
              />
            </div>
            <div>
              <label htmlFor="datetime" className="sr-only">
                Date and Time
              </label>
              <DatePicker
                id="datetime"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            <div>
              <label htmlFor="insuranceCarrier" className="sr-only">
                Insurance Carrier
              </label>
              <input
                type="text"
                name="insuranceCarrier"
                id="insuranceCarrier"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Select a insurance carrier"
                readOnly
                value={selectedInsuranceCarrierOption.name}
                onClick={() => setIsInsuranceCarrierSearchModalVisible(true)}
              />
            </div>
            { selectedInsuranceCarrierOption.id &&
              <div>
                <label htmlFor="insurancePlan" className="sr-only">
                  Insurance Plan
                </label>
                <input
                  type="text"
                  name="insurancePlan"
                  id="insurancePlan"
                  className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-white placeholder-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                  placeholder="Select a insurance plan"
                  readOnly
                  value={selectedInsurancePlanOption.name}
                  onClick={() => setIsInsurancePlanSearchModalVisible(true)}
                />
              </div>
            }
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-2 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white hover:bg-mediumBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onFindButtonClicked}
            >
              Find
              <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <li key={doctor.id}>
                <a href={'/doctor/' + doctor.id} className="block hover:bg-gray-50">
                  <DoctorRow doctor={doctor} />
                </a>
              </li>
            ))}
          </ul>
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
        <SearchModal
          open={isLocationSearchModalVisible}
          title={"Select a location:"}
          placeholder={"Search here.."}
          options={locationOptions}
          onSearchBoxChangeText={onLocationSearchBoxChangeText}
          onOptionSelected={onLocationOptionSelected}
          onCancelButtonPress={() => setIsLocationSearchModalVisible(false)}
          >
        </SearchModal>
        <SearchModal
          open={isInsuranceCarrierSearchModalVisible}
          title={"Select an insurance carrier:"}
          placeholder={"Search here.."}
          options={insuranceCarrierOptions}
          onSearchBoxChangeText={onInsuranceCarrierSearchBoxChangeText}
          onOptionSelected={onInsuranceCarrierOptionSelected}
          onCancelButtonPress={() => setIsInsuranceCarrierSearchModalVisible(false)}
          >
        </SearchModal>
        <SearchModal
          open={isInsurancePlanSearchModalVisible}
          title={"Select an insurance plan:"}
          placeholder={"Search here.."}
          options={insurancePlanOptions}
          onOptionSelected={onInsurancePlanOptionSelected}
          onCancelButtonPress={() => setIsInsurancePlanSearchModalVisible(false)}
          >
        </SearchModal>
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
