import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { checkOutStepsContext, orderDetailContext } from '../../pages/Checkout';

    function PaymentMethod({orderDetails2,setOrderDetails2}) {
        const {checkoutSteps, setCheckoutSteps} = useContext(checkOutStepsContext);
        const [radiocash, setRadiocash] = useState(false)
        const [radioRazorpay, setRadioRazorpay] = useState(false)
        const [radioStripe, setRadioStripe] = useState(false)
        
        const handleChange = (e) => {
        
            const {value} = e.target;
            if(value === "cash_on_delivery") {
                setRadiocash(true)
                setRadioRazorpay(false)
                setRadioStripe(false)
                setOrderDetails2(e.target.value)
                setCheckoutSteps(2)
            }else if(value === "razorpay") {
                setRadioRazorpay(true)
                setRadiocash(false)
                setRadioStripe(false)
                setOrderDetails2(e.target.value)
                setCheckoutSteps(2)
            }else if(value === "stripe") {
                setRadioRazorpay(false)
                setRadiocash(false);
                setRadioStripe(true)
                setOrderDetails2(e.target.value)
                setCheckoutSteps(1)
            }
            
        }
        return (
            <div>
                <div className='flex flex-row gap-4 ms-10'>
                    
                    <div className='text-2xl font-medium'>Payment Method</div>
                </div>
                <div>

                    <div>
                        <div className='ms-10 p-4'>
                            <Form.Group className='flex flex-row gap-4'>
                                <Form.Check type='radio' disabled={checkoutSteps == 0} value={'cash_on_delivery'} checked={radiocash} onChange={handleChange} name='paymentMethod' />
                                <Form.Label>Cash on delivery</Form.Label>
                            </Form.Group>
                            <Form.Group className='flex flex-row gap-4'>
                                <Form.Check type='radio' disabled={checkoutSteps == 0} value={'razorpay'} checked={radioRazorpay} onChange={handleChange} name='paymentMethod' />
                                <Form.Label>Pay with Razorpay</Form.Label>
                            </Form.Group>
                            <Form.Group className='flex flex-row gap-4'>
                                <Form.Check type='radio' disabled={checkoutSteps == 0} value={'stripe'} checked={radioStripe} onChange={handleChange} name='paymentMethod' />
                                <Form.Label>Pay with stripe</Form.Label>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    export default PaymentMethod