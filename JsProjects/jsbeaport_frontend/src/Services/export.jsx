import { createSettings, sendRequest } from './general'

// TODO: Namen Exportdateien?
export function getExport(type = '') {
  const path = `/kat/${type}`
  const settings = createSettings('GET', path)
  sendRequest(settings, () => {}, () => console.log('ERROR'), true).then((res) => {
    export2csv(res, `export-${type === 'beauftragungen' ? 'alle-beauftragungen' : type}`)
  })
}

export function getBeaExport(einnahmeart, jaso = false) {
  const data = {
    'action': 'export',
    einnahmeart,
    jaso,
  }
  const settings = createSettings('POST')
  settings.data = JSON.stringify(data)
  sendRequest(settings, () => {}, () => console.log('ERROR'), true).then((res) => {
    export2csv(res, `export-${einnahmeart}${jaso ? '-jaso' : ''}`)
  })
}

export function getEmaillistExport(einnahmeart, jaso = false) {
  const data = {
    'action': 'emaillist',
    einnahmeart,
    jaso,
  }
  const settings = createSettings('POST')
  settings.data = JSON.stringify(data)
  sendRequest(settings, () => {}, () => console.log('ERROR'), true).then((res) => {
    export2csv(res, `${jaso ? 'jaso' : 'bescheide'}-emailliste-${einnahmeart}`)
  })
}

function export2csv(response, filename) {
  const { data: jsondata, meta } = response
  let returnvalue = false
  let csv = ''
  if (jsondata.length > 0) {
    const headCells = []
    if (meta) {
      meta.forEach(fieldData => {
        const { field, title } = fieldData
        headCells.push({ label: title, id: field })
      })
    } else {
      Object.keys(jsondata[0]).forEach(key => {
        headCells.push({ label: key, id: key })
      })
    }
    // Trennzeichen für CSV
    const delimiter = ';'
    // Hier wird definiert, wie der Wert 'null' behandelt wird
    const replacer = (key, value) => (value === null ? '' : value)
    const csvHeader = []
    headCells.forEach((cell) => {
      csvHeader.push(cell.label)
    })
    csv = jsondata.map(row =>
      headCells.map(cell => {
        const value = row[cell.id]
        if (typeof value === 'string' && value?.match('^\\d*\\.\\d\\d$')) {
          return JSON.stringify(value.replace('.', ','), replacer)
        } else {
          return JSON.stringify(value, replacer)
        }
      }).join(delimiter),
    )
    csv.unshift(csvHeader.join(delimiter))
    csv = csv.join('\r\n')
  }
  // Damit UTF-8 Zeichen korrekt angezeigt werden
  const universalBOM = '\uFEFF'
  // Erstellt einen versteckten Link zum Download der CSV-Datei und klickt diesen an, um den
  // Download zu starten
  const hiddenElement = document.createElement('a')
  hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(universalBOM + csv)}`
  hiddenElement.target = '_blank'
  hiddenElement.download = `${filename}.csv`
  hiddenElement.click()
  returnvalue = true
  return returnvalue
}

export default getExport
