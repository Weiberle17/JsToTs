import { Save, Send } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom"
import Input, { applyAnswers, checkCompleted } from "../../Components/Input/Input"
import { serviceGetOverview, serviceSendCommission } from "../../Services/submitData"
import FormTemplate from "../../Components/Templates/FormTemplate"

function JasoTemplate() {
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
      case '/jaso/gba':
        setEinnahmeart('Grundsteuer')
        buildForm('Gba')
        break
      case '/jaso/gews':
        setEinnahmeart('Gewerbesteuer')
        buildForm('Gews')
        break
      case '/jaso/hund':
        setEinnahmeart('Hundesteuer')
        buildForm('Hund')
        break
      case '/jaso/wasser':
        setEinnahmeart('Wasser/Abwasser')
        buildForm('Wasser')
        break
    }
  }, [])

  const buildForm = (ea) => {
    setEa(ea.toUpperCase())
    import(`../../Services/json/beauftragungen/jaso/jaso${ea}.json`).then((json) => {
      setFields(json.fields)
      templateRef.current.setLoading(true)
      serviceGetOverview().then((res) => {
        const data = res.beauftragungen.filter((obj) => obj.einnahmeart.endsWith(ea.toUpperCase() + '_JASO'))[0]

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
      einnahmeart: 'PRJ_' + ea,
      jaso_data: true
    }
    Object.keys(inputRefs.current).forEach((key) => {
      Object.assign(data, { ...data, ...inputRefs.current[key].getValue('jaso_') })
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
      templateRef.current.toggleAlert('Beauftragung absenden', 'Bitte f??llen Sie alle Felder.')
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

  const IntroText = () => (
    <>
      <Typography>
        Zur Durchf??hrung der Jahressollstellung im Kommunalmaster Steuern und Abgaben (KM-StA) ben??tigen wir
        Ihre R??ckmeldung zu diversen Systemeinstellungen, z.B. Tarif??nderungen und Bescheiddruck.
      </Typography>
      <Typography>
        Die Informationen ben??tigen wir&nbsp;
        <Box fontWeight="fontWeightBold" display="inline">
          getrennt f??r jede der in den KM-StA ??bernommenen Einnahmeart
        </Box>
        . Sie k??nnen jederzeit die bisher erfassten Angaben ??ber den Button
        <Save style={{ verticalAlign: 'middle' }}/> zwischenspeichern.
      </Typography>
      <Typography>
        Schlie??en Sie am Ende - wenn alle Angaben vollst??ndig erfasst wurden - die Erfassung mit <Send
        style={{ verticalAlign: 'middle' }}
      /> ab.
      </Typography>
      <Typography>
        Die Daten werden dann automatisiert an uns ??bertragen. Sie k??nnen jederzeit lesend wieder Ihre an uns
        gesendeten Daten ??berpr??fen.
      </Typography>
    </>
  )

  return (
    <FormTemplate
      title={`Abfragen zur Jahressollstellung - ${einnahmeart}`} introText={IntroText()} submitFunction={submitData}
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

export default JasoTemplate
