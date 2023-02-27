import { Button, Divider, FormControl, Grid, Grow, Modal, Paper, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertDialog from '../../Components/Dialogs/AlertDialog'
import { login } from '../../Services/login'

function LoginModal(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertTitle, setAlertTitle] = useState('')
  const [alertContent, setAlertContent] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertAccept, setAlertAccept] = useState(null)

  const navigate = useNavigate()

  const toggleAlert = (title, content, onAccept) => {
    if (title != null) {
      setAlertTitle(title)
      setAlertContent(content)
      setAlertAccept(onAccept)
    }
    setAlertOpen(!alertOpen)
  }

  const handleClose = () => {props.toggleModal()}

  const handleUsernameChange = (e) => {setUsername(e.target.value)}

  const handlePasswortChange = (e) => {setPassword(e.target.value)}

  const handleSubmit = (e) => {
    e.preventDefault()
    doLogin()
  }

  const doLogin = () => {
    props.setLoading(true)
    const promise = login(username, password)
    promise.then(() => {
      navigate('/')
    }).catch((error) => {
      props.setLoading(false)
      console.log(error)
      toggleAlert('Anmeldung fehlgeschlagen', 'Sie konnten nicht angemeldet werden. Bitte überprüfen Sie die eingegebene Benutzerkennung und das Passwort.', null)
    })
  }

  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={props.open}
        onClose={handleClose}
        style={{ padding: '100px 0 20px' }}
      >
        <Grow in={props.open}>
          <Paper
            style={{
              width: '400px',
              maxHeight: '100%',
              overflow: 'auto',
              margin: 'auto',
              padding: 20,
            }}
          >
            <div>
              <Typography variant="h6">
                Login
              </Typography>
              <Typography variant="body1">
                Bitte geben Sie Ihre Benutzerkennung (E-Mail) und Ihr Passwort ein, um sich anzumelden.
              </Typography>
              <Divider />
              <FormControl style={{ width: '100%' }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    style={{ width: '100%' }}
                    variant="standard"
                    name="username"
                    aria-label="Benutzername"
                    label="Benutzername"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  <TextField
                    type="password"
                    style={{ width: '100%' }}
                    variant="standard"
                    name="password"
                    aria-label="Passwort"
                    label="Passwort"
                    value={password}
                    onChange={handlePasswortChange}
                  />
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
                      Anmelden
                    </Button>
                  </Grid>
                </form>
              </FormControl>
            </div>
          </Paper>
        </Grow>
      </Modal>
      <AlertDialog
        title={alertTitle}
        content={alertContent}
        open={alertOpen}
        onAccept={alertAccept}
        toggle={((title, content, onAccept) => toggleAlert(title, content, onAccept))}
      />
    </div>
  )
}

LoginModal.propTypes = {
  setLoading: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default LoginModal
