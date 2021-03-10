/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

//Set the global context of environment.
const IsAuthenticatedContext = React.createContext({
  isAuthenticated: false,
  login: () => {},
  authToken: '',
  setAuthTokenFunction: (_token: string) => {},
});

export default IsAuthenticatedContext;
