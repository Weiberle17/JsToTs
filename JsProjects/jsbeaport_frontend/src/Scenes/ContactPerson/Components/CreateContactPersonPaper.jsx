import { Add } from '@mui/icons-material'
import {
  Fab, Grid, Paper, Slide, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { v4 as uuidV4 } from 'uuid'
import { getNewField } from '../../../Components/Input/InputLegacy'
import ObjectRow from '../../../Components/Input/ObjectRow'

// Maximale Anzahl an Benutzerzeilen in der Tabelle (0 = unbegrenzt)
const userLimit = 20

class CreateContactPersonPaper extends React.Component {
  constructor(props) {
    super(props)
    this.fields = props.fields
    this.state = {
      // Liste der Benutzerfelder, die in der Tabelle dargestellt werden
      users: this.initialContacts(),
      // Gibt an, ob weitere Zeilen hinzugefügt werden können
      usersAddable: true,
    }
    this.getUsers = this.getUsers.bind(this)
    this.addUser = this.addUser.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  initialContacts() {
    const { fields } = this
    const einnahmearten = fields.find((field) => field.key === 'einnahmeart').options
    const initialContacts = []
    einnahmearten.forEach((einnahmeart) => {
      const newFields = fields.map(field => field.key === 'einnahmeart' ? {
        ...field,
        value: einnahmeart,
        disabled: true,
      } : { ...field })
      initialContacts.push({
        id: uuidV4(),
        fields: [...newFields],
        permanent: true,
      })
    })
    console.log(initialContacts)
    return initialContacts
  }

  // Gibt das Benutzerarray aus dem State zurück
  getUsers() {
    const { users: stateUsers } = this.state
    return [...stateUsers]
  }

  getFields() {return this.fields}

  // Fügt dem Array im State Benutzer hinzu
  addUser() {
    this.setState(prevState => ({
      users: [...prevState.users, {
        id: uuidV4(),
        fields: [...this.fields],
      }],
      // Prüft ob Benutzerlimit für diese Seite erreicht ist
      usersAddable: userLimit === 0 || prevState.users.length + 1 < userLimit,
    }))
  }

  // Prüft ob alle Pflichtfelder korrekt gefüllt sind
  isComplete() {
    let complete = true
    const { users } = this.state
    users.forEach((user) => {
      user.fields.forEach((field) => {
        // TODO: Ggf. in InputLegacy.jsx Funktion "isComplete" anlegen, falls Validierung von nicht-Textfeldern
        // komplexer
        if (!!field.required && (!field.value || !!field.error)) {
          complete = false
        }
      })
    })
    return complete
  }

  // Entfernt Benutzer aus Array im State
  removeUser(idx) {
    const { users } = this.state

    this.setState({
      users: [...users.slice(0, idx),
        ...users.slice(idx + 1),
      ],
    })
  }

  // Bearbeitet Felder der Benutzer aus Array im State
  handleChange(e) {
    console.log('handling change')
    const { users } = this.state
    const { newField, fieldIdx, userIdx } = getNewField(e, users, true)

    const fields = [...users[userIdx].fields.slice(0, fieldIdx),
      Object.assign({}, users[userIdx].fields[fieldIdx], newField),
      ...users[userIdx].fields.slice(fieldIdx + 1),
    ]

    this.setState({
      users: [...users.slice(0, userIdx),
        Object.assign({}, users[userIdx], { fields }),
        ...users.slice(userIdx + 1),
      ],
    })
  }

  // Setzt State in Ursprungszustand zurück
  resetPage() {
    this.setState({
      users: this.initialContacts(),
      usersAddable: true,
    })
  }

  render() {
    const { users, usersAddable } = this.state
    const addColspan = this.fields.length + 1
    return (
      <Slide in direction="down">
        <Grid
          item
          xs={12}
          style={{
            height: '100%',
            overflow: 'auto',
            padding: 5,
          }}
        >
          <Paper
            style={{
              height: '100%',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle1">
              Benutzer
            </Typography>
            <div
              style={{
                overflow: 'auto',
                flexGrow: 1,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      Einnahmeart
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      Ansprechpartner
                    </TableCell>
                    <TableCell colSpan={this.fields.length - 4} />
                  </TableRow>
                  <TableRow>
                    {
                      // Zeigt dynamisch alle Feldbezeichnungen die in 'fields' definiert sind an
                      this.fields.map((field) => (
                        <TableCell key={uuidV4()}>{field.label}{!field.required || ' *'}</TableCell>
                      ))
                    }
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    // Zeigt dynamisch alle Felder der Benutzer an
                    // TODO: Einnahmeart-Select ist disabled?
                    users.map((user, idx) => (
                      <ObjectRow
                        key={uuidV4()}
                        idx={idx}
                        row={user}
                        handleChange={this.handleChange}
                        remove={users.length > 1 ? () => this.removeUser(idx) : null}
                        // remove={() => this.removeUser(idx)}
                      />
                    ))
                  }
                </TableBody>
                {
                  usersAddable && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={addColspan} align="center">
                          <Tooltip title="Zeile hinzufügen" placement="bottom">
                            <Fab
                              onClick={this.addUser}
                              aria-label="Zeile hinzufügen"
                            >
                              <Add />
                            </Fab>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )
                }
              </Table>
            </div>
            <Typography color="textSecondary">
              * Pflichtfelder
            </Typography>
          </Paper>
        </Grid>
      </Slide>
    )
  }
}

CreateContactPersonPaper.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      text: PropTypes.string,
      inputType: PropTypes.string,
      endAdornment: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
    }),
  ),
}

export default CreateContactPersonPaper
