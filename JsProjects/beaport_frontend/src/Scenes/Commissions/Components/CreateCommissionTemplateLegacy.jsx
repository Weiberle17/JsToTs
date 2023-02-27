import { Step, StepButton, Stepper } from '@mui/material'
import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { getNewField } from '../../../Components/Input/InputLegacy'
import Loading from '../../../Components/Loading/Loading'
import MainTemplate from '../../../Components/Templates/MainTemplate'
import { pad, parseDeadline } from '../../../Services/parser'
import { serviceSendCommission } from '../../../Services/submitData'
import CreateCommissionPaperLegacy from './CreateCommissionPaperLegacy'

class CreateCommissionTemplateLegacy extends React.Component {
  constructor(props) {
    super(props)
    const { data } = props
    const idx = data.blocks.findIndex(block => !block.disabled)
    this.template = React.createRef()
    this.state = {
      // Liste der Eingabefelder, die in der Tabelle dargestellt werden
      blocks: [...data.blocks],
      einnahmeart: data.einnahmeart,
      // Ermittelt Index des ersten nicht deaktivierten Blocks
      activeStep: idx < 0 ? 0 : idx,
    }
    this.handleChange = this.handleChange.bind(this)
    this.saveCommission = this.saveCommission.bind(this)
    this.submitCommission = this.submitCommission.bind(this)
    this.successFunctionSave = this.successFunctionSave.bind(this)
    this.successFunctionSubmit = this.successFunctionSubmit.bind(this)
    this.failureFunction = this.failureFunction.bind(this)
  }

  toggleAlert(title, msg, func) { this.template.current.toggleAlert(title, msg, func) }

  successFunctionSubmit(hasCancel) { this.template.current.successFunction('Beauftragung erfolgreich abgesendet.', hasCancel) }

  successFunctionSave(hasCancel) { this.template.current.successFunction('Beauftragung erfolgreich gespeichert.', hasCancel) }

  failureFunction(msg) { this.template.current.failureFunction(msg) }

  setLoading(loading) { this.template.current.setLoading(loading) }

  saveCommission() {
    const { data } = this.getData()
    this.toggleAlert('Beauftragung speichern', 'Wollen Sie die Beauftragung zwischenspeichern?', () => this.sendCommissionService(data))
  }

  submitCommission() {
    const { complete, data } = this.getData()
    if (complete) {
      this.toggleAlert('Beauftragung absenden', 'Wollen Sie die Beauftragung absenden?', () => this.sendCommissionService(data, true))
    } else {
      this.toggleAlert('Beauftragung absenden', 'Bitte füllen Sie alle Felder.')
    }
  }

  sendCommissionService(data, submit = false) {
    this.setLoading(true)
    const successfunction = submit ? this.successFunctionSubmit : this.successFunctionSave
    serviceSendCommission(data,
      successfunction,
      this.failureFunction,
      submit)
  }

  getData() {
    // TODO: optionfields leeren, wenn option nicht ausgewählt
    const { blocks, activeStep, einnahmeart } = this.state
    const data = {}
    let complete = true
    blocks[activeStep].fields.forEach((field) => {
      if (!field.value || !!field.error) {
        complete = false
      } else {
        if (!!field.options && !!field.value) {
          const optionFields = field.options.find(option => option.value === field.value).fields
          if (optionFields) {
            let optionFieldsNotEmpty = false
            let optionFieldsRadiosCompleted = true
            // Eines der Unterfelder muss einen Wert besitzen
            optionFields.forEach((optionField) => {
              data[optionField.key] = optionField.value
              if (!!optionField.value && !optionField.error) {
                optionFieldsNotEmpty = true
              }
              if (optionField.inputType === 'radio' && !optionField.value) {
                optionFieldsRadiosCompleted = false
              }
            })
            if (!optionFieldsNotEmpty || !optionFieldsRadiosCompleted) { complete = false }
          }
        }
      }
      // Wert wird in data-object eingefügt. Wenn der Typ des Feldes OKZ ist, wird der Wert gepadded. Wenn das Feld
      // einen Boolean-Wert hat, wird dieser in eine 1 bzw. eine 0 umgewandelt.
      let key = field.key
      const value = field.type === 'okz' ? pad(field.value, 4) : (typeof field.value === 'boolean' ? (field.value ? '1' : '0') : field.value)
      if (field.jasoKey) {
        data['jaso_data'] = true
        const jasoObj = {}
        jasoObj[key] = value
        data[`jaso_${field.jasoKey}`] = jasoObj
      } else {
        data[key] = value
      }
      // if (field.type === 'okz') {
      //   data[field.key] = pad(field.value, 4)
      // } else {
      //   data[field.key] = typeof field.value === 'boolean' ? (field.value ? '1' : '0') : field.value
      // }
    })
    data['einnahmeart'] = einnahmeart
    return { complete, data }
  }

  handleChange(e) {
    const { blocks, activeStep } = this.state
    const { fields } = blocks[activeStep]
    const { newField, fieldIdx } = getNewField(e, fields)

    const newFields = [...blocks[activeStep].fields.slice(0, fieldIdx),
      Object.assign({}, blocks[activeStep].fields[fieldIdx], newField),
      ...blocks[activeStep].fields.slice(fieldIdx + 1)]

    this.setState({
      blocks: [...blocks.slice(0, activeStep),
        Object.assign({}, blocks[activeStep], { fields: newFields }),
        ...blocks.slice(activeStep + 1),
      ],
    })
  }

  // TODO: Entfernen/durch Zwischenspeichern ersetzen
  resetPage() {
    this.setState({
      blocks: [...this.props.data],
    })
  }

  handleStep(idx) {
    this.setState({
      activeStep: idx,
    })
  }

  getStepper() {
    const { blocks, activeStep } = this.state
    return (
      <Stepper style={{ padding: 8 }} nonLinear activeStep={activeStep}>
        {blocks.map((block, index) => {
          const { deadlineString } = parseDeadline(block.frist)
          // Es werden nur Blöcke angezeigt, die eine Deadline haben
          return deadlineString !== 'Unbekannt' ? (
            <Step key={uuidV4()} completed={block.completed}>
              <StepButton onClick={() => this.handleStep(index)}>
                Fällig bis: {deadlineString}
              </StepButton>
            </Step>
          ) : null
        })}
      </Stepper>
    )
  }

  getActiveBlock() {
    const { blocks, activeStep } = this.state
    console.log(activeStep)
    return blocks[activeStep]
  }

  render() {
    const { defaultSize } = this.props
    const activeBlock = this.getActiveBlock()
    const stepper = this.getStepper()
    return (
      <MainTemplate
        primaryFunc={this.submitCommission}
        secondaryFunc={this.saveCommission}
        ref={this.template}
      >
        <Suspense fallback={<Loading />}>
          <CreateCommissionPaperLegacy
            fields={activeBlock.fields}
            handleChange={this.handleChange}
            defaultSize={defaultSize}
            disabled={activeBlock.disabled}
            stepper={stepper}
          />
        </Suspense>
      </MainTemplate>
    )
  }
}

CreateCommissionTemplateLegacy.propTypes = {
  defaultSize: PropTypes.number,
  data: PropTypes.object.isRequired,
}

CreateCommissionTemplateLegacy.defaultProps = {
  defaultSize: 4,
}

export default CreateCommissionTemplateLegacy
