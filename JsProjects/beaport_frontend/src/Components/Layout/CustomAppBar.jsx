import { ExitToApp, Home } from '@mui/icons-material'
import { AppBar, Grid, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../Resources/img/KommONE-negativ.svg'
import { getCurrentUser, getRole } from '../../Services/general'
import { isLoggedIn, logout } from '../../Services/login'

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
  const [loggedIn, setLoggedIn] = React.useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const username = getCurrentUser()
  const role = getRole()
  isLoggedIn().then(() => setLoggedIn(true)).catch(() => setLoggedIn(false))
  let title
  const path = pathname.toLowerCase().split('/')
  switch (path[1]) {
    case 'login':
      title = 'Login'
      break
    case 'exports':
      switch (path[2]) {
        case 'gba':
          title = 'Exporte Grundsteuer'
          break
        case 'gews':
          title = 'Exporte Gewerbesteuer'
          break
        case 'sein':
          title = 'Exporte Sonstige Einnahmen'
          break
        case 'wasser':
          title = 'Exporte Wasser/Abwasser'
          break
        case 'hund':
          title = 'Exporte Hundesteuer'
          break
        default:
          title = 'Exporte'
      }
      break
    case 'benutzeranlegen':
      title = 'Benutzer anlegen'
      break
    case 'adminanlegen':
      title = 'Administratorbenutzer anlegen'
      break
    case 'jaso':
      switch (path[2]) {
        case 'gba':
          title = 'Grundsteuer'
          break
        case 'gews':
          title = 'Gewerbesteuer'
          break
        case 'sein':
          title = 'Sonstige Einnahmen'
          break
        case 'wasser':
          title = 'Wasser/Abwasser'
          break
        case 'hund':
          title = 'Hundesteuer'
          break
        default:
          title = 'Neue JaSo-Beauftragung'
      }
      break
    case 'prj-bea':
      switch (path[2]) {
        case 'gba':
          title = 'Grundsteuer'
          break
        case 'gews':
          title = 'Gewerbesteuer'
          break
        case 'sein':
          title = 'Sonstige Einnahmen'
          break
        case 'wasser':
          title = 'Wasser/Abwasser'
          break
        case 'hund':
          title = 'Hundesteuer'
          break
        default:
          title = 'Neue Projektkunden-Beauftragung'
      }
      break
    case 'bea':
      switch (path[2]) {
        case 'gba':
          title = 'Grundbesitzangaben'
          break
        case 'gews':
          title = 'Gewerbesteuer'
          break
        case 'sein':
          title = 'Sonstige Einnahmen'
          break
        case 'wasser':
          title = 'Wasser/Abwasser'
          break
        case 'hund':
          title = 'Hundesteuer'
          break
        default:
          title = 'Neue Beauftragung'
      }
      break
    default:
      title = null
  }

  const logoutUser = () => {
    logout().then(() => {window.location.reload()}).catch(() => {window.location.reload()})
  }

  const redirectHome = () => {
    if (pathname === '/') {
      window.location.reload()
    } else {
      navigate('/')
    }
  }

  // TODO: Title zu H1 machen
  return (
    <AppBar id="appbar" color="primary">
      <Toolbar style={{ paddingLeft: 0 }}>
        <Tooltip title="Home">
          <Link to="/">
            <img
              style={{
                height: 50,
                width: undefined,
                margin: 10,
              }}
              alt="Komm.ONE"
              src={logo}
            />
          </Link>
        </Tooltip>
        {title ? (
          <>
            <Typography
              style={{
                marginRight: 20,
                marginBottom: 5,
              }}
              variant="h5"
              color="inherit"
              noWrap
            >
              BEA
            </Typography>
            <Typography style={{ flexGrow: 1, marginBottom: 5 }} variant="h6" color="inherit" noWrap>
              {title}
            </Typography>
          </>
        ) : (
          <Typography
            style={{
              marginBottom: 5,
              flexGrow: 1,
            }}
            variant="h5"
            color="inherit"
            noWrap
          >
            BEA Portal
          </Typography>
        )}
        {
          !(pathname === '/Login' || pathname === '/') && (
            <Tooltip title="Home">
              <IconButton
                style={{ margin: 5 }}
                color="inherit"
                aria-label="Home"
                onClick={redirectHome}
                size="large"
              >
                <Home fontSize="large" />
              </IconButton>
            </Tooltip>
          )
        }
        {loggedIn && (
          <>
            <Grid
              container
              direction="column"
              style={{
                width: 'auto',
                minWidth: '200px',
                paddingRight: '10px',
              }}
            >
              <Grid item>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  {`Benutzer: ${username}`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  {`Rolle: ${role}`}
                </Typography>
              </Grid>
            </Grid>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logoutUser} size="large">
                <ExitToApp fontSize="large" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
