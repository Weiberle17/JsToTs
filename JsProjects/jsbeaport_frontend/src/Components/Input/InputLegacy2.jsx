import {
  Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, Grow, InputAdornment, Link, MenuItem, Paper,
  Radio, RadioGroup, Select, TextField, Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { getServer } from '../../Services/general'
import { roundNumber } from '../../Services/parser'
import { uploadFile } from '../../Services/submitData'
import { textColors } from '../../Services/theme'
import InputTable from './InputTable'
import PasswortRegeln, { getPwdConditions } from './PasswortRegeln'

// TODO: Alles komplett aufräumen und überdenken

const showDependentFields = (selected, path, addRef, isDisabled) => {
  return (
    <Grow in={!!selected?.fields}>
      <Paper sx={{ padding: 1, marginTop: 1 }}>
        <Grid container>
          {
            !!selected?.fields && selected.fields.map((field, fidx) => {
              // const fieldCount = selected.fields.length
              // const size = field.size ?? (fieldCount % 2 !== 0 && fidx === fieldCount - 1) ? 12 : 6
              const size = field.size ?? 12
              // TODO: Ist nur für Fall Preisangabe drin
              const xsSize = !(field.endAdornment === '€') ? size : 3
              const mdSize = !(field.endAdornment === '€') ? size : 1
              const tempPath = path.concat([fidx])
              const key = tempPath.join('-')
              return (
                <Grid
                  key={field.field}
                  item
                  xs={xsSize}
                  md={mdSize}
                  sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                  }}
                >
                  <InputLegacy2
                    ref={inputRef => addRef(key, inputRef)}
                    addRef={addRef}
                    idx={fidx}
                    field={field}
                    parent={field.idx}
                    disabled={isDisabled}
                    path={tempPath}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
    </Grow>
  )
}

// TODO: Weiter Inputmöglichkeiten hinzufügen? (Switch)
const InputLegacy2 = forwardRef(({ field, path, disabled, addRef, onChange, val }, ref) => {
  const [value, setValue] = useState(null)
  const [error, setError] = useState({
    error: false,
    errorText: field.type === 'password' ? (<PasswortRegeln pwdConditions={getPwdConditions('')} />) : (<></>),
  })

  const inputTable = useRef(null)

  useEffect(() => {
    setValue(val ?? field.value)
  }, [val])

  // child ist nur bei select wichtig
  const handleChange = (e, child) => {
    if (onChange) {
      onChange(e)
    } else {
      if (!e.currentTarget) {
        const { checked, value } = child.props
        setValue(field.inputType === 'checkbox' ? checked : value)
      } else {
        const { checked, value } = e.currentTarget

        if (!field.inputType || field.inputType === 'text') {
          checkTextFields(value)
        }

        if (field?.inputType === 'file') {
          let formData = new FormData()
          formData.append('file', e.target.files[0])
          uploadFile(formData, (res) => {
            const fileId = res.files[0].id
            setValue(`${getServer()}/ds?id=${fileId}`)
          }, console.log)
        } else {
          setValue(field.inputType === 'checkbox' ? checked : value)
        }
      }
    }
  }

  const createErrorText = (texts) => {
    return <>{texts.map((text, idx) => <p key={field.key + '-error-' + idx}>{text}</p>)}</>
  }

  const checkTextFields = (newValue) => {
    if (field.type === 'number') {
      if (field.conditions) {
        let errorTexts = []

        if (field.conditions?.max < newValue) {
          errorTexts.push('Der Maximale Wert für dieses Feld berträgt ' + field.conditions.max)
        }
        if (field.conditions?.step === 1) {
          if (newValue.includes(',') || newValue.includes('.')) {
            errorTexts.push('Bitte geben Sie nur ganze Zahlen ein')
          }
        }

        if (errorTexts.length === 0) {
          setError({ error: false, errorText: '' })
        } else {
          setError({ error: true, errorText: createErrorText(errorTexts) })
        }
      }
    } else if (field.type === 'email') {
      const mailRegex = '[A-z0-9!#$%&\'*+/=?^_`{|}~-]+[A-z0-9!#$%&\'*+/=?^_`{|}~.-]*@[A-z0-9-]+\\.[A-z0-9]+'
      if (!!newValue && newValue.match(mailRegex)) {
        setError({ error: false, errorText: '' })
      } else {
        setError({ error: true, errorText: 'Ungültiges E-Mail-Format' })
      }
    } else if (field.type === 'okz') {
      if (!!newValue && newValue.match(/^\d{0,4}$/)) {
        setError({ error: false, errorText: '' })
      } else {
        setError({ error: true, errorText: 'Die OKZ darf nur aus max. 4 Ziffern bestehen' })
      }
    } else if (field.type === 'ags') {
      if (!!newValue && newValue.match(/^\d{6,8}$/)) {
        setError({ error: false, errorText: '' })
      } else {
        setError({ error: true, errorText: 'Der AGS muss aus 6-8 Ziffern bestehen' })
      }
    } else if (field.type === 'password') {
      const pwdConditions = getPwdConditions(newValue)
      const errorText = (<PasswortRegeln pwdConditions={pwdConditions} />)
      const error = !(pwdConditions[0] && pwdConditions.filter(x => x).length >= 4)
      // TODO: eigentlich errorText als String, nicht JSX-Element
      setError({ error, errorText })
    }
  }

  useImperativeHandle(ref, () => ({
    getValue() { return inputTable.current?.getValue() ?? value },
  }))

  // Prüft Typ des Inputs und gibt entsprechende Komponente zurück
  // TODO: InputProps, Labels und Texte vor switch

  const isDisabled = disabled || field.disabled
  const color = isDisabled ? textColors.disabled : textColors.primary
  const typographyProps = { color, marginBottom: 1 }
  // Ermittelt den ausgewählten Wert eines Radio-Buttons
  const selected = field.options?.find((option) => option.value === value)
  const hasFields = field.options?.find((option) => option.fields)

  const createText = (text) => {
    const paragraphs = typeof text === 'string' ? [{ text }] : text
    return paragraphs ? (
      <>
        {
          paragraphs.map(({ text, linkText, linkTo, margin }) => {
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

  const text = createText(field.text)
  const hintText = createText(field.hint)

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
    style: { color },
    error: error.error,
    helperText: error.errorText,
    endAdornment: field.endAdornment,
  }

  switch (field.inputType) {
    case 'table':
      return (
        <InputTable
          fields={field.fields}
          initRows={field.rows}
          addable={field.addable}
          ref={inputTable}
          disabled={isDisabled}
        />
      )
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
                label={<Typography variant="body2" {...{ color }}>{field.label}</Typography>}
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
                        style={{ color }}
                      />}
                      label={
                        <Typography variant="body2" {...{ color }}>{option.value}</Typography>
                      }
                    />
                    {option.text && <Typography variant="body2" sx={{ marginLeft: 4 }}>{option.text}</Typography>}
                  </>
                )
              })}
            </RadioGroup>
          </FormControl>
          {
            hasFields && showDependentFields(selected, path, addRef, isDisabled)
          }
        </>
      )
    // TODO: Funktioniert nicht mit abhöngigen Feldern
    case 'select':
      return <>
        <FormControl
          style={{ width: '100%' }} component="fieldset"
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
          hasFields && showDependentFields(selected, path, addRef, isDisabled)
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
      if (field.type === 'number') {
        inputProps.lang = 'de'
        if (typeof field.value == 'string') {
          field.value = parseFloat(field.value.replace(',', '.'))
        }
        if (field.conditions?.step) {
          inputProps.step = field.conditions.step
          field.value = roundNumber(field.value, field.conditions.step)
        }
        if (field.conditions?.max) {
          inputProps.max = field.conditions.max
        }
      }
      if (field.type === 'date') {
        inputProps.InputLabelProps = { shrink: true }
      }
      return <>
        <TextField
          {...inputProps}
          sx={{ width: '100%' }}
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

InputLegacy2.displayName = 'InputLegacy2'

InputLegacy2.propTypes = {
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
  addRef: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  path: PropTypes.arrayOf(PropTypes.number),
  val: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
}

InputLegacy2.defaultProps = {
  disabled: false,
  path: [],
  onChange: null,
  val: null,
}

export default InputLegacy2
