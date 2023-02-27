import Typography from '@mui/material/Typography'
import React from 'react'
import MenuButton from '../../Components/Menu/MenuButton'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import { isAdmin, isBeaUser, isNewUser, isPrjUser } from '../../Services/general'
import { serviceResetTestuser } from "../../Services/submitData"

const Home = () => {
  const admin = isAdmin()
  const prjUser = isPrjUser()
  const beaUser = isBeaUser()
  const newUser = isNewUser()
  let pos = 0
  return (
    <MenuTemplate>
      <>
        {/*<MenuButton title="Benutzer bearbeiten" toPath="/Beauftragung" pos={pos += 1} />*/}
        {
          (admin) && (
            <>
              <MenuButton title="Daten exportieren" toPath="/exports" pos={pos += 1} iconString="export" color="yellow"/>
              <MenuButton
                title="Testuser zurücksetzen"
                btnAction={() => serviceResetTestuser()}
                iconString="reset" color="yellow" disabled={true}
                pos={pos += 1}
              />
            </>
          )
        }
        {
          (newUser) && (
            <MenuButton title="Neuer Ansprechpartner" toPath="/contact" pos={pos += 1} iconString="user"/>
          )
        }
        {
          (beaUser) && (
            <MenuButton title="Neue Beauftragung" toPath="/bea" pos={pos += 1}/>
          )
        }
        {
          (prjUser) && (
            <>
              <MenuButton title="Vorabinformationen" toPath="/pre" pos={pos += 1}/>
              <MenuButton title="Neue Projektkunden-Beauftragung" toPath="/prj-bea" pos={pos += 1}/>
              <MenuButton title="Beauftragung Jahresveranlagung KM-StA" toPath="/jaso" pos={pos += 1}/>
            </>
          )
        }
        {
          (!admin && !newUser && !beaUser && !prjUser) && (
            <Typography color="primary" variant="h6">Es sind keine Beauftragungen für Sie verfügbar.</Typography>
          )
        }
      </>
    </MenuTemplate>
  )
}

export default Home
