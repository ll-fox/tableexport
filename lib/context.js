import React from 'react'

const MyContext = React.createContext({
  isLoggedIn: false,
  user: null
})

export default MyContext
