import {Box, Paper} from '@mui/material'
import FormButtons from '../Components/FormButtons'
import Input, {createText} from '../Components/Input'
import {useRef, useState} from "react"

const StepThree = ({block, step, boxStyle, foundService, nextStep, prevStep}) => {
  const [completed, isCompleted] = useState(false)
  const inputRefs = useRef([])

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  const checkCompleted = () => {
    // TODO: Nochmal anschauen
    let complete = true
    Object.keys(inputRefs.current).forEach((key) => {
      const ref = inputRefs.current[key]
      if (ref && !ref.isCompleted()) {
        complete = false
      }
    })
    isCompleted(complete)
  }

  return (
    <>
      <Box
        sx={boxStyle}
      >
        {
          block.text && (
            <Paper sx={{padding: 1, margin: 1}}>
              {createText(block.text)}
            </Paper>
          )
        }
        {
          block?.services?.find((service) => service.name === foundService)?.fields?.map((field, idx) =>
            <Box sx={{margin: 1}} key={`step-${step}-${idx}`}>
              <Input
                ref={(inputRef) => addRef((`${step}-${idx}`), inputRef)}
                field={field}
                onChange={checkCompleted}
              />
            </Box>,
          )
        }
      </Box>
      <FormButtons
        primaryFunction={() => {
          const values = {}
          Object.keys(inputRefs.current).forEach((key) => {
            const value = inputRefs.current[key].getValue()
            console.log(value)
            Object.assign(values, {...values, ...value})
          })
          console.log(values)
          nextStep()
        }}
        primaryFunctionName={'nächster Schritt'}
        cancelFunction={prevStep}
        disabled={!completed}
      />
    </>
  )
}

export default StepThree
