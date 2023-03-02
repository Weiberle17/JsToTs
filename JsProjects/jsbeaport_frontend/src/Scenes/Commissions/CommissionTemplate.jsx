import { Paper } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom"
import Input, { applyAnswers, checkCompleted } from "../../Components/Input/Input"
import { serviceGetOverview, serviceSendCommission } from "../../Services/submitData"
import FormTemplate from "../../Components/Templates/FormTemplate"

function CommissionTemplate() {
  const { pathname } = useLocation()

  const [ea, setEa] = useState('')
  const [einnahmeart, setEinnahmeart] = useState('')
  const [fields, setFields] = useState([])
  const [completed, setCompleted] = useState(false)
  const [disabled, setDisabled] = useState(true)

  const inputRefs = useRef([])
  const templateRef = useRef()

  useEffect(() => {
    switch (pathname.toLowerCase()) {
      case '/pre/gba':
        setEinnahmeart('Grundsteuer')
        buildForm('Gba')
        break
      case '/pre/gews':
        setEinnahmeart('Gewerbesteuer')
        buildForm('Gews')
        break
      case '/pre/hund':
        setEinnahmeart('Hundesteuer')
        buildForm('Hund')
        break
      case '/pre/sein':
        setEinnahmeart('Sonstige Einnahmen')
        buildForm('Sein')
        break
      case '/pre/wasser':
        setEinnahmeart('Wasser/Abwasser')
        buildForm('Wasser')
        break
    }
  }, [])

  const buildForm = (ea) => {
    // TODO: Backend und das hier anpassen
    setEa(ea.toUpperCase())
    import(`../../Services/json/beauftragungen/pre/pre${ea}.json`).then((json) => {
      setFields(json.fields)
      templateRef.current.setLoading(true)
      serviceGetOverview().then((res) => {
        console.log(res)
        const data = res.beauftragungen.filter((obj) => obj.einnahmeart.endsWith(ea.toUpperCase()))[0].blocks[0].fields
        console.log(data)

        setDisabled(data?.status === '100')
        applyAnswers(inputRefs.current, data)
        templateRef.current.setLoading(false)
      })
    })
  }

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  const getData = () => {
    const data = {
      einnahmeart: 'PRJ_' + ea
    }
    Object.keys(inputRefs.current).forEach((key) => {
      Object.assign(data, { ...data, ...inputRefs.current[key].getValue() })
    })

    return data
  }

  const saveData = () => {
    templateRef.current.toggleAlert('Beauftragung speichern', 'Wollen Sie die Beauftragung zwischenspeichern?', () => sendCommissionService())
  }

  const submitData = () => {
    if (completed) {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Wollen Sie die Beauftragung absenden?', () => sendCommissionService(true))
    } else {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Bitte füllen Sie alle Felder.')
    }
  }

  const sendCommissionService = (submit = false) => {
    templateRef.current.setLoading(true)
    serviceSendCommission(getData(), submit ? successFunctionSubmit : successFunctionSave, failureFunction, submit)
  }

  const successFunctionSubmit = (hasCancel) => {
    templateRef.current.successFunction('Daten erfolgreich gesendet.', hasCancel)
  }

  const successFunctionSave = (hasCancel) => {
    templateRef.current.successFunction('Daten erfolgreich gespeichert.', hasCancel)
  }

  const failureFunction = (msg) => {
    templateRef.current.failureFunction(msg)
  }

  return (
    <FormTemplate
      title={`Abfragen zur Jahressollstellung - ${einnahmeart}`} submitFunction={submitData}
      saveFunction={saveData} disabled={disabled} ref={templateRef}
    >
      {
        fields?.map((field, idx) => {
          return (
            <Paper key={idx} sx={{ padding: 2, margin: 1 }}>
              <Input
                ref={inputRef => addRef(field.key, inputRef)}
                field={field}
                disabled={disabled}
                onChange={() => setCompleted(checkCompleted(inputRefs.current))}
              />
            </Paper>
          )
        })
      }
    </FormTemplate>
  )
}

export default CommissionTemplate
