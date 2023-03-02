import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../../Services/export'

function WasserExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MainButton
          title="WASSER Daten exportieren"
          btnAction={() => getExport('prjwasserbeauftragungen')}
          pos={pos += 1}
        />
        <MainButton
          title="WASSER JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_WASSER', true)}
          pos={pos += 1}
        />
        <MainButton
          title="WASSER JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_WASSER', true)}
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default WasserExports
