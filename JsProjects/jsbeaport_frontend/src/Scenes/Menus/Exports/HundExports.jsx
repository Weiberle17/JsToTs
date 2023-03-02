import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../../Services/export'

function HundExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MainButton
          title="HUND Daten exportieren"
          btnAction={() => getExport('prjhundbeauftragungen')}
          pos={pos += 1}
        />
        <MainButton
          title="HUND JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_HUND', true)}
          pos={pos += 1}
        />
        <MainButton
          title="HUND E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_HUND')}
          pos={pos += 1}
        />
        <MainButton
          title="HUND JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_HUND', true)}
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default HundExports
