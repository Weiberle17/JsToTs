import { Clear } from '@mui/icons-material'
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import InputLegacy from './InputLegacy'

/*
 * {
 * key: Feldname in JSON
 * label: Feldbezeichnung in Oberfläche
 * value: Default-Wert (default: '')
 * required: Wenn Pflichtfeld: true
 * type: Feldtyp (z.B. date, email)
 * inputType: (z.B. Checkbox, radio)
 * options: Optionen, nur für Radio, Dropdown etc. angeben
 * error: Nur angeben, wenn Fehler im Feld angezeigt werden (default: false)
 * helperText: Nur angeben, wenn Fehler im Feld angezeigt werden (default: '')
 * },
 * */

function ObjectRow({ idx, row, handleChange, remove }) {
  return (
    <TableRow key={idx} style={{ verticalAlign: 'top' }}>
      {
        // Felder des field-Array des row-Objekts auf Tabellenzellen mit Inputs mappen
        row.fields.map((field, fidx) => {
          return (
            <TableCell key={`${idx}-${fidx}`} style={{ verticalAlign: 'center' }}>
              <form autoComplete="off">
                <InputLegacy
                  idx={idx}
                  field={field}
                  handleChange={handleChange}
                />
              </form>
            </ TableCell>
          )
        })
      }
      {
        // Button zum Löschen der Zeile hinzufügen, wenn remove-Funktion existiert
        remove != null && !row.permanent && (
          <TableCell padding="checkbox">
            <Tooltip title="Zeile löschen" placement="left">
              <IconButton
                color="secondary"
                aria-label="Zeile entfernen"
                onClick={remove}
                size="large"
                sx={{ marginTop: 2 }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </TableCell>
        )
      }
    </TableRow>
  )
}

ObjectRow.propTypes = {
  idx: PropTypes.number.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.array.isRequired,
    permanent: PropTypes.bool,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  remove: PropTypes.func,
}

ObjectRow.defaultProps = {
  remove: null,
}

export default ObjectRow
