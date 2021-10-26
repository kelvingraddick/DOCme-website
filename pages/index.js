import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/solid'
import Layout from '../components/layout';
import SearchModal from '../components/searchModal';
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
      return undefined;
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

  return (
    <Layout>
      <div className="px-4 pt-1 sm:px-0">
        <div className="bg-local bg-center bg-cover rounded-lg mb-1 h-96" style={{ backgroundImage: "url('../images/background-1.jpg')" }}></div>
        <div className="rounded-lg p-6 h-auto bg-lightBlue">
          <div className="text-center text-2xl text-white font-semibold">
            Welcome to DOCme!
          </div>
          <div className="text-center text-xl text-white">
            Tell us what you need below
          </div>
          <div className="py-6">
            <div>
              <label htmlFor="speciality" className="sr-only">
                Speciality
              </label>
              <input
                type="text"
                name="specialty"
                id="specialty"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                placeholder="Select a speciality"
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
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
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
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            <div>
              <label htmlFor="location" className="sr-only">
                Insurance carrier
              </label>
              <select
                id="insurance-carrier"
                name="Insurance carrier"
                className="mt-2 block w-full pl-3 pr-10 py-4 bg-highLight text-darkBlue border-0 focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md"
                defaultValue="United Healthcare Dental"
              >
                <option>United Healthcare Dental</option>
              </select>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center mt-2 py-4 px-4 bg-darkBlue border border-transparent text-md font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Find
              <span className="absolute right-2 inset-y-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-white group-hover:text-gray" aria-hidden="true" />
              </span>
            </button>
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
