import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from '../../Components/Loading/Loading'
import { serviceGetOverview } from '../../Services/submitData'
import CreateCommissionTemplateLegacy from './Components/CreateCommissionTemplateLegacy'
import { applyAnswers } from './Services/commissionFunctions'

function CreateCommissionLegacy() {
  const [data, setData] = useState(null)
  const { pathname } = useLocation()
  const einnahmeart = pathname.split('/')[2]

  useEffect(() => {
    import(`../../Services/json/beauftragungen/prjBea/${einnahmeart.toLowerCase()}.json`).then((json) => {
      serviceGetOverview().then((res) => {
        const data = applyAnswers(res, json, 'PRJ_'+einnahmeart)
        setData(data)
        console.log(data)
      })
    })
  }, [])

  if (!data) {
    return (<Loading />)
  }

  return (
    <CreateCommissionTemplateLegacy
      data={data}
    />
  )
}

export default CreateCommissionLegacy
