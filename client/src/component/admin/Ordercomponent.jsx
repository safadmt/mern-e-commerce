import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../../App.css';
import { Form, Card, Col, Dropdown, Row, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { clearOrderError, clearOrders, getAllOrders, getFilteredOrders, searchOrders } from '../../reduxtoolkit/orderReducer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DisplaySelectForm, PageNotFound, ProductPagination } from '../globalcomponent';


function Ordercomponent() {
  const Navigate = useNavigate()
  const dispatch = useDispatch();
  const ordersInfo = useSelector(state => state.orderInfo.orders);
  const filteredOrders = useSelector(state => state.orderInfo.filteredOrders);
  const orderError = useSelector(state => state.orderInfo.error);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [orders, setOrders] = useState([]);
  const [addbtn, setAddBtn] = useState(0);
  const [searchTexterr, setSearchTextError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchText, setSearchText] = useState(null);
  const [setCheckedCheckboxes] = useState(null)


  const [paymentMethod, setPaymentMethod] = useState(
    [{ method: 'razorpay', checked: false }, { method: 'cash_on_delivery', checked: false }]
  );
  const [status, setStatus] = useState(
    [{ method: 'pending', checked: false }, { method: 'placed', checked: false }]);



  const retieveSearchParams = () => {
    const searchquery = new URLSearchParams(window.location.search);
    const decode = decodeURIComponent(searchquery.toString())
    console.log(decode)
    const valuePattern = /(?:^|&)([^&=]*)=([^&]*)/g;

    // Initialize the result object
    const resultObject = {};

    // Iterate through the matches in the query string
    let match;
    while ((match = valuePattern.exec(decode))) {
      const [, key, value] = match;
      // Split the value by % to extract individual values
      const values = value ? value.split("%") : [];
      resultObject[key] = values;
    }
    return resultObject;
  }



  useEffect(() => {

    const resultObject = retieveSearchParams()

    if (resultObject !== null && (resultObject.payment_method?.length > 0 || resultObject.status?.length > 0)) {
      if (resultObject.payment_method?.length > 0) {
        setCheckedCheckboxes(paymentMethod, setPaymentMethod, resultObject)
      }
      if (resultObject.status?.length > 0) {
        setCheckedCheckboxes(status, setStatus, resultObject)
      }
      dispatch(getFilteredOrders(resultObject))

    } else {
      const info = {
        page: 1,
        limit: 12
      }
      dispatch(getAllOrders(info))
    }
    return () => {
      dispatch(clearOrders())
      setError(null)
      dispatch(clearOrderError())
    }
  }, [])

  useMemo(() => {
    
    if (ordersInfo && ordersInfo.status === 200) {
      setOrders(ordersInfo?.data?.orders)
      setTotalPages(ordersInfo?.data?.totalpages)
    } else if (ordersInfo && ordersInfo.status === 204) {
      

      setError({ status: 204, error: "Sorry! , No orders matched for your search text" })

      setTimeout(() => {
        setError(null)
      }, (3000));
    }
  }, [ordersInfo])


  useMemo(() => {
    console.log(orderError)

    if (orderError?.response?.status === 500) {
      setError({ status: 500, error:orderError?.response?.data || "Sorry , something went wrong. Please try again later" })
    }else if (orderError?.response?.status === 404) {
      setError({ status: 500, error: "No orders created in the database" })
    }
  }, [orderError])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchText)
    if (searchText === null)
      return setSearchTextError("Search field required")
    const info = {
      searchtext: searchText,
      page: currentPage,
      limit: 12
    }
    dispatch(searchOrders(info));
  }



  if (error?.status === 500 || error?.status === 204) {
    return (
      <div className='mt-10'><PageNotFound className={"text-red-600"} data={error?.error} /></div>
    )
  } else if (orders && orders.length > 0) {
    return (
      <>
        <Row>
          <Row className='justify-content-end'>
            <Col md={4} className='mt-6' sm={10}>
              <Form inline onSubmit={handleSubmit}>
                <Row>
                  <Col xs="auto">
                    {searchTexterr && <div className='text-red-700'>{searchTexterr}</div>}
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className=" mr-sm-2"
                      size='sm'
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button type="submit" size='sm'>Submit</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        
         {<div>
          <Col md={8} className='m-auto'>
            {orders.map((order, index) => {
              return <Col key={index} className='mt-2 mb-2'>
                <Card className='p-4 ordersComponent' onClick={() => Navigate(`/admin/order/${order._id}`)}>
                  <p id='ordersparagraph'>Payment method : {order.payment_method}</p>
                  <p id='ordersparagraph'>Order status : {order.status}</p>
                  <p id='ordersparagraph'>Order id : {order._id}</p>
                  <p id='ordersparagraph'>Order totalamount : <i class="fa-solid fa-indian-rupee-sign"></i> {order.totalamount} </p>
                  <p id='ordersparagraph'>Order created at: {new Date(order.createdAt).toLocaleString()}</p>
                </Card>
              </Col>
            })}
          </Col>
        <Row>
          <ProductPagination totalPages={totalPages} setCurrentPage={setCurrentPage} currentpage={currentPage} />
        </Row>
        </div>}
        </Row>
      </>
    )
  }
}

export default Ordercomponent
