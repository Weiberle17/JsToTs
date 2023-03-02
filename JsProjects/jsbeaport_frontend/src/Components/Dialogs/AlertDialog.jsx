import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import { v4 as uuidV4 } from 'uuid'

/**
 * Component um Dialogfenster anzuzeigen.
 *
 * @component
 * @example
 * let open = true
 * return (
 *  <AlertDialog
 *    open={open}
 *    toggle={() => {console.log('Dialog akzeptiert')}}
 *    onAccept={() => {open = false}}
 *    title="Test-Dialog"
 *    content="Dies ist ein Dialog."
 *    hasCancel={true}
 *  />
 * )
 */

function AlertDialog({ title, content, open, toggle, onAccept, hasCancel }) {
  const toggleAlert = hasCancel ? toggle : onAccept

  const handleAccept = () => {
    onAccept()
    toggle()
  }

  return (
    <Dialog
      open={open}
      onClose={() => toggleAlert()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {content.split('\n').map((i) => <Typography gutterBottom key={uuidV4()}>{i}</Typography>)}
      </DialogContent>
      {
        // Wenn eine onAccept-Funktion definiert und hasCancel true ist, werden Abbrechen und OK angezeigt, sonst nur OK
        // TODO: Cleanup?
        (typeof onAccept === 'function') && hasCancel ? (
          <DialogActions>
            <Button onClick={() => toggleAlert()}>
              Abbrechen
            </Button>
            <Button onClick={handleAccept}>
              OK
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={() => toggleAlert()}>
              OK
            </Button>
          </DialogActions>
        )
      }
    </Dialog>
  )
}

AlertDialog.propTypes = {
  /** Gibt an, ob der Dialog geöffnet ist */
  open: PropTypes.bool,
  /** Funktion um den Dialog zu öffnen und zu schließen */
  toggle: PropTypes.func,
  /** Funktion, die beim Drücken auf "OK" ausgeführt wird */
  onAccept: PropTypes.func,
  /** Titel des Dialogs */
  title: PropTypes.string,
  /** Inhalt des Dialogs */
  content: PropTypes.string,
  /** Gibt an, ob der Dialog einen Abbrechen-Button besitzt */
  hasCancel: PropTypes.bool,
}

AlertDialog.defaultProps = {
  open: false,
  toggle: null,
  onAccept: null,
  title: null,
  content: '',
  hasCancel: true,
}

export default AlertDialog
