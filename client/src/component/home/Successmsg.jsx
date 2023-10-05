import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/StripePayment.css'

function Successmsg() {
  return (
    <div id='succssfull-payment-component'>
      <div>Payment Successfull ! , Thank you for Shopping...</div>
      <div>Shop more ...<Link to={'/'}>Click here</Link></div>
    </div>
  )
}

export default Successmsg