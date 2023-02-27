import { Fab, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const PrimaryButton = (
  {
    title, size, color, variant, disabled, children, onClick,
  },
) => (
  <Tooltip title={title} placement="top">
    <Fab
      sx={{ margin: 1 }}
      size={size}
      disabled={disabled}
      variant={variant}
      aria-label={title}
      color={color}
      onClick={onClick}
    >
      {variant === 'extended' && title}
      {children}
    </Fab>
  </Tooltip>
)

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  variant: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  onClick: PropTypes.func,
}

PrimaryButton.defaultProps = {
  size: 'medium',
  disabled: false,
  color: 'default',
  variant: 'round',
  onClick: () => {},
}

export default PrimaryButton
