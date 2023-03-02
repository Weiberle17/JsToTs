import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import einnahmearten from '../../Services/json/einnahmearten.json'

function Exports() {
  let pos = 0
  return (
    <MenuTemplate>
      {
        einnahmearten.map(({ key }) =>
          <MenuButton
            key={`exports-${key}`} title={`${key} Exporte`} toPath={`/exports/${key.toLowerCase()}`} iconString={key}
            color="yellow" pos={pos += 1}
          />
        )
      }
      <MenuButton
        title="Sonstige Exporte" toPath="/exports/sonstige" iconString="export" color="yellow" pos={pos += 1}
      />
    </MenuTemplate>
  )
}

export default Exports
