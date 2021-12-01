import React, { useState } from 'react';
import { UserContext } from '../context/userContext';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  return <UserContext.Provider value={{
    token,
    patient,
    doctor,
    appointments,
    setToken,
    setPatient,
    setDoctor,
    setAppointments
  }}>
    <Component {...pageProps} />
  </UserContext.Provider>
}

export default MyApp
