import { Box, Paper, Typography } from '@mui/material'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import MainTemplate from "./MainTemplate"
import FormLayout from "../Layout/FormLayout"

const FormTemplate = forwardRef(({title, introText, submitFunction, saveFunction, disabled, children}, ref) => {
  const templateRef = useRef()

  useImperativeHandle(ref, () => ({
    setLoading: (isLoading) => templateRef.current.setLoading(isLoading),
    toggleAlert: (title, content, onAccept, hasCancel = true) => templateRef.current.toggleAlert(title, content, onAccept, hasCancel),
    successFunction: (msg, hasCancel = true) => templateRef.current.successFunction(msg, hasCancel),
    failureFunction: (msg) => templateRef.current.failureFunction(msg)
  }))

  return (
    <MainTemplate ref={templateRef}>
      <FormLayout
        primaryFunction={submitFunction}
        saveFunction={saveFunction}
        disabled={disabled}
      >
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 1,
          }}
        >
          <Typography variant="h5" marginBottom={2}>
            {title}
          </Typography>
          {
            introText && (
              <Paper sx={{ padding: 2, margin: 1 }}>
                {introText}
              </Paper>
            )
          }
          {children}
        </Box>
      </FormLayout>
    </MainTemplate>
  )
})

FormTemplate.displayName = 'FormTemplate'

export default FormTemplate
