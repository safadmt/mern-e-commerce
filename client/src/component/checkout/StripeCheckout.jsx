import React, { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useStripe,useElements, PaymentElement} from '@stripe/react-stripe-js';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { getTotalprice } from '../../reduxtoolkit/userReducer';
import '../../css/StripePayment.css'
import { Spinner } from 'react-bootstrap';
import { submitOrder } from '../../reduxtoolkit/orderReducer';

const stripePromise  = loadStripe(`pk_test_51NXvndSDzQXVtaowBZcp3ks86MSKxPT38x
    JSpJyXmtMOmXAIEOZv4DmYBZ3FBVdTgWsf9TKVjKe0sDH78z38sORI00wkqLqmcu`)

const StripeCheckout = ({products,shippingAddress, totalamount})=> {

    
const dispatch = useDispatch();

  const user = useSelector(state => state.userInfo.user)
  const totalprice = useSelector(state=> state.userInfo.carttotalamount)
  const [clientSecret, setClientSecret] = useState("");

  useEffect(()=> {
    if(user) {
        dispatch(getTotalprice(user._id))
    }
    
  }, [])
 
 
  useEffect(()=> {
    console.log(user,totalprice)
    if(user && totalamount) {
        console.log("hello user and totoalamout")
        axios.post(`http://localhost:5000/user/stripe-payment-intent/${user._id}`,
        {totalamount:totalamount}, 
            {headers: {"Content-Type": "application/json"},withCredentials:true}
        ).then(response=> {
            
            setClientSecret(response.data.clientSecret)
        }).catch(err=> {
            console.log(err)
        })
    }
    
  },[])
  console.log("cielent secret",clientSecret)
 
  

  return (
    <div className="App">
      {clientSecret && stripePromise && 
    
        <Elements options={{clientSecret}} stripe={stripePromise}>
          <CheckOutForm user={user} products={products} shippingAddress={shippingAddress} totalamount={totalamount}/>
        </Elements>
      }
    </div>
  );
  
}

export default StripeCheckout


const CheckOutForm = ({shippingAddress,totalamount })=> {
    const stripe = useStripe();
    const elements = useElements();

    const dispatch = useDispatch();

    const user = useSelector(state=> state.userInfo.user);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);



      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
          return;
        }
        
        setIsLoading(true);
    
        const { error ,paymentIntent} = await stripe.confirmPayment({
          elements,
          redirect: 'if_required'
          
        });
        console.log("confirm stripe is not gtettin here")
        if (error) {
          if(error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
          }else{
            setMessage("An unexpected error occurred.");
          }
            
          } else {
           
              console.log("payment intent safad")
              const obj = {
                userid: user._id,
                info: {
                    shipping_address : shippingAddress,
                    totalamount,
                }
                
              }
              dispatch(submitOrder(obj))
            
            setMessage("Payment Successfull")
          }
      
          setIsLoading(false);
          window.location.href = `${window.location.origin}/success`
        };


        const paymentElementOptions = {
            layout: "tabs"
          }
        
          return (
            <form id="stripe-payment-form" onSubmit={handleSubmit}>
              
              <PaymentElement id="payment-element" options={paymentElementOptions} />
              <div>
              <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                  {isLoading ?  <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>  : "Pay now"}
                </span>
              </button>
              </div>
              {/* Show any error or success messages */}
              {message && <div id="payment-message">{message}</div>}
            </form>
          );

}