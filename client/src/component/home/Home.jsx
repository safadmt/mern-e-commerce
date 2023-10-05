import React from 'react'
import GetPosts from './GetPosts'
import { Routes,Route, useLocation } from 'react-router-dom'
import ViewProduct from '../../pages/ViewProduct'
import Login from './Login'
import Register from './Register'
import Cart from '../../pages/Cart'
import Checkout from '../../pages/Checkout'
import Orderdetails from '../../pages/Orderdetails'
import Orders from '../dashboared/Orders'
import Orderpage from './Orderpage'
import NavbarCom from './NavbarCom'
import EditUserAccount from './EditUserAccount'
import Successmsg from './Successmsg'
import Footer from '../../pages/Footer'
function Home() {
  return (
    <div className=''>
        <NavbarCom/>
      <Routes>
        <Route path='/*' element={<AdminRoutes/>}/>
        <Route path='/products/:id' element={<ViewProduct/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart/:userid' element={<Cart/>}/>
        <Route path='/checkout/:userid' element={<Checkout/>}/>
        <Route path='/orders/:userid' element={<Orders/>}/>
        <Route path='/order/:orderId' element={<Orderdetails/>}/>
        <Route path='/edit-account/:userid' element={<EditUserAccount/>}/>
        <Route path='/success' element={<Successmsg/>}/>
      </Routes>
    </div>
  )
}

function AdminRoutes () {
  const location = useLocation()
  return (
  <Routes location={location}>
    <Route path='/' element={<GetPosts/>}/>
  </Routes>
  )
}

export default Home
