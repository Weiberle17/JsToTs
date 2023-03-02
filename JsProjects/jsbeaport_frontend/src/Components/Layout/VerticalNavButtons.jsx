import { Add, Create, Delete, Description, ShoppingCart, VpnKey } from '@mui/icons-material'
import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import NavButton from './NavButton'

const VerticalNavButtons = ({ pathname }) => (
  <Grid
    container
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 70,
      zIndex: 1,
    }}
    direction="column"
    justifyContent="center"
    alignItems="center"
  >
    <NavButton
      title="Neues Passwort"
      value="password"
      toPath="/kennwort"
      current={pathname === '/kennwort'}
    >
      <VpnKey />
    </NavButton>
    <NavButton
      title="Produkte verwalten"
      value="products"
      toPath="/produkte"
      current={pathname === '/produkte'}
    >
      <ShoppingCart />
    </NavButton>
    {/* {pathname !== '/berichte/main'
     && (
     <NavButton title="Berichte" value="report" toPath="/berichte/main">
     <Description />
     </NavButton>
     )} */}
    <NavButton title="Bericht" value="report" toPath="/bericht" current={pathname === '/bericht'}>
      <Description />
    </NavButton>
    <NavButton
      title="Benutzer anlegen"
      value="create"
      toPath="/benutzer/anlegen"
      current={pathname === '/benutzer/anlegen'}
    >
      <Add />
    </NavButton>
    <NavButton
      title="Benutzer ändern"
      value="change"
      toPath="/benutzer/ändern"
      current={pathname === '/benutzer/ändern'}
    >
      <Create />
    </NavButton>
    <NavButton
      title="Benutzer entfernen"
      value="delete"
      toPath="/benutzer/löschen"
      current={pathname === '/benutzer/löschen'}
    >
      <Delete />
    </NavButton>
  </Grid>
)

VerticalNavButtons.propTypes = {
  pathname: PropTypes.string.isRequired,
}

export default VerticalNavButtons
