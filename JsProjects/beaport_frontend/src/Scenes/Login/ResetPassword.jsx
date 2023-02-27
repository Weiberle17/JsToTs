import { FormControl, FormHelperText, Grid, Slide, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AlertDialog from '../../Components/Dialogs/AlertDialog'
import PasswortRegeln, { getPwdConditions } from '../../Components/Input/PasswortRegeln'
import { serviceSetNewPassword } from '../../Services/submitData'

function ResetPassword() {
  let [pwd1, setPwd1] = useState('')
  let [pwd2, setPwd2] = useState('')
  let [redirect, setRedirect] = useState(false)
  let [alertOpen, setAlertOpen] = useState(false)
  let [alertTitle, setAlertTitle] = useState('')
  let [alertContent, setAlertContent] = useState('')
  let [pwdConditions, setPwdConditions] = useState([false, false, false, false, false])
  const { token } = useParams()

  const toggleAlert = (title, content) => {
    if (title != null) {
      setAlertTitle(title)
      setAlertContent(content)
    }
    setAlertOpen(!alertOpen)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case 'pwd1':
        setPwd1(value)
        setPwdConditions(getPwdConditions(value))
        break
      case 'pwd2':
        setPwd2(e.target.value)
        break
      default:
        console.log(e.target.name)
        console.log(e.target.value)
    }
  }

  const successFunction = () => {
    toggleAlert('Erfolg', 'Ihr Passwort wurde erfolgreich gesetzt.')
    setRedirect(true)
  }

  const failureFunction = (msg = 'Ihr neues Passwort konnte nicht gesetzt werden.') => {
    toggleAlert('Fehler', msg)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pwdConditions[0] && pwdConditions.filter(x => x).length >= 4) {
      if (pwd1 === pwd2) {
        const data = {
          pwd: pwd1,
          token,
        }
        serviceSetNewPassword(data, successFunction, failureFunction)
      } else {
        failureFunction('Die beiden Passwörter stimmen nicht überein.')
      }
    } else {
      console.log(pwdConditions)
      failureFunction('Die Passwortregeln sind nicht erfüllt.')
    }
  }

  if (redirect && !alertOpen) {
    return (
      <Navigate to={'/'} />
    )
  }

  return (
    <div>
      <Slide in timeout={800} direction="down">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{
            position: 'absolute',
            top: 75,
            bottom: 0,
            width: '100%',
          }}
        >
          <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" style={{ marginBottom: 20 }}>
              Bitte geben Sie Ihr neues Passwort ein:
            </Typography>
            <FormControl style={{ width: '100%' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="password"
                  style={{ width: '100%' }}
                  variant="standard"
                  name="pwd1"
                  aria-label="Neues Passwort"
                  label="Neues Passwort"
                  value={pwd1}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <TextField
                  type="password"
                  style={{ width: '100%' }}
                  variant="standard"
                  name="pwd2"
                  aria-label="Neues Passwort wiederholen"
                  label="Neues Passwort wiederholen"
                  value={pwd2}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <FormHelperText error={!(pwdConditions[0] && pwdConditions.filter(x => x).length >= 4)}>
                  <PasswortRegeln pwdConditions={pwdConditions} />
                </FormHelperText>
                <Grid
                  container
                  style={{ marginTop: 20 }}
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  direction="row"
                >
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    Passwort ändern
                  </Button>
                </Grid>
              </form>
            </FormControl>
          </Grid>
        </Grid>
      </Slide>
      <AlertDialog
        title={alertTitle}
        content={alertContent}
        open={alertOpen}
        toggle={((title, content) => toggleAlert(title, content))}
      />
    </div>
  )
}

export default ResetPassword
