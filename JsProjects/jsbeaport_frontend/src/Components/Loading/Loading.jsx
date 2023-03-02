import { CircularProgress } from '@mui/material'
import React from 'react'

function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
      }}
    >
      <CircularProgress
        style={{
          width: 100,
          height: 100,
        }}
        color="primary"
      />
    </div>
  )
}

export default Loading
