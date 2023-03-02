import PropTypes from 'prop-types'
import React from 'react'

const getPwdConditions = (value) => value ? [
  value.length >= 8, // Überprüft, ob das Passwort die Mindestlänge hat
  (/[a-z]/g).test(value), // Überprüft, ob das Passwort Kleinbuchstaben enthält
  (/[A-Z]/g).test(value), // Überprüft, ob das Passwort Großbuchstaben enthält
  (/\d/g).test(value), // Überprüft, ob das Passwort Ziffern enthält
  (/[!~@#$%:;&|,><.+_*?/'"^()\-=[\]{}\\]/g).test(value), // Überprüft, ob das Passwort eines der erlaubten
                                                         // Sonderzeichen enthält
] : [false, false, false, false, false]

function PasswortRegeln({ pwdConditions }) {
  return (
    <p>
      Ihr Passwort muss folgende Regeln erfüllen:
      <ul>
        <li>
          mindestens 8 Zeichen lang {pwdConditions[0] && (<>&#10003;</>)}
        </li>
        <li>
          mindestens 3 der folgenden Anforderungen erfüllen:
          <ul>
            <li>
              Kleinbuchstaben verwenden {pwdConditions[1] && (<>&#10003;</>)}
            </li>
            <li>
              Großbuchstaben verwenden {pwdConditions[2] && (<>&#10003;</>)}
            </li>
            <li>
              Zahlen verwenden {pwdConditions[3] && (<>&#10003;</>)}
            </li>
            <li>
              Sonderzeichen verwenden {pwdConditions[4] && (<>&#10003;</>)}
            </li>
          </ul>
        </li>
      </ul>
    </p>
  )
}

PasswortRegeln.propTypes = {
  pwdConditions: PropTypes.arrayOf(
    PropTypes.bool,
  ),
}

export default PasswortRegeln
export { getPwdConditions }
