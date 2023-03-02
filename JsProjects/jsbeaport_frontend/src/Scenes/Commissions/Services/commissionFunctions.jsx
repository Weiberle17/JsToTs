// TODO: ggf. aufräumen, Struktur der JSON-Dateien und/oder Felder anpassen
// TODO: Datablock in JSON so definieren, dass kein fieldset eingetragen ist, sondern es komplett aus der DB kommt
export const applyAnswers = (res, data, einnahmeart) => {
  console.log(einnahmeart)
  console.log(res)
  const newData = { einnahmeart, blocks: [] }
  const { blocks } = res.beauftragungen.find((obj) => obj.einnahmeart === einnahmeart)
  blocks.forEach((block) => {
    const { frist, completed, editable, fieldset, disabled } = block
    const newBlock = { frist, completed, fieldset, disabled: disabled ?? (!editable || completed) }

    const datablock = data.blocks.filter((b) => b.fieldset === block.fieldset)[0] ?? data.blocks[0]
    newBlock.fields = []
    const { fields } = block
    Object.keys(fields).forEach((key) => {
      const splitKey = key.split('_')
      const field = {}
      let parentKey = null
      if (splitKey[0] === 'jaso') {
        const tempKey = splitKey.slice(3).join('_')
        const dataField = datablock.fields.find((obj) => obj.key === tempKey)
        if (dataField) {
          Object.assign(field, dataField)
          field.jasoKey = splitKey[1]
          field.label = dataField.label + ' für Einnahmeart ' + splitKey[2] + ' (' + splitKey[1] + ')'
        }
      } else {
        const tempField = datablock.fields.find((obj) => obj.key === key)
        if (tempField) {
          if (!tempField.nurJaso) {
            Object.assign(field, tempField)
          }
        } else {
          // TODO: Hier wird ein neues Feld angelegt, anstatt Parent zu erweitern
          parentKey = splitKey.slice(0, -1).join('_')
        }
      }

      if (!(Object.keys(field).length === 0)) {
        field.value = field.inputType === 'checkbox' ? !!parseInt(fields[key]) : fields[key]
        if (parentKey) {
          newBlock.fields.find((obj) => obj.key === parentKey).options.find((option) => option.value === fields[parentKey]).fields.find((obj) => {
            if (obj.key === key) {obj.value = field.value}
          })
        } else {
          newBlock.fields.push(field)
          // console.log(field)
        }
      }
    })
    newData.blocks.push(newBlock)
  })
  return newData
}