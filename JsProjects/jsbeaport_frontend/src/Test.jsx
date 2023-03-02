import React, { Component } from 'react'

class Test extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    // Führe etwas aus
  }

  componentDidMount() {
    // Führe erneut etwas aus
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Führe etwas anderes aus
  }

  render() {
    return (
      React.createElement(
        Component,
        { variant: 'variante1' },
        'Test',
      )
      // <Component variant="variante1">
      //   Test
      // </Component>
    )
  }
}

export default Test
