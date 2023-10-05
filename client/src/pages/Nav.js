import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../component/home/NavbarCom';
import Home from '../component/home/Home';
import Admin from './Admin';
import Footer from './Footer';
import AdminLogin from '../component/admin/AdminLogin';
function Nav() {
  return (
    <div>
    <Routes>
    <Route path='/*' element={<Home/>}/>
    <Route path='/admin/*' element={<Admin/>}/>
    <Route path='/admin-login' element={<AdminLogin/>}/>
    </Routes>
    <Footer/>
    </div>
  )
}

export default Nav
