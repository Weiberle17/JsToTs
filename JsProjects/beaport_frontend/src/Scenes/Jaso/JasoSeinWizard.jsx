import {Box, Paper, Step, StepButton, Stepper, Typography} from '@mui/material'
import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
import InputLegacy2 from '../../Components/Input/InputLegacy2'
import MainTemplate from '../../Components/Templates/MainTemplate'
import {jsonDeepCopy, pad} from '../../Services/parser'
import {serviceGetOverview, serviceSendCommission} from '../../Services/submitData'
import FormLayout from '../../Components/Layout/FormLayout'
import jsonData from '../../Services/json/beauftragungen/jaso/jasoSein.json'

function JasoSeinWizard() {
  const {einnahmeart} = useParams()

  const [activeStep, setActiveStep] = useState(0)
  const [blocks, setBlocks] = useState(null)
  const [bezeichnung, setBezeichnung] = useState('')
  const [disabled, setDisabled] = useState(true)

  const inputRefs = useRef([])
  const templateRef = useRef()

  useEffect(() => {
    templateRef.current.setLoading(true)
    serviceGetOverview().then((res) => {
      const data = res.beauftragungen.filter((obj) => obj.einnahmeart.endsWith('SEIN_JASO'))[0].einnahmearten.filter((obj) => obj.einnahmeart === einnahmeart)[0]
      setBezeichnung(data.bezeichnung)

      // TODO: KUV_Hinweis-Wert wird nicht angezeigt
      console.log(data)
      setDisabled(data.status === '100')
      applyAnswers(data)
      templateRef.current.setLoading(false)
    })
  }, [])

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  const changeStep = (newStep) => {
    updateState()
    setActiveStep(newStep)
  }

  const applyAnswers = (data) => {
    const tempBlocks = jsonDeepCopy(jsonData)

    Object.keys(data).forEach(key => {
      // TODO: Aufräumen?
      console.log(`${key}: ${data[key]}`)
      const splitKey = key.split('_')
      let tempKey = splitKey[0]
      const updateFields = []

      const tempBlock = tempBlocks.find((block) => block.fields.find((field) => field.key === tempKey))
      let tempField = tempBlock?.fields.find((field) => field.key === tempKey)

      if (splitKey.length > 1) {
        const optionFields = tempField?.options?.filter((option) => option.fields)
        optionFields?.forEach(optionField => {
          tempKey = splitKey.slice(0, 2).join('_')
          tempField = optionField.fields.find((field) => field.key === tempKey)
          if (splitKey[1] === 'table' && tempField) {
            const rows = []
            data[key].forEach((entry) => {
              const row = []
              tempField.fields.forEach((field) => {
                const rowField = jsonDeepCopy(field)
                rowField.value = entry[field.key]
                row.push(rowField)
              })
              rows.push({
                key: uuidV4(),
                fields: row,
              })
            })
            tempField.rows = rows
          } else {
            if (splitKey.length > 2) {
              tempKey = splitKey.slice(0, 3).join('_')
              const optionFields = tempField?.options?.filter((option) => option.fields)
              optionFields?.forEach(optionField => {
                tempField = optionField.fields.find((field) => field.key === tempKey)
                if (splitKey[2] === 'table' && tempField) {
                  const rows = []
                  data[key].forEach((entry) => {
                    const row = []
                    tempField.fields.forEach((field) => {
                      const rowField = jsonDeepCopy(field)
                      rowField.value = entry[field.key]
                      row.push(rowField)
                    })
                    rows.push({
                      key: uuidV4(),
                      fields: row,
                    })
                  })
                  tempField.rows = rows
                } else {
                  updateFields.push(tempField)
                }
              })
            } else {
              updateFields.push(tempField)
            }
          }
        })
      } else {
        updateFields.push(tempField)
      }

      updateFields?.forEach(field => {
        if (field) {
          const newValue = field.inputType === 'checkbox' ? data[key] === '1' : data[key]
          if (newValue) {
            field.value = newValue
          }
        }
      })
    })

    setBlocks(tempBlocks)
  }

  const updateState = () => {
    console.log(blocks)
    const refs = inputRefs.current
    Object.keys(refs).forEach((key) => {
      const value = refs[key]?.getValue()
      const tempBlocks = [...blocks]
      let field = tempBlocks

      key.split('-')?.forEach((index) => {
        console.log(field)
        if (Array.isArray(field)) {
          field = field[index]
        } else if (field.inputType === 'radio') {
          field = field.options.find(option => option.value === field.value).fields?.[index]
        } else {
          field = field.fields[index]
        }
      })

      if (field && !(value === null || value === undefined)) {
        field.value = value
        setBlocks([...tempBlocks])
      }
    })
  }

  const checkFields = (fields) => {
    let completed = true
    fields.forEach(field => {
      if (field.value) {
        if (field.inputType === 'radio') {
          const currentOption = field.options.find(option => option.value === field.value)
          if (currentOption.fields) {
            if (!checkFields(currentOption.fields)) {
              completed = false
            }
          }
        }
      } else {
        completed = false
      }
    })
    return completed
  }

  const checkCompleted = () => {
    let completed = true
    blocks.forEach(block => {
      if (!checkFields(block.fields)) {
        completed = false
      }
    })
    return completed
  }

  const getFieldValues = (fields, data) => {
    fields.forEach(field => {
      // TODO: FIX DIS MESS
      data['jaso_' + field.key] = field.type === 'okz' ? pad(field.value, 4) : (typeof field.value === 'boolean' ? (field.value ? '1' : '0') : field.value)
      if (field.inputType === 'radio' || field.inputType === 'select') {
        const currentOption = field.options.find(option => option.value === field.value)
        if (currentOption?.fields) {
          getFieldValues(currentOption.fields, data)
        }
      }
    })
  }

  const getData = () => {
    const data = {}
    const jasoData = {}

    blocks.forEach(block => {
      getFieldValues(block.fields, jasoData)
    })

    console.log(jasoData)

    data.einnahmeart = 'PRJ_SEIN'
    data['jaso_data'] = true
    data[`jaso_${einnahmeart}`] = jasoData

    return data
  }

  const saveData = () => {
    updateState()
    templateRef.current.toggleAlert('Beauftragung speichern', 'Wollen Sie die Beauftragung zwischenspeichern?', () => sendCommissionService())
  }

  const submitData = () => {
    updateState()
    if (checkCompleted()) {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Wollen Sie die Beauftragung absenden?', () => sendCommissionService(true))
    } else {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Bitte füllen Sie alle Felder.')
    }
  }

  const sendCommissionService = (submit = false) => {
    templateRef.current.setLoading(true)
    const data = getData()
    const successFunction = submit ? successFunctionSubmit : successFunctionSave
    serviceSendCommission(data,
      successFunction,
      failureFunction,
      submit)
  }

  const successFunctionSubmit = (hasCancel) => {
    templateRef.current.setLoading(false)
    templateRef.current.successFunction('Daten erfolgreich gesendet.', hasCancel)
  }

  const successFunctionSave = (hasCancel) => {
    templateRef.current.setLoading(false)
    templateRef.current.successFunction('Daten erfolgreich gespeichert.', hasCancel)
  }

  const failureFunction = (msg) => {
    templateRef.current.failureFunction(msg)
  }

  return (
    <MainTemplate
      ref={templateRef}
    >
      <FormLayout primaryFunction={submitData}
                  saveFunction={saveData}
                  disabled={disabled}>
        <Typography variant="h5" marginBottom={2}>
          Abfragen zur Jahressollstellung - Sonstige Einnahmen - {bezeichnung} ({einnahmeart})
        </Typography>
        <Stepper nonLinear activeStep={activeStep}>
          <Step key={uuidV4()}>
            <StepButton onClick={() => changeStep(0)}>
              Tarifänderung
            </StepButton>
          </Step>
          <Step key={uuidV4()}>
            <StepButton onClick={() => changeStep(1)}>
              Jahresbescheide
            </StepButton>
          </Step>
        </Stepper>
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {
            blocks && blocks[activeStep].fields.map((field, idx) => {
              const key = `${activeStep}-${idx}`
              return (
                <Paper key={key} sx={{padding: 2, margin: 1}}>
                  <InputLegacy2
                    ref={inputRef => addRef(key, inputRef)}
                    addRef={addRef}
                    field={field}
                    path={[activeStep, idx]}
                    disabled={disabled}
                  />
                </Paper>
              )
            })
          }
        </Box>
      </FormLayout>
    </MainTemplate>
  )
}

export default JasoSeinWizard