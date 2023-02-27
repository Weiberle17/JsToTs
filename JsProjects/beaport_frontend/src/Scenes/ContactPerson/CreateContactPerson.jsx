import React from 'react'
import MainTemplate from '../../Components/Templates/MainTemplate'
import { formatValues } from '../../Services/parser'
import { serviceCreateUser } from '../../Services/submitData'
import CreateContactPersonPaper from './Components/CreateContactPersonPaper'
import contactFields from '../../Services/json/contactFields.json'

class CreateContactPerson extends React.Component {
  constructor(props) {
    super(props)
    this.template = React.createRef()
    this.createUserPaper = React.createRef()
    this.fields = contactFields
    this.createUsers = this.createUsers.bind(this)
  }

  toggleAlert(title, msg, func) { this.template.current.toggleAlert(title, msg, func) }

  successFunction(hasCancel) { this.template.current.successFunction('Benutzer erfolgreich angelegt.', hasCancel) }

  failureFunction(msg) { this.template.current.failureFunction(msg) }

  setLoading(loading) { this.template.current.setLoading(loading) }

  createUsers() {
    const createUserPaper = this.createUserPaper.current
    const complete = createUserPaper.isComplete(false)
    this.successFunction(`Pflichtfelder ${!complete ? 'nicht' : ''} korrekt gefüllt`, true)
    const fields = createUserPaper.getFields()
    if (complete) {
      const users = createUserPaper.getUsers()
      const usersJson = {}
      users.forEach((user) => {
        const rolle = this.roleAdmin ? 'RZADMIN' : 'KUNDE'
        const userJson = {
          'action': 'edit',
          rolle,
        }
        formatValues(userJson, user.fields)
        // TODO: Auf push ändern, wenn mehrere Benutzer angelegt werden können
        usersJson.action = userJson
        // usersJson.users.push(userJson)
      })
      let msg = 'Wollen Sie diesen Benutzer erstellen?'
      if (usersJson.length > 1) {
        msg = `Wollen Sie diese ${usersJson.length} Benutzer erstellen?`
      }
      this.toggleAlert('Benutzer erstellen', msg, () => this.createUserService(usersJson.action))
    } else {
      // Prüft, welche Felder Pflichtfelder sind und informiert den Benutzer
      const required = []
      fields.forEach(field => {
        if (field.required) {
          required.push(field.label)
        }
      })
      let msg = `Bitte füllen Sie die Felder ${required.slice(0, -1).join(', ') + ' und ' + required.slice(-1)}.`
      this.toggleAlert('Benutzer erstellen', msg)
    }
  }

  createUserService(action) {
    this.setLoading(true)
    serviceCreateUser(action,
      this.successFunction,
      this.failureFunction)
  }

  render() {
    return (
      <MainTemplate
        primaryFunc={this.createUsers}
        secondaryFunc={() => this.createUserPaper.current.resetPage()}
        secondaryFuncName="Seite zurücksetzen"
        ref={this.template}
      >
        <CreateContactPersonPaper ref={this.createUserPaper} fields={this.fields} />
      </MainTemplate>
    )
  }
}

export default CreateContactPerson
