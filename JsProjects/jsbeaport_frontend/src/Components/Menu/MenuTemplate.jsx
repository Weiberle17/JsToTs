import { Box, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
function MenuTemplate({ children }) {
  const gridProps = { container: true, justifyContent: 'center', width: '100%', spacing: 1 }

  return (
    <Box
      sx={{
        inset: '75px 0 0',
      }}
      position="absolute"
      padding={3}
    >
      <Grid
        direction="column"
        margin={0}
        height="100%"
        {...gridProps}
      >
        <Grid
          item
          {...gridProps}
        >
          {
            children || (
              <Typography variant="h6">
                Es sind keine Beauftragungen verfügbar.
              </Typography>
            )
          }
        </Grid>
      </Grid>
    </Box>
  )
}

MenuTemplate.propTypes = {
  children: PropTypes.node,
}

MenuTemplate.defaultProps = {
  children: null,
}

export default MenuTemplate