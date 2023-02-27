import { Typography } from '@mui/material'
import React from 'react'

class Page404 extends React.Component {
  render() {
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
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Fehler 404:
        </Typography>
        <Typography variant="h5" color="textPrimary">
          Seite nicht gefunden
        </Typography>
      </div>
    )
  }
}

export default Page404
