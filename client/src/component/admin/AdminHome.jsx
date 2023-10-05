import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
function AdminHome() {
  const Navigate = useNavigate()
  return (
    <div className='max-w-full'>
        <Row className='d-flex'>
        <DisplayInfo head={"Manage Categories"} goto={()=> Navigate('/admin/category')}/>
        
        <DisplayInfo head={"Manage Sub-categories"} goto={()=> Navigate('/admin/sub-category')}/>
        
        <DisplayInfo head={"Manage Brand"} goto={()=> Navigate('/admin/brand ')}/>
        <DisplayInfo head={"Add Product"} goto={()=> Navigate('/admin/add-product')}/>
        
        </Row>
        <Row></Row>
    </div>
  )
}

function DisplayInfo({head,goto}) {
    
    return (
       
        <Col sm={12} md={3} className='adminHomelist text-center mt-2' >
          <h4 onClick={goto}>{head}</h4>
         
        </Col>
      
    );
  }

export default AdminHome;


