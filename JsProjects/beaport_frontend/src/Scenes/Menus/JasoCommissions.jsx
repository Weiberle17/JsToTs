import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'

class JasoCommissions extends React.Component {
  render() {
    let pos = 0
    return (
      <MenuTemplate>
        <MenuButton title="Grundsteuer" toPath="/jaso/GBA" iconString="GBA" pos={pos += 1} />
        <MenuButton title="Gewerbesteuer" toPath="/jaso/GEWS" iconString="GEWS" pos={pos += 1} />
        <MenuButton title="Hundesteuer" toPath="/jaso/Hund" iconString="HUND" pos={pos += 1} />
        <MenuButton title="Sonstige Einnahmen" toPath="/jaso/SEIN" iconString="SEIN" pos={pos += 1} />
        <MenuButton title="Wasser/Abwasser" toPath="/jaso/Wasser" iconString="WASSER" pos={pos} />
      </ MenuTemplate>
    )
  }
}

export default JasoCommissions
