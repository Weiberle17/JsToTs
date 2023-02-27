import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'
import logo from '../Resources/img/KommONE-negativ.svg'

/**
 * Some documented component
 *
 * @component
 * React-Hook für State-Variable "loggedIn" und React-Router-Hooks für history und location
 * @example
 * return (
 *    <CustomAppBar />
 * )
 */

function CustomAppBar() {
  return (
    <AppBar id="appbar" color="primary">
      <Toolbar style={{ paddingLeft: 0 }}>
        <img
          style={{
            height: 50,
            width: undefined,
            margin: 10,
          }}
          alt="Komm.ONE"
          src={logo}
        />
        <Typography
          style={{
            flexGrow: 1,
          }}
          variant="h5"
          color="inherit"
          noWrap
        >
          Zuständigkeitenfinder
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
