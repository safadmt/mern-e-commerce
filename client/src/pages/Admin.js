import React from 'react'
import {Routes, Route,useLocation} from 'react-router-dom';
import Sidebar from '../component/admin/Sidebar';
import Product from '../component/admin/Product';
import Users from '../component/admin/Users';
import AddProduct from '../component/admin/AddProduct';
import Ordercomponent from '../component/admin/Ordercomponent';
import Editproduct from '../component/admin/Editproduct';
import { Col, Row } from 'react-bootstrap';
import NavbarAdmin from '../component/admin/NavbarAdmin';
import AdminHome from '../component/admin/AdminHome';
import ManageCategories from '../component/admin/ManageCategories';
import ManageBrand from '../component/admin/ManageBrand';
import ManageSubCategories from '../component/admin/ManageSubCategories';
import EditSubCategories from '../component/admin/EditSubCategories';
import Orderdetails from './Orderdetails';
import DisplayProduct from '../component/admin/DisplayProduct';


function Admin() {
  return (
    <div className='mx-0'>
    <Row className='flex'>
        <NavbarAdmin/>
        <Col className='bg-black' md={2} sm={4} xs={12} style={{backgroundColor: "#CDC2AE"}}>
            <Sidebar/>
        </Col>
      <Col md={10} sm={8} xs={12} className='w-10/12'>
        <Routes>
            <Route path='/' element={<AdminHome/>} />
            <Route path='/orders' element={<Ordercomponent/>}/>
            <Route path='/order/:orderid' element={<Orderdetails/>}/>
            <Route path='/users' element={<Users/>}/>
            <Route path='/products' element={<Product/>}/>
            <Route path='/product/:productid' element={<Editproduct/>}/>
            <Route path='/products/:productid' element={<DisplayProduct/>}/>
            <Route path='/add-product' element={<AddProduct/>}/>
            <Route path='/category' element= {<ManageCategories/>}/>
            <Route path='/brand' element={<ManageBrand/>}/>
            <Route path='/sub-category' element={<ManageSubCategories/>}/>
            <Route path='/sub-category/edit/:subcategoryId' element={<EditSubCategories/>}/>
        </Routes>
        
      </Col>
    </Row>
    </div>
  )
}

export default Admin
