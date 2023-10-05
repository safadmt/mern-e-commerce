import React, { useContext, useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { checkOutStepsContext } from '../../pages/Checkout';


function AddAddress({setaddress}) {
  const {checkoutSteps, setCheckoutSteps} = useContext(checkOutStepsContext);
   
    const [isChecked] = useState(false)
    const [error, setError] = useState('')
    const address = useRef({fullname: '', mobile: '', 
    pincode: '', home: '', town: '', city: ''});
    
    const handleChange = (e)=> {
        e.preventDefault();
        const {name, value} = e.target;
        address.current[name] = value;
    }
    console.log(isChecked)
    
    const displayError = (err)=> {
      setError(err);
      setTimeout(() => {
        setError(null)
      }, 3000);
    }
    const handleSubmit = (e)=> {
        e.preventDefault();
        const {fullname, mobile, pincode, home, town, city,} = address.current
        if(!fullname || !mobile || !pincode || !home || !town || !city) {
            displayError("All the field is required")
            
        }else if(pincode.length !== 6) {
            displayError("PIN Code must be 6 numbers")
        }else{
            setCheckoutSteps(1)
            setaddress(address.current)
            
        }
    }

  if(checkoutSteps === 0) {
    return (
    <div className='w-3/4 bg-orange-50 p-4 mt-4 mb-4' id='addaddress'>
      <div className='grid grid-cols-2 gap-28 pe-4 mb-4' style={{borderBottom: '2px solid black'}}>
        <div className='text-xl font-medium'>Enter delivery address</div>
        
      </div>
      <div>
      {error && <Alert variant='warning' className='text-lg font-medium'>{error}</Alert>}
      </div>
      <div className=''>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-1'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control type='text' name='fullname' 
            onChange={(e)=> handleChange(e)} />
          </Form.Group>
          <Form.Group className='mb-1'>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type='number' name='mobile'
            onChange={(e)=> handleChange(e)}  />
          </Form.Group>
          <Form.Group className='mb-1'>
            <Form.Label>PIN Code</Form.Label>
            <Form.Control
              type='number'
              name='pincode'
              placeholder='6 digits [0-9] PIN Code'
              onChange={(e)=> handleChange(e)} />
          </Form.Group>
          <Form.Group className='mb-1'>
            <Form.Label>Flat, House no, Building</Form.Label>
            <Form.Control type='text' name='home'
            onChange={(e)=> handleChange(e)}  />
          </Form.Group>
          <Form.Group className='mb-1'>
            <Form.Label>Town</Form.Label>
            <Form.Control type='text' name='town' 
            onChange={(e)=> handleChange(e)} />
          </Form.Group>
          <Form.Group className='mb-1'>
            <Form.Label>City</Form.Label>
            <Form.Control type='text' name='city' 
            onChange={(e)=> handleChange(e)} />
          </Form.Group>
          <Button variant='primary' className='mt-2' type='submit'>
            Add Address
          </Button>
        </Form>
      </div>
    </div>
  );}else if(address){

      return (address && <div className='grid grid-cols-3 gap-28'>
        <div className='flex flex-row gap-4'>
            <div className='text-2xl font-medium'>1</div>
            <div className='text-2xl font-medium'>Delivery Address</div>
        </div>
        <div>
        
               <div>
                
                  <div className='space-y-0'>
                    <p>{address.current.fullname}</p>
                    <p>{address.current.mobile}</p>
                    <p>{address.current.pincode}</p>
                    <p>{address.current.home}</p>
                    <p>{address.current.town}</p>
                    <p>{address.current.city}</p>
                  </div>
                
              </div>
            
        </div>
        <div>
            <button className='text-indigo-500' onClick={()=> setCheckoutSteps(0)}>Change</button>
        </div>
      </div>)
    }
  
}

export default AddAddress;