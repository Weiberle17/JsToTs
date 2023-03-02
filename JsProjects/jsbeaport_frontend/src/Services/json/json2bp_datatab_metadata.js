// Dieses File ist eine Hilfe zum Erstellen der Datenbankeinträge der Tabelle "datatab_metadata" aus den Informationen
// der JSON-Dateien

let data = {} // Hier JSON einfügen
let str = []
data.blocks.forEach((block) => {
  block.fields.forEach((field) => {
    str.push(`${field.key},${field.label},${block.fieldset}`)
    if (field.options) {
      field.options.forEach((option) => {
        if (option.fields) {
          option.fields.forEach((optionField) => {
            str.push(`${optionField.key},${optionField.label},${block.fieldset}`)
          })
        }
      })
    }
  })
})
