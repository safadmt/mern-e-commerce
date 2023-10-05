import React from 'react'
import {AiOutlineInstagram ,AiOutlineMail, AiFillFacebook} from 'react-icons/ai'
import '../App.css';

function Footer() {
    
  return (
    <div id='footer'>
        <div className=''>
            <div className='font-medium text-2xl text-center'>About Us</div>

            <div>
                <ul className='text-center'>
                    <li>ShoppersShop.com</li>
                    <li>shoppersshop@gmail.com</li>
                    <li>123, ABC Street,XYZ Layout,Bangalore - 560001,Karnataka, India.</li>
                </ul>
            </div>
        </div>
        <div>
            <div className='font-medium text-2xl text-center'>Connect Us</div>
            <div className=''>
                <ul className='d-flex gap-x-1.5 justify-content-center'>
                    <li><AiOutlineInstagram className='text-2xl inline'/></li>
                    <li><AiOutlineMail className='text-2xl inline'/></li>
                    <li><AiFillFacebook className='text-2xl inline'/></li>
                </ul>
            </div>
        </div>
        <div>
            <div className='font-medium text-2xl text-center'>Important Links</div>

            <div>
                <ul className='text-center'>
                    <li>Important Links</li>
                    <li>Terms & Conditions</li>
                    <li>Privacy Policy</li>
                    <li>Refund and Returns Policy</li>
                    <li>Product Purchase Flow</li>
                    <li>Contact us</li>
                    <li>Pricing</li>

                </ul>
            </div>
        </div>
    </div>
  )
}

export default Footer