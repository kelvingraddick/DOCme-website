import React, { useState } from 'react';
import { UserContext } from '../context/userContext';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
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
    <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)}>
      <Component {...pageProps} />
    </Elements>
  </UserContext.Provider>
}

export default MyApp
