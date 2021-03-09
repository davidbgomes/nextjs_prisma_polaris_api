import React from 'react'

//Set the global context of environment.
const IsAuthenticatedContext = React.createContext({isAuthenticated: false, login: () => {}, authToken:"", setAuthToken: () => {}})

export default IsAuthenticatedContext