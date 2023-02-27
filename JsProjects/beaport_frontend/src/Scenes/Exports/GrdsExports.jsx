import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../Services/export'

function GrdsExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MenuButton title="GBA Block 1 Daten exportieren" btnAction={() => getExport('prjgbabeauftragungen')} iconString="export" color="yellow" pos={pos += 1} />
        <MenuButton title="GBA Block 2 Daten exportieren" btnAction={() => getExport('prjgbabeauftragungen')} iconString="export" color="yellow" pos={pos += 1} />
        <MenuButton title="GBA JaSo Daten exportieren" btnAction={() => getBeaExport('PRJ_GBA', true)} iconString="export" color="yellow" pos={pos += 1} />
        <MenuButton
          title="GBA Block 1 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GBA', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GBA Block 2 E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GBA', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
        <MenuButton
          title="GBA JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GBA', true)}
          iconString="mail" color="yellow"
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default GrdsExports
