import React from 'react'
import MainButton from '../../../Components/Layout/MainButton'
import MenuTemplate from '../../../Components/Templates/MenuTemplate'
import getExport from '../../../Services/export'

function SonstigeExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        {/*<MainButton title="Alle Daten exportieren" btnAction={() => getExport('beauftragungen')} pos={pos += 1} />*/}
        <MainButton title="Benutzer exportieren" btnAction={() => getExport('bpuserkunde')} pos={pos} />
      </MenuTemplate>
    </div>
  )
}

export default SonstigeExports
