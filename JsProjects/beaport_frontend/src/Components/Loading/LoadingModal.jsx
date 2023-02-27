import { Dialog } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import Loading from './Loading'

function LoadingModal({ open }) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Loading />
    </Dialog>
  )
}

LoadingModal.propTypes = {
  open: PropTypes.bool,
}

LoadingModal.defaultProps = {
  open: false,
}

export default LoadingModal
