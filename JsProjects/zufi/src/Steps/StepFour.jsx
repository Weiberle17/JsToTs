import {Box, Paper, Typography} from '@mui/material'
import {useState} from 'react'
import FormButtons from '../Components/FormButtons'
import {createText} from '../Components/Input'
import {Search} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";

const StepFour = ({block, boxStyle, foundService, nextStep, prevStep}) => {
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(false)

  const {fields} = block?.services?.find((service) => service.name === foundService)

  const addValue = (id, value) => {
    values[id] = value
    setValues(values)
  }

  return (
    <>
      <Box
        sx={boxStyle}
      >
        {
          block.text && (
            <Paper sx={{padding: 2, margin: 1}}>
              {createText(block.text)}
            </Paper>
          )
        }
        {
          fields.length === 1 && fields?.map((field, idx) =>
            <Box sx={{margin: 1}} key={`step-4-${idx}`}>
              <Box sx={{display: 'flex'}}>
                <Typography sx={{flexGrow: 1, margin: 'auto'}}>
                  Ermittelter {field.label}: {values[idx] ?? 'kein Wert abgerufen'}
                </Typography>
                <LoadingButton
                  sx={{width: '350px', marginLeft: 1}}
                  variant="contained"
                  loading={loading}
                  loadingPosition="end"
                  onClick={async () => {
                    setLoading(true)
                    setTimeout(() => {
                      addValue(idx, field.value)
                      setLoading(false)
                    }, 2000)
                  }}
                  endIcon={<Search/>}
                >
                  Angaben einholen
                </LoadingButton>
              </Box>
            </Box>
          )
        }
        {
          fields.length > 1 && (
            <>
              {fields?.map((field, idx) =>
                <Box sx={{margin: 1}} key={`step-4-${idx}`}>
                  <Box sx={{display: 'flex'}}>
                    <Typography sx={{flexGrow: 1, margin: 'auto'}}>
                      {field.label}: {values[idx] ?? 'kein Wert abgerufen'}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box sx={{display: 'flex', margin: 1, justifyContent: 'flex-end'}}>
                <LoadingButton
                  sx={{width: '350px', marginRight: 0, alignSelf: 'right'}}
                  variant="contained"
                  loading={loading}
                  loadingPosition="end"
                  onClick={async () => {
                    setLoading(true)
                    setTimeout(() => {
                      fields?.forEach((field, idx) => {
                        addValue(idx, field.value)
                      })
                      setLoading(false)
                    }, 2000)
                  }}
                  endIcon={<Search/>}
                >
                  Angaben einholen
                </LoadingButton>
              </Box>
            </>)
        }
      </Box>
      <FormButtons
        primaryFunction={nextStep}
        primaryFunctionName={'Antrag abschicken'}
        cancelFunction={prevStep}
        disabled={!values[0]}
      />
    </>
  )
}

export default StepFour
