import {
  Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, Grow, InputAdornment, Link, MenuItem,
  Paper, Radio, RadioGroup, Select, TextField, Typography
} from '@mui/material'
import PropTypes from 'prop-types'
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {v4 as uuidV4} from 'uuid'
import {textColors} from '../Services/theme'
import {getRandomKennzeichen} from "../Services/kennzeichen"
import GeneratorField from "./GeneratorField";

// TODO: Alles komplett aufräumen und überdenken

const showDependentFields = (selected, addRef, onChange, isDisabled) => {
  return (
    <Grow in={!!selected?.fields}>
      <Paper sx={{padding: 1, marginTop: 1}}>
        <Grid container>
          {
            selected?.fields.map((field, fidx) => {
              const inputProps = {
                ref: inputRef => addRef(field.key, inputRef),
                onChange
              }
              // TODO: xs und md sind nur für Fall Preisangabe drin
              return (
                <Grid
                  item
                  key={field.key}
                  xs={!(field.endAdornment === '€') ? (field.size ?? 12) : 3}
                  md={!(field.endAdornment === '€') ? (field.size ?? 12) : 1}
                  sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                  }}
                >
                  {
                    field.inputType === "generatedKfz" ?
                      <GeneratorField {...inputProps} label={field.label} fieldName="Kennzeichen"
                                      generatorFunction={getRandomKennzeichen}/> :
                      <Input
                        {...inputProps}
                        idx={fidx}
                        field={field}
                        disabled={isDisabled}
                      />
                  }
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
    </Grow>
  )
}

export const createText = (text, color = textColors.primary) => {
  const paragraphs = typeof text === 'string' ? [{text}] : text
  return paragraphs ? (
    <>
      {
        paragraphs.map(({text, linkText, linkTo, margin}) => {
          const textSplit = text.split(linkText)
          return (
            <Typography key={uuidV4()} marginBottom={margin ?? 1} color={color} variant="inherit">
              {
                linkText ?
                  [
                    textSplit[0],
                    (<Link key={uuidV4()} color="#F0AF00" href={linkTo}>{linkText}</Link>),
                    textSplit[1],
                  ]
                  :
                  text
              }
            </Typography>
          )
        })
      }
    </>
  ) : null
}

// TODO: Weiter Inputmöglichkeiten hinzufügen? (Switch)
const Input = forwardRef(({field, disabled, onChange, val}, ref) => {
  const [value, setValue] = useState(null)
  // TODO: Evtl. nur Errortext als Statevariable?
  const [error, setError] = useState({
    error: false,
    errorText: (<></>),
  })

  const inputTable = useRef(null)
  const inputRefs = useRef([])

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  // TODO: Nötig?

  useEffect(() => {
    setValue(value ?? val ?? field.value)
  }, [val, field, value])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange()
    }
  }, [value, onChange])

  useImperativeHandle(ref, () => ({
    getValue: () => {
      // TODO: ggf. key als Prop und in valueObject alles als Key-Value-Paare angeben, ohne fields object
      const returnValue = {}
      returnValue[field.key] = inputTable.current?.getValue() ?? value
      const refs = inputRefs.current
      const refKeys = Object.keys(refs)
      if (refKeys.length > 0) {
        refKeys.forEach((key) => {
          if (refs[key]?.getValue()) {
            returnValue[key] = refs[key].getValue()
          }
        })
      }
      return returnValue
    },
    // TODO: ggf. ersetzen durch setValue: (value) => {setValue(value)}
    setValue,
    isCompleted: () => {
      let completed = isCompleted()
      const refKeys = Object.keys(inputRefs.current)
      if (completed && refKeys.length > 0) {
        refKeys.forEach((key) => {
          if (inputRefs.current[key] && !inputRefs.current[key].isCompleted()) {
            completed = false
          }
        })
      }
      return completed
    },
  }))

  // child ist nur bei select wichtig
  const handleChange = (e, child) => {
    if (!e.currentTarget) {
      const {checked, value} = child.props
      setValue(field.inputType === 'checkbox' ? checked : value)
    } else {
      const {checked, value} = e.currentTarget

      if (!field.inputType || field.inputType === 'text') {
        checkTextField(value)
      }

      setValue(field.inputType === 'checkbox' ? checked : value)
    }
  }

  const isCompleted = () => !!(value && !error.error)

  const checkTextField = (newValue) => {
    // TODO: Input custom Validator-Function (oder Validator-Regex-String) mitgeben und hier einbinden
    if (field.type === 'email') {
      const mailRegex = '[A-z0-9!#$%&\'*+/=?^_`{|}~-]+[A-z0-9!#$%&\'*+/=?^_`{|}~.-]*@[A-z0-9-]+\\.[A-z0-9]+'
      if (!!newValue && newValue.match(mailRegex)) {
        setError({error: false, errorText: ''})
      } else {
        setError({error: true, errorText: 'Ungültiges E-Mail-Format'})
      }
    } else if (field.type === 'iban') {
      if (!!newValue && newValue.match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/)) {
        setError({error: false, errorText: ''})
      } else {
        setError({error: true, errorText: 'Die IBAN muss ein gültiges Format haben.'})
      }
    }
  }

  // Prüft Typ des Inputs und gibt entsprechende Komponente zurück
  // TODO: InputProps, Labels und Texte vor switch

  const isDisabled = disabled || field.disabled
  const color = isDisabled ? textColors.disabled : textColors.primary
  const typographyProps = {color, marginBottom: 1}
  // Ermittelt den ausgewählten Wert eines Radio-Buttons
  const selected = field.options?.find((option) => option.value === value)
  const hasFields = field.options?.find((option) => option.fields)

  const text = createText(field.text, color)
  const hintText = createText(field.hint, color)

  // TODO: Auf alles anwenden
  const inputProps = {
    onChange: handleChange,
    label: field.label,
    ariaLabel: field.label,
    field: field.field,
    value: value,
    checked: !!(value),
    required: field.required,
    disabled: isDisabled,
    color: 'primary',
    style: {color},
    error: error.error,
    helperText: error.errorText,
    endAdornment: field.endAdornment,
  }

  switch (field.inputType) {
    case 'checkbox':
      return (
        <>
          <FormControl>
            {
              text
            }
            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  {...inputProps}
                />}
                label={<Typography variant="body2" {...{color}}>{field.label}</Typography>}
              />
            </FormGroup>
            <FormHelperText>{field.helperText}</FormHelperText>
          </FormControl>
        </>
      )
    case 'radio':
      return (
        <>
          <FormControl component="fieldset">
            <Typography {...typographyProps}>{field.label}</Typography>
            {text &&
              <Typography variant={'body1'} {...typographyProps}>{text}</Typography>}
            {hintText &&
              <Typography variant={'body2'} {...typographyProps}>{hintText}</Typography>}
            <RadioGroup
              {...inputProps}
            >
              {field.options.map((option) => {
                return (
                  <>
                    <FormControlLabel
                      key={uuidV4()}
                      value={option.value}
                      control={<Radio
                        color="primary"
                        disabled={isDisabled}
                        style={{color}}
                      />}
                      label={
                        <Typography variant="body2" {...{color}}>{option.value}</Typography>
                      }
                    />
                    {option.text && <Typography variant="body2" sx={{marginLeft: 4}}>{option.text}</Typography>}
                  </>
                )
              })}
            </RadioGroup>
          </FormControl>
          {
            hasFields && showDependentFields(selected, addRef, onChange, isDisabled)
          }
        </>
      )
    // TODO: Funktioniert nicht mit abhöngigen Feldern
    case 'select':
      return <>
        <FormControl
          style={{width: '100%'}} component="fieldset"
        >
          <Typography {...typographyProps}>{field.label}</Typography>
          <Select
            {...inputProps}
            name={field.key}
            disabled={isDisabled}
          >
            {
              // Ermöglicht leere Auswahl, wenn kein Pflichtfeld
              !field.required && (
                <MenuItem
                  value={null}
                ><em>Leer</em></MenuItem>
              )
            }
            {
              field.options.map((option) => (
                <MenuItem
                  key={uuidV4()}
                  value={option.value}
                >
                  {option.text || option.value}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {
          hasFields && showDependentFields(selected, addRef, onChange, isDisabled)
        }
      </>
    case 'file':
      // TODO: Design ggf. anpassen
      return (
        <>
          <Typography {...typographyProps}>{field.label}</Typography>
          {typeof value === 'string' && value.length > 0 && (
            <Link color="#F0AF00" href={val ?? value} rel="noreferrer" target="_blank">Hochgeladene Datei</Link>
          )}
          <input
            aria-label={field.label}
            type={field.inputType}
            required={field.required}
            onChange={handleChange}
            disabled={isDisabled}
          />
        </>
      )
    default:
      if (field.type === 'date') {
        inputProps.InputLabelProps = {shrink: true}
      }
      return <>
        <TextField
          {...inputProps}
          sx={{width: '100%'}}
          variant="standard"
          type={field.type}
          inputProps={inputProps}
          InputProps={{
            endAdornment: <InputAdornment position="end">{inputProps.endAdornment}</InputAdornment>,
          }}
          size="small"
        />
        {text &&
          <Typography variant={'body2'} {...typographyProps}>{text}</Typography>}
      </>
  }
})

Input.displayName = 'Input'

Input.propTypes = {
  field: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        margin: PropTypes.number,
        linkText: PropTypes.string,
        linkTo: PropTypes.string,
      })),
    ]),
    inputType: PropTypes.string,
    isPaper: PropTypes.bool,
    endAdornment: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    options: PropTypes.array,
  }).isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  val: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
}

Input.defaultProps = {
  disabled: false,
  onChange: null,
  val: null,
}

export default Input
