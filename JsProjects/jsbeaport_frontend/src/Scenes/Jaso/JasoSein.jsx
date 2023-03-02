import { Clear, Done, Edit, PendingActions, Save, Send, Visibility } from '@mui/icons-material'
import { Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import LoadingModal from '../../Components/Loading/LoadingModal'
import MainTemplate from '../../Components/Templates/MainTemplate'
import { serviceGetOverview, serviceSendCommission } from '../../Services/submitData'
import FormLayout from '../../Components/Layout/FormLayout'
import Input from "../../Components/Input/Input"

function CustomAvatar({ status }) {
  let icon = <Clear />
  let bgcolor = '#DE3400'
  const test = true

  switch (status) {
    case '10':
      icon = test ? <PendingActions /> : <Edit />
      bgcolor = '#F0AF00'
      break
    case '100':
      icon = <Done />
      bgcolor = '#00965E'
  }
  return (<Avatar sx={{ bgcolor }}>
    {icon}
  </Avatar>)
}

function JasoSein() {
  const [einnahmearten, setEinnahmearten] = useState([])
  const [isComplete, setComplete] = useState(false)
  // const [sortierung, setSortierung] = useState(null)
  const [abgeschlossen, setAbgeschlossen] = useState(false)

  const templateRef = useRef()
  const inputRef = useRef()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navigateToEinnahmeart = (ea) => {
    navigate(`${pathname}/${ea}`)
  }

  useEffect(() => {
    serviceGetOverview().then((res) => {
      // TODO: Dynamisch und Einnahmeart aus Pathname holen
      const jasoBeauftragung = res.beauftragungen.filter((obj) => obj.einnahmeart.endsWith('SEIN_JASO'))[0]
      let complete = true
      let finished = true
      let sort = null
      jasoBeauftragung.einnahmearten.filter(ea => ea.faktura !== '1').forEach(ea => {
        if (ea.status !== '100') {
          complete = false
        }
        if (ea.sortierung) {
          sort = ea.sortierung
        }
        if (ea.status_alle !== '100') {
          console.log(ea.status_alle)
          finished = false
        }
      })
      setEinnahmearten(jasoBeauftragung.einnahmearten.filter((ea) => ea.faktura !== '1'))
      setComplete(complete)
      inputRef.current.setValue(sort)
      setAbgeschlossen(finished)
    })
  }, [])

  const getData = () => {
    return {
      einnahmeart: 'PRJ_SEIN',
      jaso_data: true,
      jaso_sortierung: inputRef.current.getValue().sortierung
    }
  }

  const submitData = () => {
    if (inputRef.current.isCompleted()) {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Wollen Sie die Beauftragung absenden?', () => sendCommissionService(true))
    } else {
      templateRef.current.toggleAlert('Beauftragung absenden', 'Bitte füllen Sie alle Felder.')
    }
  }

  const sendCommissionService = (submit = false) => {
    templateRef.current.setLoading(true)
    serviceSendCommission(getData(),
      successFunction,
      failureFunction,
      submit)
  }

  const successFunction = (hasCancel) => {
    templateRef.current.setLoading(false)
    templateRef.current.successFunction('Daten erfolgreich gespeichert.', hasCancel)
  }

  const failureFunction = (msg) => { templateRef.current.failureFunction(msg) }

  return (
    <MainTemplate ref={templateRef}>
      <FormLayout disabled={abgeschlossen} primaryFunction={submitData}>
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 1,
          }}
        >
          <Typography variant="h5" marginBottom={2}>
            Abfragen zur Jahressollstellung - Sonstige Einnahmen
          </Typography>
          <Paper sx={{ padding: 2, margin: 1 }}>
            <Typography>
              Zur Durchführung der Jahressollstellung im Kommunalmaster Steuern und Abgaben (KM-StA) benötigen wir
              Ihre Rückmeldung zu diversen Systemeinstellungen, z.B. Tarifänderungen und Bescheiddruck.
            </Typography>
            <Typography>
              Die Informationen benötigen wir&nbsp;
              <Box fontWeight="fontWeightBold" display="inline">
                getrennt für jede der in den KM-StA übernommenen Einnahmeart
              </Box>
              . Sie können jederzeit die bisher erfassten Angaben über den Button
              <Save style={{ verticalAlign: 'middle' }} /> zwischenspeichern. Ist die Erfassung einer Einnahmeart
              vollständig, schicken Sie sie bitte mit <Send
              style={{ verticalAlign: 'middle' }}
            /> ab.
            </Typography>
            <Typography>
              Beantworten Sie am Ende - wenn alle Einnahmearten vollständig erfasst wurden – noch die Frage zur
              Sortierung (einheitlich für alle Bescheide). Dann können Sie die Erfassung mit <Send
              style={{ verticalAlign: 'middle' }}
            /> für alle Sonstigen Einnahmen abschließen.
            </Typography>
            <Typography>
              Die Daten werden dann automatisiert an uns übertragen. Sie können jederzeit lesend wieder Ihre an uns
              gesendeten Daten überprüfen.
            </Typography>
          </Paper>
          <Paper sx={{ padding: 2, margin: 1 }}>
            <Typography variant="h6">
              Ihre Einnahmearten:
            </Typography>
            {
              einnahmearten.length > 0 && (
                <List>
                  {einnahmearten.map((ea) => (
                    <ListItem
                      key={uuidV4()}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => navigateToEinnahmeart(ea.einnahmeart)}
                        >
                          {
                            ea.status === '100' ? <Visibility /> : <Edit />
                          }
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <CustomAvatar status={ea.status} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={ea.bezeichnung}
                        secondary={ea.einnahmeart}
                      />
                    </ListItem>
                  ))}
                </List>
              )
            }
          </Paper>
          {
            isComplete && (
              <Paper sx={{ padding: 2, margin: 1 }}>
                <Input
                  field={{
                    key: 'sortierung',
                    inputType: 'radio',
                    label: 'Auswahl Sortierung der Bescheide:',
                    options: [
                      {
                        value: 'nach Vertragsgegenstand',
                      },
                      {
                        value: 'nach Adresse (über alle Sonstigen-Einnahmen)',
                      },
                      {
                        value: 'nach Adresse (jeweils neu nach Vertragsgegenstandsart / Einnahmeart getrennt)',
                      },
                    ],
                  }}
                  disabled={abgeschlossen}
                  // onChange={() => setSortierung(inputRef.current.getValue())}
                  ref={inputRef}
                  // onChange={(e) => setSortierung(e.target.value)}
                />
              </Paper>
            )
          }
        </Box>
        <LoadingModal open={einnahmearten.length === 0} />
      </FormLayout>
    </MainTemplate>
  )
}

export default JasoSein