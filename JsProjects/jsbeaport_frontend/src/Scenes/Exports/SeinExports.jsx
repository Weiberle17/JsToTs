import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import { getBeaExport, getEmaillistExport } from '../../Services/export'

function SeinExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MenuButton
          title="SEIN Block 1 Daten exportieren"
          btnAction={() => getBeaExport('PRJ_SEIN')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="SEIN Block 2 Daten exportieren"
          btnAction={() => getBeaExport('PRJ_SEIN')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="SEIN JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_SEIN', true)}
          iconString="export" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="SEIN Block 1 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_SEIN')}
          iconString="mail" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="SEIN Block 2 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_SEIN')}
          iconString="mail" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="SEIN JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_SEIN', true)}
          iconString="mail" color="yellow" pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default SeinExports
