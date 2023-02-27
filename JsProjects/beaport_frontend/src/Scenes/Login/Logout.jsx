import Typography from '@mui/material/Typography'
import React from 'react'

const Logout = () => (
  <div
    style={{
      position: 'fixed',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography variant="h4">
      Sie wurden erfolgreich ausgeloggt.
    </Typography>
  </div>
)

export default Logout
