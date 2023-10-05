import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Container, Dropdown, Nav, Navbar, Row } from 'react-bootstrap';
import { searchProduct } from '../../reduxtoolkit/productReducer';
import { adminLogout, currentAdmin } from '../../reduxtoolkit/adminReducer';

const NavbarAdmin = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch();
  

  const admin = useSelector(state => state.adminInfo.admin);
  const adminErr = useSelector(state=> state.adminInfo.error);
  const brandErr = useSelector(state=> state.brandInfo.error);
  const categoryErr = useSelector(state=> state.categoryInfo.error);
  const subcategoryErr = useSelector(state=> state.subcategoryInfo.error);
  const productErr = useSelector(state=> state.productInfo.error);
  const orderErr = useSelector(state=> state.orderInfo.error);
  


  useEffect(() => {
    dispatch(currentAdmin());
  },[])


  useEffect(()=> {
    if(adminErr?.response?.status === 403 || brandErr?.response?.status === 403 
      || categoryErr?.response?.status === 403 || subcategoryErr?.response?.status === 403 ||
      orderErr?.response?.status === 403 || productErr?.response?.status === 403) {
        dispatch(adminLogout())
        Navigate('/admin-login')
    }
  },[adminErr,brandErr,categoryErr,subcategoryErr,productErr,orderErr])
  const handleLogout = (e)=> {
    dispatch(adminLogout())
    Navigate('/admin-login')
  }
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ alignItems: "normal" }}>
        <Container style={{ marginLeft: "50px", marginRight: '0px', paddingRight: '0px' }}>
          <Navbar.Brand onClick={() => Navigate('/admin')} className='navbarBrand'>Shoppers shop Admin Panel</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className="ml-auto mt-2">

              <div className='ms-2'>
                <Dropdown>
                  <Dropdown.Toggle variant='secondary' size='sm'>
                    {admin ? admin.email : 'Account'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu id="basic-dropdown">
                    <Dropdown.Item onClick={() => Navigate('/')}>Home</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </div>)
}


export default NavbarAdmin;

