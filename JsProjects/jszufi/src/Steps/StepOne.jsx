import {Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography} from '@mui/material'
import {useRef, useState} from 'react'
import {Search} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import Input, {createText} from "../Components/Input";
import FormButtons from "../Components/FormButtons";

const StepOne = ({block, step, boxStyle, primaryFunction}) => {
  const [service, setService] = useState(null)
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  console.log(block)

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
          block.fields && <Box sx={{margin: 1}}>
            <Box sx={{display: 'flex'}}>
              <Input
                ref={inputRef}
                field={block.fields[0]}
              />
              <LoadingButton
                sx={{width: '350px', marginLeft: 1}}
                variant="contained"
                loading={loading}
                loadingPosition="end"
                onClick={async () => {
                  setLoading(true)
                  fetch('http://test/klassifizieren', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({text: inputRef.current.getValue().value})
                  }).then((res) => {
                    if (res.ok) {
                      return res.json();
                    }
                    throw new Error('Something went wrong');
                  })
                    .then((res) => {
                      setService(res.label)
                      setResults(res.results)
                      setLoading(false)
                    })
                    .catch((error) => {
                      console.log(error)
                      setService("Kraftfahrzeug ummelden")
                      setLoading(false)
                    })
                }}
                endIcon={<Search/>}
              >
                Service ermitteln
              </LoadingButton>
            </Box>
            {
              service && (
                <Typography>
                  Ermittelte Leistung: {service}
                </Typography>
              )
            }
            {
              results.length > 0 && (
                <FormControl fullWidth  sx={{marginTop: 2, marginBottom: 2}}>
                <InputLabel id="demo-simple-select-label">Leistungen</InputLabel>
                <Select
                label="Leistungen"
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value)
                }
                }>
                  {
                    results.map((result, idx) => {
                      console.log(result)
                      return (
                        <MenuItem value={idx}>
                          {result.object.name}
                        </MenuItem>
                      )
                    })
                  }
                  <MenuItem value={null}>
                          keine Leistung ausgewählt
                        </MenuItem>
                </Select>
                  </FormControl>
              )
            }
            {
              selected != null && (
                <Typography>
                  {results[selected].object.teaser.replace("<p>", '').replace("</p>",'')}
                </Typography>
              )
            }
          </Box>
        }
      </Box>
      <FormButtons
        primaryFunction={() => {
          primaryFunction(service)
        }}
        primaryFunctionName={'nächster Schritt'}
        disabled={!service}
      />
    </>
  )
}

export default StepOne