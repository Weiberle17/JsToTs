import {
  AlternateEmail, Business, Edit, Euro, GetApp, House, LocalDrink, NoteAdd, PersonAdd, Pets, SettingsBackupRestore,
  SupervisorAccount,
} from '@mui/icons-material'
import { Box, Card, CardActionArea, CardContent, Fade, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

function MenuButton({ title, toPath, pos, iconString, color, disabled, btnAction }) {
  let buttonStyle = { backgroundColor: '#e0e0e0', color: '#a6a6a6' }

  if (!disabled) {
    switch (color) {
      case 'yellow':
        buttonStyle = { backgroundColor: '#F0AF00', color: 'rgba(0,58,64,0.87)' }
        break
      default:
        buttonStyle = { backgroundColor: '#003A40', color: 'white' }
    }
  }

  const iconStyle = { fontSize: 50, marginTop: 40 }
  let icon

  switch (iconString) {
    case 'export':
      icon = <GetApp style={iconStyle}/>
      break
    case 'mail':
      icon = <AlternateEmail style={iconStyle}/>
      break
    case 'user':
      icon = <PersonAdd style={iconStyle}/>
      break
    case 'admin':
      icon = <SupervisorAccount style={iconStyle}/>
      break
    case 'edit':
      icon = <Edit style={iconStyle}/>
      break
    case 'reset':
      icon = <SettingsBackupRestore style={iconStyle}/>
      break
    case 'GBA':
      icon = <House style={iconStyle}/>
      break
    case 'GEWS':
      icon = <Business style={iconStyle}/>
      break
    case 'HUND':
      icon = <Pets style={iconStyle}/>
      break
    case 'SEIN':
      icon = <Euro style={iconStyle}/>
      break
    case 'WASSER':
      icon = <LocalDrink style={iconStyle}/>
      break
    default:
      icon = <NoteAdd style={iconStyle}/>
  }

  const button = (
    <Card style={buttonStyle}>
      <CardActionArea disabled={disabled}>
        <Grid
          container direction="column" justifyContent="center" alignItems="center"
        >
          {icon}
          <CardContent>
            <Typography gutterBottom variant="h6">
              {title}
            </Typography>
          </CardContent>
        </Grid>
      </CardActionArea>
    </Card>
  )

  const displayedButton = (
    <Fade in {...({ timeout: 250 * pos })}>
      {
        disabled ? (
          button
        ) : (
          toPath ? (
            <Link to={toPath}>
              {button}
            </Link>
          ) : (
            <Box onClick={btnAction}>
              {button}
            </Box>
          )
        )
      }
    </Fade>
  )

  return (
    <Grid item xs={12} sm={6} md={4}>
      {displayedButton}
    </Grid>
  )
}

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  toPath: PropTypes.string,
  pos: PropTypes.number,
  iconString: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  btnAction: PropTypes.func,
}

MenuButton.defaultProps = {
  toPath: null,
  pos: 1,
  iconString: '',
  color: 'blue',
  disabled: false,
  btnAction: () => {}
}

export default MenuButton
