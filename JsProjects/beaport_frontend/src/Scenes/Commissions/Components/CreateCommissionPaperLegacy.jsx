import { Box, Grid, Paper, Slide } from '@mui/material'
import React from 'react'
import CommissionInput from './CommissionInput'

function CreateCommissionPaperLegacy({ fields, handleChange, defaultSize, stepper, disabled }) {
  return (
    <Slide in direction="down">
      <Grid
        item
        xs={12}
        style={{
          height: '100%',
          overflow: 'auto',
          padding: 5,
        }}
      >
        <Paper
          style={{
            height: '100%',
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              overflow: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {stepper}
            <Grid container spacing={1} padding={1}>
              {
                fields.map((field, idx) => field.inputType !== 'hidden' && (
                  <CommissionInput
                    key={idx}
                    idx={idx}
                    field={field}
                    size={field.size ?? defaultSize}
                    handleChange={handleChange}
                    disabled={disabled}
                  />
                ))}
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Slide>
  )
}

export default CreateCommissionPaperLegacy
