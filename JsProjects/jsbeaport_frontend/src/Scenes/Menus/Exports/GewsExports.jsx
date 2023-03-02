import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import getExport, { getBeaExport, getEmaillistExport } from '../../../Services/export'

function GewsExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MainButton
          title="GEWS Daten exportieren"
          btnAction={() => getExport('prjgewerbebeauftragungen')}
          pos={pos += 1}
        />
        <MainButton
          title="GEWS JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_GEWS', true)}
          pos={pos += 1}
        />
        <MainButton
          title="GEWS JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_GEWS', true)}
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default GewsExports
