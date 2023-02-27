import {
  Portrait,
} from '@mui/icons-material'
import {Box, Card, CardActionArea, CardContent, CircularProgress, Grid} from '@mui/material'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import Loading from "./Loading";

function MainButton({ title, toPath, pos, disabled, btnAction, loading }) {
  // TODO: Statt switch mit title lieber Farbe und Icon (als String) als Props mitgeben
  const iconStyle = disabled || loading ? { fontSize: 50, marginTop: 40, color: '#a6a6a6' } : { fontSize: 50, marginTop: 40 }
  let icon = <Portrait style={iconStyle} />
  // let buttonstyle = { backgroundColor: '#009490', color: 'white' }
  let buttonStyle = disabled || loading ? { backgroundColor: '#e0e0e0', color: '#a6a6a6' } : { backgroundColor: '#F0AF00', color: 'rgba(0,58,64,0.87)' }

  const button = (
    <Card style={buttonStyle}>
      <CardActionArea>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {loading ? <CircularProgress
        style={{margin: 10, ...iconStyle}}
      /> : icon}
          <CardContent>
            <Typography gutterBottom variant="h6" textAlign="center">
              {title}
            </Typography>
          </CardContent>
        </Grid>
      </CardActionArea>
    </Card>
  )

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box onClick={btnAction}>
                {button}
              </Box>
    </Grid>
  )
}

MainButton.propTypes = {
  title: PropTypes.string.isRequired,
  toPath: PropTypes.string,
  pos: PropTypes.number,
  disabled: PropTypes.bool,
  btnAction: PropTypes.func,
}

MainButton.defaultProps = {
  toPath: null,
  pos: 1,
  disabled: false,
  btnAction: () => {},
}

export default MainButton
