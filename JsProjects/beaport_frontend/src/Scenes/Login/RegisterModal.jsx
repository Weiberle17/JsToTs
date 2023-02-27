import { Button, Divider, FormControl, Grid, Grow, Modal, Paper, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import AlertDialog from '../../Components/Dialogs/AlertDialog'
import InputLegacy, { getNewField } from '../../Components/Input/InputLegacy'
import { formatValues } from '../../Services/parser'
import { serviceSelfRegisterUser } from '../../Services/submitData'
import userFields from '../../Services/json/userFields.json'

class RegisterModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      fields: [...userFields],
      alertTitle: '',
      alertContent: '',
      alertOpen: false,
      alertAccept: null,
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleAlert = this.toggleAlert.bind(this)
    this.successFunction = this.successFunction.bind(this)
    this.failureFunction = this.failureFunction.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  toggleAlert(title, content, onAccept = null) {
    const { alertOpen } = this.state
    if (title != null) {
      this.setState({
        alertTitle: title,
        alertContent: content,
        alertAccept: onAccept,
      })
    }
    this.setState({ alertOpen: !alertOpen })
  }

  handleOpen() {this.setState({ open: true })}

  handleClose() {this.setState({ open: false })}

  handleChange(e) {
    const { fields } = this.state
    const { newField, fieldIdx } = getNewField(e, fields)

    this.setState({
      fields: [...fields.slice(0, fieldIdx),
        Object.assign({}, fields[fieldIdx], newField),
        ...fields.slice(fieldIdx + 1),
      ],
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.register()
  }

  isComplete(fields) {
    let complete = true
    fields.forEach((field) => {
      if (field.required) {
        if (!field.value || !!field.error) {
          complete = false
        }
      }
    })
    return complete
  }

  successFunction() {
    this.props.setLoading(false)
    this.toggleAlert('Registrierung abgeschlossen', 'Bitte warten Sie, bis Ihr Account genehmigt wird.')
    this.handleClose()
  }

  // TODO: Fehlermeldung wird nicht angezeigt
  failureFunction(msg) {
    this.props.setLoading(false)
    this.toggleAlert('Registrierung fehlgeschlagen', msg)
  }

  register() {
    this.props.setLoading(true)
    const { fields } = this.state
    if (this.isComplete(fields)) {
      const userJson = {}
      formatValues(userJson, fields)
      serviceSelfRegisterUser(userJson, this.successFunction, this.failureFunction)
    } else {
      this.failureFunction('Bitte füllen Sie alle Pflichtfelder.')
    }
  }

  render() {
    const {
      open, fields, alertTitle, alertContent, alertAccept, alertOpen,
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
                <Typography variant="h6" id="modal-title">
                  Registrierung
                </Typography>
                <Typography variant="body1" id="modal-description">
                  Bitte füllen Sie die folgenden Felder um sich zu registrieren.
                </Typography>
                <Divider />
                <FormControl style={{ width: '100%', overflow: 'auto' }}>
                  <form onSubmit={this.handleSubmit}>
                    {
                      // TODO: Fields zu InputLegacy konvertieren? Field hat kein "text"
                      fields.map((field, fIdx) => <InputLegacy
                          idx={fIdx}
                          key={field.key}
                          field={field}
                          handleChange={this.handleChange}
                        />,
                      )
                    }
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
                        Registrieren
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

RegisterModal.propTypes = {
  setLoading: PropTypes.func.isRequired,
}

export default RegisterModal
