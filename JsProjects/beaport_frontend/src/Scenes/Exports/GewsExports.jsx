import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../Services/export'

function GewsExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MenuButton
          title="GEWS Block 1 Daten exportieren"
          btnAction={() => getExport('prjgewerbebeauftragungen')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GEWS Block 2 Daten exportieren"
          btnAction={() => getExport('prjgewerbebeauftragungen')}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GEWS JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_GEWS', true)}
          iconString="export" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GEWS Block 1 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GEWS', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GEWS Block 2 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GEWS', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GEWS JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GEWS', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default GewsExports
