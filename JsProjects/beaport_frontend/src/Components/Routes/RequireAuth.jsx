import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin } from '../../Services/general'
import { isLoggedIn } from '../../Services/login'
import Loading from '../Loading/Loading'

function RequireAuth({ children, redirectTo, adminOnly }) {
  const [returnElement, setReturnElement] = useState(<Loading />)

  isLoggedIn().then(() => {
    if (adminOnly) {
      setReturnElement(isAdmin() ? children : <Navigate to={redirectTo} />)
    } else {
      setReturnElement(children)
    }
  }).catch(() => {
    setReturnElement(<Navigate to={redirectTo} />)
  })

  return returnElement
}

RequireAuth.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  redirectTo: PropTypes.string,
  adminOnly: PropTypes.bool,
}

RequireAuth.defaultProps = {
  redirectTo: '/Login',
  adminOnly: false,
}

export default RequireAuth
