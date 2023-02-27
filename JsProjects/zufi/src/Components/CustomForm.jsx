import {Box, Typography} from '@mui/material'
import {useEffect, useRef, useState} from 'react'
import StepOne from "../Steps/StepOne";
import StepTwo from "../Steps/StepTwo";
import StepFour from "../Steps/StepFour";
import StepSuccess from "../Steps/StepSuccess";
import StepThree from "../Steps/StepThree";

const CustomForm = ({blocks, step, setStep}) => {
  const [block, setBlock] = useState(blocks[step])
  const [foundService, setFoundService] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    setBlock(blocks[step])
  }, [blocks, step])

  const addRef = (key, inputRef) => {
    inputRefs.current[key] = inputRef
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const boxStyle = {
    overflow: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 1,
  }

  switch (step) {
    case 0:
      return (
        <StepOne
          boxStyle={boxStyle} step={step} block={block}
          primaryFunction={(service) => {
            setFoundService(service)
            nextStep()
          }}
        />
      )
    case 1:
      return (
        <StepTwo
          boxStyle={boxStyle} step={step} block={block} foundService={foundService} addRef={addRef}
          nextStep={nextStep} prevStep={prevStep}/>
      )
    case 2:
      return (
        <StepThree boxStyle={boxStyle} step={step} block={block} foundService={foundService} addRef={addRef}
                   nextStep={nextStep} prevStep={prevStep}/>
      )
    case 3:
      return (
        <StepFour
          boxStyle={boxStyle} step={step} block={block}
          foundService={foundService} addRef={addRef}
          nextStep={nextStep} prevStep={prevStep}
        />
      )
    case 4:
      return (
        <StepSuccess boxStyle={boxStyle}/>
      )
    default:
      return (
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 1,
          }}
        >
          <Typography>
            Kein gültiger Schritt ausgewählt
          </Typography>
        </Box>
      )
  }
}

export default CustomForm
