import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import getExport from '../../Services/export'

function SonstigeExports() {
  let pos = 0
  return (
    <div>
      <MenuTemplate>
        {/*<MenuButton title="Alle Daten exportieren" btnAction={() => getExport('beauftragungen')} pos={pos += 1} />*/}
        <MenuButton title="Benutzer exportieren" btnAction={() => getExport('bpuserkunde')} pos={pos} iconString="user" color="yellow" />
      </MenuTemplate>
    </div>
  )
}

export default SonstigeExports
