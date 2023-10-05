import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearOrderError, clearOrders, getuserOrders } from '../../reduxtoolkit/orderReducer';
import '../../App.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

function Orders() {
  const {userid} = useParams()
  const dispatch = useDispatch()
  const user = useSelector(state => state.userInfo.user);
  const error = useSelector(state => state.orderInfo.error);
  const orders = useSelector(state => state.orderInfo.orders);
  const [errmsg, setErrmsg] = useState(null);


  useEffect(() => {
 dispatch(getuserOrders(userid))
      return ()=> {
        dispatch(clearOrders());
        dispatch(clearOrderError());
        setErrmsg(null);
      }
  }, [])
  useEffect(() => {
      if(error?.response?.status === 500) {
        setErrmsg("Oops!, Something went wrong. Please try again")
      }else if (error?.response?.status === 404) {
        setErrmsg(error?.response?.data || "No orders created yet")
      }

    
  }, [error])
  
  
  if (errmsg) {
    return <div className='text-center mt-10 '>{errmsg && <Alert variant='warning'>{errmsg}</Alert>}</div>
  } else if (orders && orders?.length > 0) {
    return (
      <div id='orderpagecomponent'>
        <div id='heading-orderpage'>Order Details</div>
        {orders.map((order, index) => {

          return <div key={index} className='displayuserordersdiv'>
            
            <div className="order-datail-div">
              <div className='font-medium child-heading-order-page'>Payment Details</div>
             <div className='order-paymentdetails'>
              <p>Payment Method : {order?.payment_method}</p>
              <p>Total Amount :  {order?.totalamount}</p>
              <p>Order Created At : {new Date(order?.createdAt).toLocaleString()}</p>
              <p>Order status : {order?.status}</p>
              </div>
            </div>
            <div className='order-shippingaddress'>
              <div className='font-medium child-heading-order-page'>Shipping Address</div>
              <div className='order-shippinginfo'>
                <div>fullName: {order?.shipping_address?.fullname}</div>
                <div>mobile: {order?.shipping_address?.mobile}</div>
                <div>home: {order?.shipping_address?.home} ,
                  town: {order.shipping_address?.town} , city: {order.shipping_address?.city}
                </div>
                <div>Postal Code : {order.shipping_address?.pincode}</div>
              </div>
            </div>
            <div>

              {order.orders.map((item,index)=> {
              return <div key={index} className='ordered-products'>
                <div className='ordered-products-image'>
                  <Link to={`/products/${item._id}`}><img src={`http://localhost:5000/images/${item.filename}`} /></Link>
                </div>
                <div>
                  <div>{item.produdct_name ? item.product_name : item.description}</div>
                  <div>Quantity Bought : {item.quantity} </div>
                  <div>Price : {item.price}</div>
                </div>
              </div>})}
            </div>
          </div>
        })}
      </div>
    )
  }
}

export default Orders