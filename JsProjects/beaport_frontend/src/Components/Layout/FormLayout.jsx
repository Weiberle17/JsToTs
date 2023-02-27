import {Grid, Paper, Slide} from '@mui/material'
import PropTypes from 'prop-types'
import React, {Suspense} from 'react'
import Loading from '../Loading/Loading'
import FormButtons from "../Input/FormButtons";

function FormLayout({primaryFunction, reloadFunction, saveFunction, cancelFunction, disabled, children}) {
  // TODO: Formbuttons hinter children einfügen
  return (
    <Suspense fallback={<Loading/>}>
      <Slide in direction="down">
        <Grid
          item
          xs={12}
          md={8}
          lg={6}
          sx={{
            height: '100%',
            overflow: 'auto',
            padding: 1,
          }}
        >
          <Paper
            sx={{
              height: '100%',
              paddingTop: 2,
              paddingX: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
            <FormButtons
              primaryFunction={primaryFunction}
              saveFunction={saveFunction}
              reloadFunction={reloadFunction}
              cancelFunction={cancelFunction}
              disabled={disabled}
            />
          </Paper>
        </Grid>
      </Slide>
    </Suspense>
  )
}

FormLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  primaryFunction: PropTypes.func,
  saveFunction: PropTypes.func,
  reloadFunction: PropTypes.func,
  cancelFunction: PropTypes.func,
  disabled: PropTypes.bool,
}

FormLayout.defaultProps = {
  primaryFunction: null,
  saveFunction: null,
  reloadFunction: null,
  cancelFunction: null,
  disabled: false,
  absolute: false,
}

export default FormLayout