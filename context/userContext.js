import React from 'react';

export const UserContext = React.createContext(
  {
    token: null,
    patient: null,
    doctor: null,
    appointments: []
  }
);