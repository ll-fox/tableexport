import React from 'react'

const MyContext = React.createContext({
  isLoggedIn: false,
  user: null,
  project: [],
  selectProject: ''
})

export default MyContext
