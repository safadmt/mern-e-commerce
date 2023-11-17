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
      <div className='contentdiv'>
    <Routes>
      
    <Route path='/*' element={<Home/>}/>
    <Route path='/admin/*' element={<Admin/>}/>
    <Route path='/admin-login' element={<AdminLogin/>}/>
    </Routes>
    </div>
    <Footer/>
    </div>
  )
}

export default Nav
