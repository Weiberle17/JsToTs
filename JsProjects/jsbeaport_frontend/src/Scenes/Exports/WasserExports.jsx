import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../Services/export'

function WasserExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MenuButton
          title="WASSER Block 1 Daten exportieren"
          btnAction={() => getExport('prjwasserbeauftragungen')}
          iconString="export" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="WASSER Block 2 Daten exportieren"
          btnAction={() => getExport('prjwasserbeauftragungen')}
          iconString="export" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="WASSER JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_WASSER', true)}
          iconString="export" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="WASSER Block 1 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_WASSER', true)}
          iconString="mail" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="WASSER Block 2 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_WASSER', true)}
          iconString="mail" color="yellow" pos={pos += 1}
        />
        <MenuButton
          title="WASSER JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_WASSER', true)}
          iconString="mail" color="yellow" pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default WasserExports
