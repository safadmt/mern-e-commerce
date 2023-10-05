
import React, { createContext, useEffect, useRef, useState } from 'react'
import { Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PaymentMethod from '../component/checkout/PaymentMethod';
import ReviewDeliveryItems from '../component/checkout/ReviewDeliveryItems';
import { getTotalprice, userLogout } from '../reduxtoolkit/userReducer';
import { removeOrder, verifyPayment } from '../reduxtoolkit/orderReducer';
import AddAddress from '../component/checkout/Addaddress';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import StripeCheckout from '../component/checkout/StripeCheckout';




export const checkOutStepsContext = createContext();

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script);
    })


}



function Checkout() {
    const Navigate = useNavigate()
    const dispatch = useDispatch();

    const {userid} = useParams();

    const user = useSelector(state => state.userInfo.user);
    const payment_response = useSelector(state => state.orderInfo.payment_status);
    const usererr = useSelector(state => state.userInfo.error);
    const totalamount = useSelector(state => state.userInfo.carttotalamount);
    const ordererror = useSelector(state => state.orderInfo.error)
    
    const [checkoutSteps, setCheckoutSteps] = useState(0)
    const orderDetails = useRef({ address_id: '', userid: '' })
    const [orderDetails2, setOrderDetails2] = useState(null);
    const [errmessage, setErrmessage] = useState(null)
    const [successmsg, setSuccesmsg] = useState(null)
    const [address, setAddress] = useState(null)
    const [amount, setAmount] = useState(null)
    const [showStripe, setShowStripe] = useState(false)
    
    let steps;


    function displaysuccesmsg(message) {
        setSuccesmsg(message)
        setTimeout(() => {
            setSuccesmsg(null)
        }, 1000);
    }
    useEffect(() => {
        if (user) {
            orderDetails.current.userid = user._id
            dispatch(getTotalprice(user._id))
        } else if (usererr) {
            dispatch(userLogout());
            Navigate('/')
        }
    }, [usererr])

    useEffect(() => {
        if (payment_response == "success") {
            displaysuccesmsg("You Order has been placed")
            Navigate('/')
        }
    }, [payment_response])

    useEffect(()=> {
        dispatch(getTotalprice(user._id))
    },[orderDetails2])
    const displayerrmessage = (err) => {
        setErrmessage(err);
        setTimeout(() => {
            setErrmessage(null)
        }, 2000);
    }

    useEffect(()=> {
        console.log(checkoutSteps)
        console.log(orderDetails2)
    },[checkoutSteps, orderDetails2])

    useEffect(()=> {
        if(totalamount) {
            setAmount(totalamount.totalamount)
        }
        
    },[totalamount])
    const handleverifyPayment = (response, orderid) => {
        const details = {
            response: response,
            orderid: orderid
        }

        dispatch(verifyPayment(details))
    }


    const displayRazorPay = async (order) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            displayerrmessage("Razorpay payment gateway failed to load")
        }
        console.log(order)
        const options = {
            key: "rzp_test_AOe8rwehJSw3KU",
            amount: order.amount,
            currency: "INR",
            name: "Shoppers Shop",
            description: "Thank you for choosing",
            order_id: order.id,
            handler: function (response) {
                handleverifyPayment(response, order.receipt)
            },

            theme: {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            
            dispatch(removeOrder(order.receipt))
            alert(response.error.description, response.error.reason)
            Navigate('/')
        });

        rzp1.open();


    }

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        console.log(setCheckoutSteps)
        console.log("Order Details 2", orderDetails2)
        if (user) {


            if (!address || !orderDetails2)
                return displayerrmessage("Please choose all address and payment method")
            const orderInfo = {
                payment_method: orderDetails2,
                address_details: address,
                amount
            }


            axios.post(`http://localhost:5000/user/payment/place-order/${user._id}`, orderInfo, {
                headers: { "Content-Type": "application/json" }, withCredentials: true
            })
                .then(response => {
                    if (response?.data?.status == "pending") {
                        displayerrmessage("Please wait, Loading razorpay ")
                        displayRazorPay(response.data.order)
                    } else if (response?.data?.status == "placed") {
                        setSuccesmsg("Your Order has been placed")
                        setTimeout(() => {
                            setSuccesmsg(null)
                            Navigate('/')
                        }, 2000);
                    }
                })
                .catch(err => {
                    if (err?.response?.status === 400) {
                        console.log(err?.response)
                    } else {
                        console.log(err)
                    }
                })
        }
    }
    function handleStripePayment (e)  {
        
        setShowStripe(true)
        
    }
    return (
        <checkOutStepsContext.Provider value={{ checkoutSteps, setCheckoutSteps }}>

            <div>
                <div>
                    <div className='text-center border border-y-2 p-2'>
                        <p className='text-4xl font-medium text-inherit'>Checkout</p>
                        {errmessage && <Alert variant='warning' className='text-2xl font-medium'>{errmessage}</Alert>}
                        {successmsg && <Alert variant='success' className='text-2xl font-medium'>{successmsg}</Alert>}
                    </div>
                </div>
                
                <div className='flex flex-row px-20'>
                    <div className='w-3/4'>
                        <div id='addrescomp' className='ms-10'>
                            <AddAddress setaddress={setAddress} />
                            </div>
                        <div id='addrescomp'>
                            <PaymentMethod orderDetails2={orderDetails2} 
                            setOrderDetails2={setOrderDetails2} />
                        </div>
                        
                        {checkoutSteps >= 1  && <div id='addrescomp' >
                           
                             <ReviewDeliveryItems userid={userid} orderDetails2={orderDetails2} setOrderDetails2={setOrderDetails2} /></div>}
                    </div>
                    
                    
                </div>
                {showStripe && <div>
                        <StripeCheckout totalamount={amount} shippingAddress={address}/>
                    </div>}
                {orderDetails2 === 'stripe' && <div className='mt-4 ms-28'>
                    <p>Total Amount : {amount && amount}</p>
                    <Button variant='primary' onClick={handleStripePayment}>Place Order</Button>
                </div>}
                {orderDetails2 !== 'stripe' && orderDetails2 !== null && <div>
                        <div className='mt-4 ms-28'>
                            
                                <p className='mb-4 font-medium'>Total amount :
                                 <i class="fa-solid fa-indian-rupee-sign"></i>
                                 {totalamount && totalamount.totalamount} </p>
                                <Button variant='primary' disabled={checkoutSteps < 2 } onClick={
                                    handlePlaceOrder}>Place Order</Button>
                       
                        </div>
                    </div>}
            </div>

        </checkOutStepsContext.Provider>
    )
}

export default Checkout