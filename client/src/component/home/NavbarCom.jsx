import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import '../../App.css';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { currentUser, userLogout } from '../../reduxtoolkit/userReducer';
import { clearCartcount, getCartCount } from '../../reduxtoolkit/cartReducer';
import { Badge,Form, Button, Col, Container, Dropdown, Nav, Navbar, Row } from 'react-bootstrap';
import { searchProduct } from '../../reduxtoolkit/productReducer';

const NavbarCom = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch();
  const cartCount = useSelector(state => state.cartInfo.cartCount);
  const cartError = useSelector(state => state.cartInfo.error);
  const productError = useSelector(state => state.productInfo.error);
  const subcategoryError = useSelector(state => state.subcategoryInfo.error);
  const categoryError = useSelector(state => state.categoryInfo.error);
  const brandError = useSelector(state => state.brandInfo.error);
  const orderError = useSelector(state => state.orderInfo.error);
  const userError = useSelector(state => state.userInfo.error)
  let user = useSelector(state => state.userInfo.user)
  
  const searchText = useRef()
  
  user = JSON.parse(localStorage.getItem('user'))
  useEffect(()=> {
    dispatch(currentUser())
  }, [])
  useEffect(() => {
    if(cartError?.response?.status === 403 || productError?.response?.status === 403 || 
      subcategoryError?.response?.status === 403 || categoryError?.response?.status === 403 ||
      brandError?.response?.status === 403 || orderError?.response?.status === 403 || 
      userError?.response?.status === 403) {
        dispatch(userLogout());
        Navigate('/')
      }
  }, [cartError, productError, subcategoryError, categoryError, brandError, orderError , userError])

  
  useMemo(() => {

    if (user) {
      console.log("hello comap")
      dispatch(getCartCount(user._id))
    }
  }, [user, cartCount])

  const handleLogout = (e) => {
    e.preventDefault();
    
    dispatch(clearCartcount())
    dispatch(userLogout())


  }

  const gotoAdmin = (e)=> {
    handleLogout(e);
    Navigate('/admin-login')
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    if(!searchText.current)
    return false;
    dispatch(searchProduct(searchText.current))
  }
  return (
    <div className='navbardiv'>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ alignItems: "normal" }}>
        <Container style={{ marginLeft: "50px", marginRight: '0px', paddingRight: '0px' }}>
          <Navbar.Brand onClick={() => Navigate('/')} className='navbarBrand'>Shoppers shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className="ml-auto mt-2">
            <Form inline onSubmit={handleSubmit}>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
              size='sm'
              value={searchText.current}
              onChange={(e)=> searchText.current = e.target.value}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" size='sm'>Submit</Button>
          </Col>
        </Row>
      </Form>
              {user && <div className='flex flex-row' style={{ margin: '0', padding: "0" }}>
                <Nav.Link style={{ display: "inline" }}
                  onClick={() => Navigate(`/cart/${user._id}`)}>Cart

                  <AiOutlineShoppingCart size={30} style={{ display: 'inline' }}>
                    </AiOutlineShoppingCart></Nav.Link>
                <h5 id='badgecount'><Badge id='badgeshoppingcart' 
                bg="primary" style={{ fontWeight: 'bold' }}>{cartCount ? cartCount : 0}</Badge></h5></div>}

              {user && <Nav.Link onClick={() => Navigate(`/orders/${user._id}`)}>Orders</Nav.Link>}
              {user ? <Nav.Link onClick={handleLogout}>Logout</Nav.Link> :
                <><Nav.Link onClick={() => Navigate('/login')}>Login</Nav.Link>
                  <Nav.Link onClick={() => Navigate('/register')}>Register</Nav.Link>
                </>}
              {user && <div>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" size='sm'>
                    {user.email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => Navigate(`/orders/${user._id}`)}>Orders</Dropdown.Item>
                    <Dropdown.Item onClick={()=> Navigate(`/edit-account/${user._id}`)}>Edit Account</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>}
              <div className='ms-2'>
                <Dropdown>
                  <Dropdown.Toggle variant='secondary' size='sm'>
                    Go to
                  </Dropdown.Toggle>
                
              <Dropdown.Menu id="basic-dropdown">
                <Dropdown.Item onClick={gotoAdmin}>Admin</Dropdown.Item>
              </Dropdown.Menu>
              </Dropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </div>)
}


export default NavbarCom
