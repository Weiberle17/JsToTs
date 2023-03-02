import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import AlertDialog from '../Dialogs/AlertDialog'
import FormButtons from '../Input/FormButtons'
import LoadingModal from '../Loading/LoadingModal'
import { useNavigate } from "react-router-dom"

// TODO: loading als prop?
const MainTemplate = forwardRef(({ primaryFunc, secondaryFunc, secondaryFuncName, onCancel, children }, ref) => {
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    onAccept: null,
    hasCancel: true,
    open: false,
  })
  const [isLoading, setLoading] = useState(false)

  const navigate = useNavigate()

  const toggleAlert = (title, content, onAccept, hasCancel = true) => {
    if (title != null) {
      setAlert({
        title: title,
        content: content,
        onAccept: onAccept,
        hasCancel: hasCancel,
        open: true,
      })
    } else {
      setAlert((prevState) => ({
        title: prevState.title,
        content: prevState.content,
        onAccept: prevState.onAccept,
        hasCancel: prevState.hasCancel,
        open: !prevState.open,
      }))
    }
  }

  useImperativeHandle(ref, () => ({
    setLoading: (isLoading) => {setLoading(isLoading)},
    toggleAlert,
    successFunction: (msg, hasCancel = true) => {
      setLoading(false)
      toggleAlert('Erfolg', msg, () => navigate(-1), hasCancel)
    },
    failureFunction: (msg) => {
      setLoading(false)
      toggleAlert('Fehler', msg, null)
    }
  }))

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: (primaryFunc ? '75px 0 90px' : '75px 0 0'),
          overflow: 'hidden',
          padding: 8,
          height: 'auto',
        }}
      >
        <LoadingModal open={isLoading}/>
        <Grid container justifyContent="center" height="100%" width="100%">
          {children}
        </Grid>
      </div>
      {
        primaryFunc != null && (
          <FormButtons
            primaryFunction={primaryFunc}
            saveFunction={secondaryFuncName === 'Zwischenspeichern' ? secondaryFunc : null}
            reloadFunction={secondaryFuncName === 'Seite zurücksetzen' ? secondaryFunc : null}
            cancelFunction={onCancel}
            absolute
          />
        )
      }
      <AlertDialog
        title={alert.title}
        content={alert.content}
        open={alert.open}
        onAccept={alert.onAccept}
        hasCancel={alert.hasCancel}
        toggle={toggleAlert}
      />
    </>
  )
})

MainTemplate.displayName = 'MainTemplate'

MainTemplate.propTypes = {
  primaryFunc: PropTypes.func,
  primaryFuncName: PropTypes.string,
  secondaryFunc: PropTypes.func,
  secondaryFuncName: PropTypes.string,
  onCancel: PropTypes.func,
  children: PropTypes.node.isRequired,
}

MainTemplate.defaultProps = {
  primaryFunc: null,
  primaryFuncName: 'Abschicken',
  secondaryFunc: null,
  secondaryFuncName: 'Zwischenspeichern',
  onCancel: null,
  children: null,
}

export default MainTemplate
