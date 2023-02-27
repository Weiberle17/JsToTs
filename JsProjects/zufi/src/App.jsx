import { CssBaseline, Grid, Paper, Step, StepButton, Stepper, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import CustomAppBar from './Components/CustomAppBar'
import CustomForm from './Components/CustomForm'
import theme from './Services/theme'
import jsonData from './Resources/json/form.json'

function App() {
  const [step, setStep] = useState(0)

  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CustomAppBar />
          <main role="main">
            <div
              style={{
                position: 'absolute',
                inset: '75px 0 0',
                overflow: 'hidden',
                padding: 8,
                height: 'auto',
              }}
            >
              <Grid container justifyContent="center" height="100%" width="100%">
                <Grid
                  item
                  xs={12}
                  md={8}
                  lg={6}
                  sx={{
                    height: '100%',
                    overflow: 'auto',
                    padding: 1,
                  }}
                >
                  <Paper
                    sx={{
                      height: '100%',
                      paddingTop: 2,
                      paddingX: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Stepper activeStep={step}>
                      {
                        jsonData.map((block, idx) => (
                            <Step>
                              <StepButton onClick={() => setStep(idx)}>
                                {block.label}
                              </StepButton>
                            </Step>
                          ),
                        )
                      }
                    </Stepper>
                    <CustomForm blocks={jsonData} step={step} setStep={setStep} />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </main>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
