import { Button, Divider, FormControl, Grid, Grow, Modal, Paper, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import AlertDialog from '../../Components/Dialogs/AlertDialog'
import { serviceResetPassword } from '../../Services/submitData'

class ResetPasswordModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      email: '',
      alertTitle: '',
      alertContent: '',
      alertOpen: false,
      alertAccept: null,
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleAlert = this.toggleAlert.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
  }

  toggleAlert(title, content, onAccept) {
    this.props.setLoading(false)
    const { alertOpen } = this.state
    if (title != null) {
      this.setState({
        alertTitle: title,
        alertContent: content,
        alertAccept: onAccept,
      })
    }
    this.setState({
      alertOpen: !alertOpen,
    })
  }

  handleOpen() {this.setState({ open: true })}

  handleClose() {this.setState({ open: false })}

  handleChange(e) {this.setState({ [e.target.name]: e.target.value })}

  handleSubmit(e) {
    e.preventDefault()
    this.resetPassword()
  }

  resetPassword() {
    this.props.setLoading(true)
    const { email } = this.state
    serviceResetPassword(
      { email },
      () => this.toggleAlert('Rücksetzung des Passworts beantragt', 'Ein Link zum Zurücksetzen Ihres Passworts wurde an Ihre E-Mail-Adresse gesendet.', this.handleClose),
      (msg) => this.toggleAlert('Rücksetzung des Passworts fehlgeschlagen', `Ihr Passwort konnte nicht zurückgesetzt werden. ${msg ?? 'Bitte überprüfen Sie die eingegebene Benutzerkennung'}.`, null),
    )
  }

  render() {
    const {
      open, email, alertTitle, alertContent, alertAccept, alertOpen,
    } = this.state
    return (
      <div>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          open={open}
          onClose={this.handleClose}
          style={{ padding: '100px 0 20px' }}
        >
          <Grow in={open}>
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
                  Passwort zurücksetzen
                </Typography>
                <Typography variant="body1">
                  Bitte geben Sie Ihre Benutzerkennung (E-Mail) ein, um Ihr Passwort zurückzusetzen.
                </Typography>
                <Divider />
                <FormControl style={{ width: '100%' }}>
                  <form onSubmit={this.handleSubmit}>
                    <TextField
                      style={{ width: '100%' }}
                      variant="standard"
                      name="email"
                      aria-label="Benutzername/E-Mail"
                      label="Benutzername"
                      value={email}
                      onChange={this.handleChange}
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
                        Passwort zurücksetzen
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
          toggle={((title, content, onAccept) => this.toggleAlert(title, content, onAccept))}
        />
      </div>
    )
  }
}

ResetPasswordModal.propTypes = {
  setLoading: PropTypes.func.isRequired,
}

export default ResetPasswordModal
