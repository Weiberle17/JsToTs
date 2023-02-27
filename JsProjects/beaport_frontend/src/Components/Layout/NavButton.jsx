import { IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

const NavButton = (
  {
    title, value, children, toPath, current,
  },
) => (
  <Tooltip title={title} placement="right">
    <Link to={toPath}>
      <IconButton value={value} color={current ? 'primary' : 'default'} size="large">
        {/*<IconButton value={value} disabled={disabled} color={disabled ? 'primary' : 'default'}>*/}
        {children}
      </IconButton>
    </Link>
  </Tooltip>
)

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  toPath: PropTypes.string.isRequired,
  current: PropTypes.bool,
}

NavButton.defaultProps = {
  current: false,
}

export default NavButton
