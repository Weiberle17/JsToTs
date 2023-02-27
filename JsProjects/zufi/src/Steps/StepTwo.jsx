import {Box, Button, Grid, Paper, styled, Typography} from '@mui/material'
import FormButtons from '../Components/FormButtons'
import {createText} from '../Components/Input'
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import {Portrait} from "@mui/icons-material";
import jsonData from '../Resources/json/mockBuerger.json'
import MainButton from "../Components/MainButton";

const BigButton = styled(LoadingButton)({
  backgroundColor: '#F0AF00',
  fontSize: 24,
})

const StepTwo = ({block, step, boxStyle, foundService, nextStep, prevStep}) => {
  const [ausweisdata, setAusweisdata] = useState(null)
  const [loading, setLoading] = useState(false)

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
        <Grid container justifyContent='center'>
          <MainButton
            sx={{height: '200px', marginLeft: 1}}
            loading={loading}
            btnAction={() => {
              setLoading(true)
              setTimeout(() => {
                setAusweisdata(jsonData)
                setLoading(false)
              }, 2000)
            }}
            title='E-Ausweisdaten abrufen'
          />
        </Grid>
        {
          ausweisdata && block?.services?.find((service) => service.name === foundService)?.fields?.map((field, idx) =>
            <Box sx={{margin: 1}} key={`${step}-${idx}`}>
              <Typography>
                {field.label}: {ausweisdata[field.key]}
              </Typography>
            </Box>
          )
        }
      </Box>
      <FormButtons
        primaryFunction={nextStep}
        primaryFunctionName={'nächster Schritt'}
        cancelFunction={prevStep}
        disabled={!ausweisdata}
      />
    </>
  )
}

export default StepTwo
