import { Add, Clear } from '@mui/icons-material'
import {
  Fab, IconButton, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { jsonDeepCopy } from '../../Services/parser'
import { textColors } from '../../Services/theme'
import InputLegacy2 from './InputLegacy2'

const InputTable = forwardRef(({ fields, initRows, addable, disabled }, ref) => {
  const [rows, setRows] = useState(initRows?.length > 0 ? initRows : [{ fields: jsonDeepCopy(fields), key: uuidV4() }])

  const inputRefs = useRef([])

  const color = disabled ? textColors.disabled : textColors.primary

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  useImperativeHandle(ref, () => ({
    getValue() {
      const refs = inputRefs.current
      const refKeys = []
      const values = []
      Object.keys(refs).forEach((key) => {
        const value = refs[key]?.getValue()
        const [refKey, fieldKey] = key.split('#')
        const index = refKeys.indexOf(refKey)

        // TODO: Keine leeren Objekte erstellen
        if (index >= 0) {
          values[index][fieldKey] = value
        } else {
          refKeys.push(refKey)
          values.push({ [fieldKey]: value })
        }
      })
      console.log(values)
      return values
    },
  }))

  const addRow = () => {
    const tempRows = [...rows]
    tempRows.push({ fields: jsonDeepCopy(fields), key: uuidV4() })
    setRows(tempRows)
  }

  const removeRow = (key) => {
    const tempRows = [...rows]
    tempRows.splice(tempRows.findIndex((row) => row.key === key), 1)
    setRows(tempRows)
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {
            fields.map((field) => {
              return (
                <TableCell key={`head-${field.key}`}>
                  <Typography color={color}>
                    {field.label}
                  </Typography>
                </TableCell>
              )
            })
          }
          {
            addable && <TableCell />
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          rows.map((row) =>
            <TableRow key={`row-${row.key}`}>
              {
                row.fields.map((field) => {
                  console.log(field)
                  console.log(disabled)
                  // field.label = null
                  return (
                    <TableCell key={`${row.key}#${field.key}`}>
                      <InputLegacy2
                        ref={inputRef => addRef(`${row.key}#${field.key}`, inputRef)}
                        field={field}
                        disabled={disabled}
                      />
                    </TableCell>
                  )
                })
              }
              {
                addable && <TableCell padding="checkbox">
                  <Tooltip title="Zeile löschen" placement="left">
                    <IconButton
                      color="secondary"
                      aria-label="Zeile entfernen"
                      onClick={() => removeRow(`${row.key}`)}
                      size="large"
                      sx={{ marginTop: 2 }}
                      disabled={disabled}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              }
            </TableRow>,
          )
        }
      </TableBody>
      {
        addable && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={fields.length + 1} align="center">
                <Tooltip title="Zeile hinzufügen" placement="bottom">
                  <Fab
                    onClick={addRow}
                    aria-label="Zeile hinzufügen"
                    disabled={disabled}
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
  )
})

InputTable.displayName = 'InputTable'

export default InputTable
