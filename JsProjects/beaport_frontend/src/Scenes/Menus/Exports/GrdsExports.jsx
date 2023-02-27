import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../../Services/export'

function GrdsExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MainButton title="GBA Daten exportieren" btnAction={() => getExport('prjgbabeauftragungen')} pos={pos += 1} />
        <MainButton title="GBA JaSo Daten exportieren" btnAction={() => getBeaExport('PRJ_GBA', true)} pos={pos += 1} />
        <MainButton
          title="GBA JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GBA', true)}
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default GrdsExports
