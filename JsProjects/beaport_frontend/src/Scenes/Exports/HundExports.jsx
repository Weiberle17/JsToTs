import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../Services/export'

function HundExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MenuButton
          title="HUND Block 1 Daten exportieren"
          btnAction={() => getExport('prjhundbeauftragungen')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="HUND Block 2 Daten exportieren"
          btnAction={() => getExport('prjhundbeauftragungen')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="HUND JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_HUND', true)}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="HUND Block 1 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_HUND')}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="HUND Block 2 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_HUND')}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="HUND JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_HUND', true)}
          iconString="mail" color="yellow" pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default HundExports
