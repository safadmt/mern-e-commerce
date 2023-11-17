import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearOrder, getOneOrderforadmin } from '../reduxtoolkit/orderReducer';
import { Link, useParams } from 'react-router-dom';
import { Card, Col, div, Row, Spinner } from 'react-bootstrap';
import '../App.css';
import { PageNotFound } from '../component/globalcomponent';
function Orderdetails() {
    const {orderid} = useParams();
    const dispatch = useDispatch();
    const orderDetails = useSelector(state=> state.orderInfo.order);
    const ordererror = useSelector(state=> state.orderInfo.error);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null)
    const [show, setShow] = useState(true);
    useEffect(()=> {
        dispatch(getOneOrderforadmin(orderid))
        
    } , [])
    useEffect(()=> {
     
        if(orderDetails?.status === 200) {
            setOrder(orderDetails?.data)
            setShow(false)
        }
    },[orderDetails])
    console.log(orderDetails)
    useEffect(()=> {
        if(ordererror) {
            if(ordererror.response?.status === 404) {
                setError({status: 404, error: ordererror.response?.data || 'Page not found'})
            }else if(ordererror.response?.status === 500) {
                setError({status: 500, error: ordererror.response.data || 'Sorry ! , something went wrong'})
            }
        }
    }, [ordererror])
    console.log(order)
    if(show) {
        return (
            <div className='m-auto text-center pt-20'>
                    <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span>

            </div> 
        )
    }else if(order !== null) {
        return (
            <div className='orderDetails py-4'>
            <Row className='m-16'>
                <Row className='mb-4'>
                    <Row className='ms-14'>
                        <Row className=''>
                            <div className='text-2xl font-medium'>Delivery Address</div>
                        </Row>
                        <Col>

                            <Row>

                                <Col md={4} className='orderaddress'>
                                    <p>{order?.shipping_address?.fullname}</p>
                                    <p>{order?.shipping_address?.mobile}</p>
                                    <p>{order?.shipping_address?.pincode}</p>
                                    <p>{order?.shipping_address?.home}</p>
                                    <p>{order?.shipping_address?.town}</p>
                                    <p>{order?.shipping_address?.city}</p>
                                </Col>
                                <Col md={8}>
                                    <Card.Body>
                                        
                                        <h6>Order created at : {new Date(order?.createdAt).toLocaleString()}</h6>
                                        <h6>Order status: {order?.status}</h6>
                                        <h6>Total amount : {order?.totalamount}</h6>
                                        <h6>Quantity bought : {order?.quantity}</h6>
                                    </Card.Body>
                                </Col>

                            </Row>

                        </Col>

                    </Row>
                </Row>
                <Row>
                    <div className=''>
                        <div className='border-2 border-inherit grid grid-cols-1'>
                            {order?.orderDetails?.map((obj, index) => {
                                return <div key={index}>
                                    <div className='flex flex-row gap-28 border-bottom p-6'>
                                        <div className='' >

                                            <Link to={`/products/${obj._id}`}><img src={`http://localhost:5000/images/${obj?.filename}`} style={{ height: "112px", width: "112px" }}></img>
                                        </Link></div>
                                        <div>
                                        <div>{obj?.product_name ? obj?.product_name : obj?.description}</div>
                                           
                                            <div className='flex flex-row gap-2'>
                                            <div><i class="fa-solid fa-indian-rupee-sign"></i></div><div><span className='font-medium'>  {obj?.price}</span></div></div>
                                           
                                        </div>
                                    </div>

                                </div>
                            })}
                        </div>
                    </div>
                </Row>
            </Row>
            </div>
    )
    }else if(error && error.status === 404) {
        return <div className='mt-10'><PageNotFound data={error.error}/></div>
    }else if(error && error.status === 500) {
        return <div className='mt-10 font-medium text-lg'> <PageNotFound data={error.error}/></div>
    }
    
}

export default Orderdetails