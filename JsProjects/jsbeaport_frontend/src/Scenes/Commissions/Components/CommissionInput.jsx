import { Grid, Paper } from '@mui/material'
import React from 'react'
import InputLegacy from '../../../Components/Input/InputLegacy'

function CommissionInput({ idx, field, size, handleChange, disabled }) {
  return (
    <Grid
      item
      xs={12}
      md={size === 6 ? 6 : 12}
      lg={size}
    >
      <Paper
        style={{
          padding: 10,
          height: '100%',
        }}
      >
        <InputLegacy
          idx={idx}
          key={idx}
          field={field}
          handleChange={handleChange}
          disabled={disabled}
        />
      </Paper>
    </Grid>
  )
}

export default CommissionInput
