import {
  Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputAdornment, MenuItem,
  Radio, RadioGroup, Select, TextField, Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { v4 as uuidV4 } from 'uuid'
import { textColors } from '../../Services/theme'
import PasswortRegeln, { getPwdConditions } from './PasswortRegeln'

// TODO: Alles komplett aufräumen und überdenken

// Ermittelt neue Werte für ein Feld, nachdem es bearbeitet wurde
export const getNewField = (e, data, users = false) => {
  // TODO: Oberen Teil aufräumen? Ja. Mach das. Bitte.
  const { currentTarget } = e
  // const { dataset: parentDataset } = currentTarget.parentElement
  let { id: fieldIdx, parent: parentIdx, key: fieldKey } = currentTarget.parentElement.dataset
  const fieldType = currentTarget.attributes.type ? currentTarget.attributes.type.value : null
  let tempFields = [...data]
  let newField = {}
  let tempField = {}
  // Ohne currentTarget.dataset.value funktionieren Selects nicht
  const newValue = currentTarget.value || currentTarget.dataset.value
  // Ohne ParseInt erhält JavaScript hier einen String statt einer number
  parentIdx = parseInt(parentIdx) >= 0 ? parseInt(parentIdx) : parseInt(currentTarget.dataset.parent)
  fieldIdx = parseInt(fieldIdx)
  // let parentIdx = parseInt(parentDataset.parent)
  // parentIdx = parentIdx >= 0 ? parentIdx : parseInt(currentTarget.dataset.parent)
  // let fieldIdx = parseInt(parentDataset.id)
  const userIdx = fieldIdx
  if (currentTarget.dataset.id) { fieldIdx = parseInt(currentTarget.dataset.id) }

  if (users) {
    tempFields = data[userIdx].fields
    fieldIdx = data[userIdx].fields.findIndex(field => field.key === fieldKey)
  }

  // Prüft beim Feld-Typ 'email' und 'okz' ob ein gültiges Format verwendet wurde
  if (fieldType === 'email') {
    const mailRegex = '[A-z0-9!#$%&\'*+/=?^_`{|}~-]+[A-z0-9!#$%&\'*+/=?^_`{|}~.-]*@[A-z0-9-]+\\.[A-z0-9]+'
    if (!!newValue && newValue.match(mailRegex)) {
      tempField.error = false
      tempField.helperText = ''
    } else {
      tempField.error = true
      tempField.helperText = 'Ungültiges E-Mail-Format'
    }
  } else if (fieldType === 'okz') {
    if (!!newValue && newValue.match(/^\d{0,4}$/)) {
      tempField.error = false
      tempField.helperText = ''
    } else {
      tempField.error = true
      tempField.helperText = 'Die OKZ darf nur aus max. 4 Ziffern bestehen'
    }
  } else if (fieldType === 'ags') {
    if (!!newValue && newValue.match(/^\d{6,8}$/)) {
      tempField.error = false
      tempField.helperText = ''
    } else {
      tempField.error = true
      tempField.helperText = 'Der AGS muss aus 6-8 Ziffern bestehen'
    }
  } else if (fieldType === 'password') {
    const pwdConditions = getPwdConditions(newValue)
    tempField.helperText = (<PasswortRegeln pwdConditions={pwdConditions} />)
    tempField.error = !(pwdConditions[0] && pwdConditions.filter(x => x).length >= 4)
  }

  if (parentIdx >= 0) {
    newField = tempFields[parentIdx]
    const optionIdx = newField.options.findIndex(option => option.value === newField.value)
    const optionField = newField.options[optionIdx].fields[fieldIdx]

    if (tempField.error != null) {
      optionField.error = tempField.error
      optionField.helperText = tempField.helperText
    }

    if (optionField.inputType === 'checkbox') {
      optionField.value = !optionField.value
    } else if (optionField.inputType === 'file') {
      optionField.value = currentTarget.files[0]
    } else {
      optionField.value = newValue
    }
    fieldIdx = parentIdx
  } else {
    if (tempFields[fieldIdx].inputType === 'checkbox') {
      const tempValue = tempFields[fieldIdx].value
      tempField.value = !(typeof tempValue === 'string' ? parseInt(tempValue) : tempValue)
    } else {
      tempField.value = newValue
    }
    newField = tempField
  }
  return { newField, fieldIdx, userIdx }
}

export const fieldToInput = (field, fidx) => {
  const defaultValue = field.inputType === 'autocomplete' ? null : ''
  let input = {
    idx: fidx,
    field: field.key,
    label: field.label,
    value: field.value || defaultValue, // TODO: Prüfen ob Änderung an anderen Stellen Auswirkungen hat
    required: !!field.required,
    type: field.type || 'text',
  }
  if (field.error) { input.error = field.error }
  if (field.helperText) { input.helperText = field.helperText }
  if (field.text) { input.text = field.text }
  if (field.hint) { input.hint = field.hint }
  if (field.inputType) {
    input.inputType = field.inputType
    if (field.inputType === 'checkbox') { input.value = typeof field.value === 'boolean' ? field.value : !!parseInt(field.value) }
  }
  if (field.type === 'date') { input.shrinkLabel = true }
  if (field.options) { input.options = field.options }
  if (field.endAdornment) { input.endAdornment = field.endAdornment }
  return input
}

// TODO: Weiter Inputmöglichkeiten hinzufügen? (Switch)
class InputLegacy extends React.Component {
  render() {
    // Prüft Typ des Inputs und gibt entsprechende Komponente zurück
    // TODO: Labels und Texte vor switch
    const { field, idx, handleChange, parent } = this.props
    const disabled = this.props.disabled || field.disabled
    const input = fieldToInput(field, idx)
    const color = disabled ? textColors.disabled : textColors.primary
    const typographyProps = { color, marginBottom: 1 }
    // Ermittelt den ausgewählten Wert eines Radio-Buttons
    const selected = input.options && input.options.find((option) => option.value === input.value)
    switch (input.inputType) {
      case 'checkbox':
        return (
          <FormControl>
            {
              typeof input.label === 'string' ?
                <Typography {...typographyProps}>{input.label}</Typography> : input.label
            }
            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  color="primary"
                  InputProps={{
                    'data-id': input.idx,
                    'data-parent': parent,
                    'data-key': input.field,
                  }}
                  data-id={input.idx}
                  data-parent={parent}
                  data-key={input.field}
                  field={input.field}
                  checked={input.value}
                  onChange={handleChange}
                  disabled={disabled}
                  style={{ color }}
                />}
                label={<Typography variant="body2" {...{ color }}>{input.text}</Typography>}
              />
            </FormGroup>
            <FormHelperText>{input.helperText}</FormHelperText>
          </FormControl>
        )
      case 'radio':
        return (
          <>
            <FormControl component="fieldset">
              <Typography {...typographyProps}>{input.label}</Typography>
              {input.text &&
                <Typography variant={'body2'} {...typographyProps}>{input.text}</Typography>}
              {input.hint &&
                <Typography variant={'body2'} {...typographyProps}>{input.hint}</Typography>}
              <RadioGroup
                label={input.label}
                aria-label={input.label}
                field={input.field}
                value={input.value}
                onChange={handleChange}
                required={input.required}
              >
                {input.options.map((option) => {
                  return (
                    <>
                      <FormControlLabel
                        key={uuidV4()}
                        value={option.value}
                        control={<Radio
                          data-id={input.idx}
                          data-parent={parent}
                          data-key={input.field}
                          color="primary"
                          disabled={disabled}
                          style={{ color }}
                        />}
                        label={
                          <Typography variant="body2" {...{ color }}>{option.value}</Typography>
                        }
                      />
                      {option.text && <Typography variant="body2" style={{ marginLeft: 32 }}>{option.text}</Typography>}
                    </>
                  )
                })}
              </RadioGroup>
            </FormControl>
            {
              // Zeigt zusätzliche Felder an, die von der Auswahl abhängig sind
              !!selected && !!selected.fields && (
                <Grid container>
                  {
                    selected.fields.map((field, fidx) => {
                      const fieldCount = selected.fields.length
                      const size = field.size ?? (fieldCount % 2 !== 0 && fidx === fieldCount - 1) ? 12 : 6
                      // TODO: Ist nur für Fall Preisangabe drin
                      const xsSize = !field.endAdornment ? size : 3
                      const mdSize = !field.endAdornment ? size : 1
                      return (
                        <Grid
                          key={`${input.idx}-${fidx}`}
                          item
                          xs={xsSize}
                          md={mdSize}
                          style={{
                            padding: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                          }}
                        >
                          <InputLegacy
                            idx={fidx}
                            field={field}
                            parent={input.idx}
                            handleChange={handleChange}
                            disabled={disabled}
                          />
                        </Grid>
                      )
                    })
                  }
                </Grid>
              )
            }
          </>
        )
      case 'select':
        return <FormControl
          style={{ width: '100%' }} component="fieldset"
        >
          <Typography {...typographyProps}>{input.label}</Typography>
          <Select
            label={input.label}
            aria-label={input.label}
            field={input.field}
            value={input.value}
            onChange={handleChange}
            disabled={disabled}
          >
            {
              // Ermöglicht leere Auswahl, wenn kein Pflichtfeld
              !input.required && (
                <MenuItem
                  InputProps={{
                    'data-id': input.idx,
                    'data-parent': parent,
                    'data-key': input.field,
                  }}
                  value={null}
                ><em>Leer</em></MenuItem>
              )
            }
            {
              input.options.map((option) => (
                <MenuItem
                  InputProps={{
                    'data-id': input.idx,
                    'data-parent': parent,
                    'data-key': input.field,
                  }}
                  key={uuidV4()}
                  value={option.value}
                >
                  {option.text || option.value}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      // TODO: Überprüfen
      case 'autocomplete':
        return (
          <Autocomplete
            id="combo-box-demo"
            options={input.options}
            value={input.value}
            getOptionLabel={(option) => option.value}
            style={{ width: '100%' }}
            onChange={handleChange}
            disabled={disabled}
            renderInput={(params) => <TextField
              label={input.label}
              variant="standard"
              InputProps={{
                'data-id': input.idx,
                'data-parent': parent,
                'data-key': input.field,
              }}
              {...params}
            />}
          />
        )
      case 'file':
        // TODO: Design ggf. anpassen
        return (
          <>
            <Typography {...typographyProps}>{input.label}</Typography>
            {typeof input.value === 'string' && input.value.length > 0 && (
              <a href={input.value} rel="noreferrer" target="_blank" style={{ marginBottom: 10 }}>Hochgeladene Datei</a>
            )}
            <input
              aria-label={input.label}
              // InputProps={{
              //   'data-id': input.idx,
              //   'data-parent': parent,
              //   'data-key': input.field,
              // }}
              data-id={input.idx}
              data-parent={parent}
              data-key={input.field}
              type={input.inputType}
              required={input.required}
              onChange={handleChange}
              disabled={disabled}
            />
          </>
        )
      default:
        return <>
          <TextField
            style={{ width: '100%' }}
            variant="standard"
            type={input.type}
            label={input.label}
            aria-label={input.label}
            field={input.field}
            value={input.value}
            onChange={handleChange}
            required={input.required}
            error={input.error}
            helperText={input.helperText}
            InputLabelProps={{
              shrink: input.shrinkLabel,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{input.endAdornment}</InputAdornment>,
              'data-id': input.idx,
              'data-parent': parent,
              'data-key': input.field,
            }}
            size="small"
            // autoComplete="off"
            disabled={disabled}
          />
        </>
    }
  }
}

InputLegacy.propTypes = {
  idx: PropTypes.number.isRequired,
  field: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    text: PropTypes.string,
    inputType: PropTypes.string,
    endAdornment: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  parent: PropTypes.number,
  disabled: PropTypes.bool,
}

InputLegacy.defaultProps = {
  parent: null,
  disabled: false,
}

export default InputLegacy
