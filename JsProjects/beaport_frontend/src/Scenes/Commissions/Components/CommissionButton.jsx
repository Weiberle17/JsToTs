import { Business, Euro, House, LocalDrink, Pets } from '@mui/icons-material'
import { Card, CardActionArea, CardContent, Fade, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { parseDeadline } from '../../../Services/parser'

// TODO: Updaten und auf andere Files anwenden
/**
 * Component um den Status der Beauftragungen (Commissions) anzuzeigen.
 *
 * @component
 * @example
 * return (
 *  <CommissionButton
 *    einnahmeart="prj_wasser"
 *    deadline="0105"
 *    completed={1}
 *    count={2}
 *  />
 * )
 */

function CommissionButton({ einnahmeart, blocks, pos, disabled }) {
  const countCompleted = (blocks) => {
    let completedCount = 0
    let count = 0
    const ignoreKeys = ['arhiv', 'id', 'einnahmeart', 'ags', 'okz', 'lastuser', 'lastupdate']
    let prevKey
    blocks.forEach((block) => {
      if (block.editable || block.completed) {
        const { fields } = block
        Object.keys(fields).forEach((key) => {
          if (!key.startsWith(prevKey) && !ignoreKeys.includes(key)) {
            if (!(key.startsWith('jaso_') && !key.endsWith('_bescheide'))) {
              count += 1
              // TODO: Zweiter Teil nur bei Checkboxen, ggf. durch parseInt-Methode ersetzen (siehe InputLegacy:~250)
              if (!!fields[key] && fields[key] !== '0') {
                completedCount += 1
              }
              console.log('Counted:', key, fields[key])
              prevKey = key
            }
          }
        })
      }
    })
    return { completedCount, count }
  }

  const { pathname } = useLocation()
  const toPath = `${pathname}/${einnahmeart.split('_')[1]}`

  const { completedCount, count } = countCompleted(blocks)
  const completed = blocks.filter(b => b.completed)
  const editable = blocks.filter(b => b.editable && !b.completed)
  const deadline = editable.length !== 0 ? editable[0].frist : (completed.length !== 0 ? completed[completed.length - 1].frist : null)
  let deadlineString = ''
  let bezeichnung

  const iconStyle = { fontSize: 50, marginTop: 40 }
  let icon
  let btnColor = '#003A40'

  switch (einnahmeart.toLowerCase()) {
    case 'prj_gba':
      bezeichnung = 'Grundsteuer'
      icon = <House style={iconStyle} />
      break
    case 'gba':
      bezeichnung = 'Grundbesitzangaben'
      icon = <House style={iconStyle} />
      break
    case 'prj_gews':
    case 'gews':
      bezeichnung = 'Gewerbesteuer'
      icon = <Business style={iconStyle} />
      break
    case 'prj_hund':
    case 'hund':
      bezeichnung = 'Hundesteuer'
      icon = <Pets style={iconStyle} />
      break
    case 'prj_sein':
    case 'sein':
      bezeichnung = 'Sonstige Einnahmen'
      icon = <Euro style={iconStyle} />
      break
    case 'prj_wasser':
    case 'wasser':
      bezeichnung = 'Wasser/Abwasser'
      icon = <LocalDrink style={iconStyle} />
      break
    default:
      bezeichnung = 'Unbekannt'
      icon = null
  }

  if (deadline) {
    const result = parseDeadline(deadline)
    deadlineString = result.deadlineString
    const daysLeft = result.daysLeft
    if (daysLeft < 11) {
      btnColor = daysLeft < 6 ? '#DE3400' : '#F0AF00'
    }
    deadlineString += daysLeft >= 0 ? ` (${daysLeft} Tag${daysLeft === 1 ? '' : 'e'} übrig)` : ' (Frist überschritten)'
  }
  if (editable.length === 0) {
    btnColor = '#00965E'
  }

  let buttonStyle = { backgroundColor: btnColor, color: 'white', height: '100%' }

  const button = (
    <Card style={buttonStyle}>
      <CardActionArea style={{ height: '100%' }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {icon}
          <CardContent>
            <Typography gutterBottom variant="h6" align="center">
              {bezeichnung}
            </Typography>
            {
              count > 0 && (
                <Typography align="center">Fortschritt: {completedCount}/{count}</Typography>
              )
            }
            {
              deadlineString.length > 0 && (
                <Typography align="center">Fällig am: {deadlineString}</Typography>
              )
            }
          </CardContent>
        </Grid>
      </CardActionArea>
    </Card>
  )

  const displayedButton = (
    disabled
      ? (
        // TODO: Animation überprüfen (beginnt nicht nur später sondern geht auch länger)
        <Fade in {...({ timeout: 250 * pos })}>
          {button}
        </Fade>
      ) : (
        <Fade in {...({ timeout: 250 * pos })}>
          <Link to={toPath}>
            {button}
          </Link>
        </Fade>
      )
  )

  return (
    <Grid item xs={12} sm={6} md={4}>
      {displayedButton}
    </Grid>
  )
}

CommissionButton.propTypes = {
  /** Das Kürzel der Einnahmeart der Beauftragung */
  einnahmeart: PropTypes.string.isRequired,
  /** Alle Fragenblöcke der Einnahmeart */
  blocks: PropTypes.array.isRequired,
  /** Dient für eine Animation beim Aufrufen der Seite */
  pos: PropTypes.number,
  /** Deaktiviert den Button */
  disabled: PropTypes.bool,
}

CommissionButton.defaultProps = {
  pos: 1,
  disabled: false,
}

export default CommissionButton
