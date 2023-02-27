import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { Commissions, CreateCommissionLegacy, Home, Login, Logout, Page404 } from './Components/CustomComponents'
import CustomAppBar from './Components/Layout/CustomAppBar'
import RequireAuth from './Components/Routes/RequireAuth'
import CreateContactPerson from './Scenes/ContactPerson/CreateContactPerson'
import JasoSein from './Scenes/Jaso/JasoSein'
import JasoSeinWizard from './Scenes/Jaso/JasoSeinWizard'
import ResetPassword from './Scenes/Login/ResetPassword'
import {Exports, GewsExports, GrdsExports, HundExports, SeinExports, SonstigeExports, WasserExports} from './Scenes/Exports/ExportComponents'
import JasoCommissions from './Scenes/Menus/JasoCommissions'
import theme from './Services/theme'
import JasoTemplate from "./Scenes/Jaso/JasoTemplate";
import CommissionTemplate from "./Scenes/Commissions/CommissionTemplate"

if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

// TODO: Readme.MD überarbeiten, für JSDoc
function App() {
  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Router>
            <CustomAppBar />
            <main role="main">
              <Routes>
                <Route exact path="/" element={<RequireAuth><Home /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/passwordreset/:token" element={<ResetPassword />} />
                <Route exact path="/exports" element={<RequireAuth adminOnly><Exports /></RequireAuth>}  />
                <Route path="/exports/gba" element={<RequireAuth adminOnly><GrdsExports /></RequireAuth>}  />
                <Route path="/exports/gews" element={<RequireAuth adminOnly><GewsExports /></RequireAuth>} />
                <Route path="/exports/hund" element={<RequireAuth adminOnly><HundExports /></RequireAuth>} />
                <Route path="/exports/sein" element={<RequireAuth adminOnly><SeinExports /></RequireAuth>} />
                <Route
                  path="/exports/wasser"
                  element={<RequireAuth adminOnly><WasserExports /></RequireAuth>}
                />
                <Route
                  path="/exports/sonstige"
                  element={<RequireAuth adminOnly><SonstigeExports /></RequireAuth>}
                />
                <Route path="/contact" element={<RequireAuth><CreateContactPerson /></RequireAuth>} />
                <Route exact path="/bea" element={<RequireAuth><Commissions /></RequireAuth>} />
                <Route path="/bea/gba" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/bea/gews" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/bea/sein" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/bea/wasser" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/bea/hund" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route exact path="/prj-bea" element={<RequireAuth><Commissions /></RequireAuth>} />
                <Route path="/prj-bea/gba" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/prj-bea/gews" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/prj-bea/sein" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/prj-bea/wasser" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route path="/prj-bea/sein" element={<RequireAuth><CreateCommissionLegacy /></RequireAuth>} />
                <Route exact path="/pre" element={<RequireAuth><Commissions /></RequireAuth>} />
                <Route path="/pre/gba" element={<RequireAuth><CommissionTemplate /></RequireAuth>} />
                <Route path="/pre/gews" element={<RequireAuth><CommissionTemplate /></RequireAuth>} />
                <Route path="/pre/sein" element={<RequireAuth><CommissionTemplate /></RequireAuth>} />
                <Route path="/pre/wasser" element={<RequireAuth><CommissionTemplate /></RequireAuth>} />
                <Route path="/pre/hund" element={<RequireAuth><CommissionTemplate /></RequireAuth>} />
                <Route exact path="/jaso" element={<RequireAuth><JasoCommissions /></RequireAuth>} />
                <Route path="/jaso/gba" element={<RequireAuth><JasoTemplate /></RequireAuth>} />
                <Route path="/jaso/gews" element={<RequireAuth><JasoTemplate /></RequireAuth>} />
                <Route path="/jaso/sein" element={<RequireAuth><JasoSein /></RequireAuth>} />
                <Route path="/jaso/sein/:einnahmeart" element={<RequireAuth><JasoSeinWizard /></RequireAuth>} />
                <Route path="/jaso/wasser" element={<RequireAuth><JasoTemplate /></RequireAuth>} />
                <Route path="/jaso/hund" element={<RequireAuth><JasoTemplate /></RequireAuth>} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
