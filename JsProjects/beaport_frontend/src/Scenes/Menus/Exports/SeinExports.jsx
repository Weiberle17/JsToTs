import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import { getBeaExport, getEmaillistExport } from '../../../Services/export'

function SeinExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        <MainButton
          title="SEIN Daten exportieren"
          btnAction={() => getBeaExport('PRJ_SEIN')}
          pos={pos += 1}
        />
        <MainButton
          title="SEIN JaSo Daten exportieren"
          btnAction={() => getBeaExport('PRJ_SEIN', true)}
          pos={pos += 1}
        />
        <MainButton
          title="SEIN E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_SEIN')}
          pos={pos += 1}
        />
        <MainButton
          title="SEIN JaSo E-Mailliste exportieren"
          btnAction={() => getEmaillistExport('PRJ_SEIN', true)}
          pos={pos += 1}
        />
      </MenuTemplate>
    </div>
  )
}

export default SeinExports
