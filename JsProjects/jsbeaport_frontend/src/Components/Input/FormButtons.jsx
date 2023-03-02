import { Close, Save, Send, SettingsBackupRestore } from '@mui/icons-material'
import PropTypes from 'prop-types'
import React from 'react'
import PrimaryButton from '../Layout/PrimaryButton'
import { useNavigate } from "react-router-dom"

function FormButtons({ primaryFunction, reloadFunction, saveFunction, cancelFunction, disabled, absolute }) {
  const navigate = useNavigate()

  const style = {
    // TODO: Auf Box als sx-Attribut statt so
    paddingTop: 20,
    paddingBottom: 20,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }

  if (absolute) {
    style.position = 'absolute'
    style.padding = 20
  }

  return (
    <div
      style={style}
    >
      <PrimaryButton
        title="Abbrechen"
        mini="true"
        color="secondary"
        onClick={cancelFunction ?? (() => navigate(-1))}
      >
        <Close />
      </PrimaryButton>
      {
        reloadFunction != null && (
          <PrimaryButton title="Seite zurücksetzen" mini="true" onClick={reloadFunction} disabled={disabled}>
            <SettingsBackupRestore color={disabled ? 'default' : 'primary'} />
          </PrimaryButton>
        )
      }
      {
        saveFunction != null && (
          <PrimaryButton title="Zwischenspeichern" mini="true" onClick={saveFunction} disabled={disabled}>
            <Save color={disabled ? 'default' : 'primary'} />
          </PrimaryButton>
        )
      }
      <PrimaryButton
        title="Abschicken"
        color="primary"
        variant="extended"
        onClick={primaryFunction ?? (() => {console.log('Keine Primärfunktion gegeben')})}
        disabled={disabled}
      >
        <Send style={{ marginLeft: 5 }} />
      </PrimaryButton>
    </div>
  )
}

FormButtons.propTypes = {
  primaryFunction: PropTypes.func,
  saveFunction: PropTypes.func,
  reloadFunction: PropTypes.func,
  cancelFunction: PropTypes.func,
  disabled: PropTypes.bool,
  absolute: PropTypes.bool,
}

FormButtons.defaultProps = {
  primaryFunction: null,
  saveFunction: null,
  reloadFunction: null,
  cancelFunction: null,
  disabled: false,
  absolute: false,
}

export default FormButtons
