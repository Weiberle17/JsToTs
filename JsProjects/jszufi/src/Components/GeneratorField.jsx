import {Box, Typography} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react"


const GeneratorField = forwardRef(({label, fieldName, generatorFunction, onChange}, ref) => {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange()
    }
  }, [value, onChange])

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCompleted: () => !!value,
  }))

  return (
    <Box sx={{display: 'flex'}}>
        <Typography sx={{flexGrow: 1, margin: 'auto'}}>
          {label}: {value ?? `kein ${fieldName} generiert`}
        </Typography>
        <LoadingButton
          sx={{width: '350px', marginLeft: 1}}
          variant="contained"
          loading={loading}
          loadingPosition="end"
          onClick={async () => {
            setLoading(true)
            setTimeout(() => {
              setValue(generatorFunction())
              setLoading(false)
            }, 500)
          }}
        >
          {fieldName} generieren
        </LoadingButton>
      </Box>
  )
})

export default GeneratorField
