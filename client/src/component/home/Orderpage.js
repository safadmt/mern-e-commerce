import React from 'react'
import Orders from '../dashboared/Orders'
import { useParams } from 'react-router-dom'

function Orderpage() {
  const {userid} = useParams();
  return <Orders userid={userid}/>
}

export default Orderpage