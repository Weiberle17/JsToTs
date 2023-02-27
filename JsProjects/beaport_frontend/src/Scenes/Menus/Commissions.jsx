import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import MenuTemplate from '../../Components/Menu/MenuTemplate'
import { serviceGetOverview } from '../../Services/submitData'
import CommissionButton from '../Commissions/Components/CommissionButton'
import Loading from "../../Components/Loading/Loading"

/*
 * ID, Name, PRJ_ID, (KM-StA-Projektkunden) PRJ_Name
 * GBA, Grundbesitzangaben, PRJ_*, Grundsteuer
 * GEWS, Gewerbesteuer, PRJ_*, *
 * HUND, Hundesteuer, PRJ_*, *
 * SEIN, Sonstige Einnahmen, PRJ_*, *
 * WASSER, Wasser/Abwasser, PRJ_*, *
 * */

function Commissions() {
  const [buttons, setButtons] = useState([])
  const [isLoading, setLoading] = useState(true)
  const { pathname } = useLocation()
  let pos = 0

  // TODO: Bei Pfadänderung aktualiseren
  useEffect(() => {
    serviceGetOverview().then((res) => {
      const { beauftragungen } = res
      const buttons = beauftragungen.filter((obj) => (pathname.toLowerCase() === '/bea' === !obj.einnahmeart.startsWith('PRJ_')) && !obj.einnahmeart.endsWith('_JASO') && obj.active)
      setButtons(buttons)
      setLoading(false)
    })
  }, [])

  if (isLoading) { return <Loading /> }
  return (
    <MenuTemplate>
      {
        buttons
          .map((btn) => {
            const { einnahmeart, blocks } = btn
            return <CommissionButton
              key={uuidV4()}
              einnahmeart={einnahmeart}
              blocks={blocks}
              pos={pos += 1}
            />
          })
      }
    </MenuTemplate>
  )
}

export default Commissions
