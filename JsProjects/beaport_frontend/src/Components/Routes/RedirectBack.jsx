import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function RedirectBack() {
  const [path, setPath] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Ermittelt übergeordneten Pfad
    const tempPath = location.pathname.split('/').slice(0, -1).join('/')
    setPath(tempPath.length > 0 ? tempPath : '/')
  }, [])

  return typeof path === 'string' ? <Navigate to={path} /> : null
}

export default RedirectBack
