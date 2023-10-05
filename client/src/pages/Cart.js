import React, { useCallback, useEffect, useMemo, useState } from 'react'
import '../App.css';
import { useDispatch, useSelector } from 'react-redux'
import {
    changeProductqty, clearCarterr, getCartCount, getUserCart,
    removeProductfromCart
} from '../reduxtoolkit/cartReducer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTotalprice, userLogout } from '../reduxtoolkit/userReducer';

import { Alert } from 'react-bootstrap';
function Cart() {
    const { userid } = useParams()

    const dispatch = useDispatch();
    const Navigate = useNavigate()

    let user = useSelector(state => state.userInfo.user)
    const cartcount = useSelector(state => state.cartInfo.cartCount)
    const cartTotalPrice = useSelector(state => state.userInfo.carttotalamount)
    const cartInfo = useSelector(state => state.cartInfo.cartInfo);
    const deletedProduct = useSelector(state => state.cartInfo.deleted);
    const cartproductqty = useSelector(state => state.cartInfo.productqty)
    const cartError = useSelector(state => state.cartInfo.error)

    const [products, setProducts] = useState([]);
    const [totalprice, setTotalPrice] = useState(null)
    const [error, setError] = useState(null)

    user = JSON.parse(localStorage.getItem('user'))
    const clearError = () => {
        setTimeout(() => {
            setError(null);
            dispatch(clearCarterr())
        }, 3000);
    }



    useMemo(() => {
        if (user) {
            dispatch(getTotalprice(userid))
            dispatch(getCartCount(userid))
            dispatch(getUserCart(userid))

        }
    }, [cartproductqty, deletedProduct])


    useMemo(() => {

        if (cartInfo?.status === 200) {
            setProducts(cartInfo?.data?.response)
        } else if (cartInfo?.status === 204) {
            setError({ status: 204, error: 'Your cart is empty' })
        }

    }, [cartInfo])


    useMemo(() => {
        console.log(cartTotalPrice)
        if (cartTotalPrice) {
            setTotalPrice(cartTotalPrice?.totalamount)
        }
    }, [cartTotalPrice])

    useMemo(() => {
        if (cartError) {
            if (cartError?.response?.status == 403) {
                dispatch(clearCarterr())
                dispatch(userLogout());
                Navigate('/');

            } else if (cartError?.response?.status == 404) {

                setError(cartError?.response?.data || "Product is out of stock")
                clearError();

            } else if (cartError?.response?.status == 401) {

                setError(cartError.response.data)
                clearError()
            } else if (cartError?.response?.status == 500) {

                setError({ status: 500, error: cartError.response.data || "Oops!, Something went wrong. Please try again later" })

            }
        }
    }, [cartError])
    const handleChangeQuantity = (e, proqty, proid, value, price) => {
        e.preventDefault();

        if (user) {
            const productinfo = {
                userid: user._id,
                productid: proid,
                productqty: proqty,
                price: price,
                value: value
            }
            dispatch(changeProductqty(productinfo))

        }

    }

    const handleRemove = (e, productid, quantity, price) => {
        e.preventDefault();
        if (user) {
            const details = {
                productid: productid,
                userid: user._id,
                quantity: quantity,
                price: price
            }

            dispatch(removeProductfromCart(details))
            let deltepro = products.filter(product => product.newproducts._id !== productid);
            setProducts(deltepro)
        } else {
            dispatch(userLogout())
        }
    }
    if (products?.length > 0 && totalprice) {
        return (
            <div id='cartmaindiv' className='flex flex-row gap-4 ms-14 me-14 mt-6 '>

                <div className='cartdiv w-3/4 grid grid-cols-1'>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {products?.map((obj, index) => {
                        return <div key={index}>
                            <div id='cartimagediv' className='flex flex-row gap-28m p-6'>
                                <div className=''>

                                    <Link to={`/products/${obj.newproducts._id}`}><img
                                        src={`http://localhost:5000/images/${obj.newproducts.filename}`}
                                        style={{ height: "112px", width: "112px" }}></img></Link>
                                </div>
                                <div className='ms-4'>
                                    <p>{obj.newproducts.product_name ? obj.newproducts.product_name : obj.newproducts.description}</p>

                                    <div className='flex flex-row gap-2'>
                                        <div><i class="fa-solid fa-indian-rupee-sign"></i>
                                        </div><div><span className='font-medium'>  {obj.newproducts.price}</span></div></div>
                                </div>
                            </div>
                            <div className='flex flex-row gap-28 pb-2.5' >
                                <div className='flex flex-row ps-4 gap-2' >
                                    <div id='plusbtn' className='border-2 border-inherit rounded-full text-center font-medium'
                                        style={{ height: "30px", width: "30px" }}
                                        onClick={(e) => handleChangeQuantity(e, obj.products.quantity, obj.products.productId, -1, obj.newproducts.price)}>-</div>
                                    <div className='border-2 border-inherit text-center'
                                        style={{ height: "30px", width: "50px" }}>{obj.products.quantity}</div>
                                    <div id='minusbtn' className='border-2 border-inherit rounded-full text-center'
                                        style={{ height: "30px", width: "30px" }}
                                        onClick={(e) => handleChangeQuantity(e, obj.products.quantity, obj.products.productId, 1, obj.newproducts.price)}>+</div>
                                </div>
                                <div>
                                    <button className='font-medium'
                                        onClick={(e) => handleRemove(e, obj.newproducts._id, obj.products.quantity, obj.newproducts.price)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div className='cartdiv p-6 pt-4' style={{ maxHeight: '300px' }}>
                    <div className='p=2' style={{ borderBottom: "1px solid black" }}>
                        <p className='font-medium text-lg text-inherit'>Price Details</p>
                    </div>
                    <div className='mt-2'>
                        <div className='grid grid-cols-2'>
                            <div>Total items</div><div>{cartcount} items</div></div>
                        <div className='grid grid-cols-2'>
                            <div>Total price</div><div>{totalprice}</div></div>

                    </div>
                    <div className='mt-14'>
                        <div className='grid grid-cols-2 gap-12'>
                            <div className='font-medium text-medium text-inherit'>Total Amount</div>
                            <div className='font-medium text-medium text-inherit'>{totalprice}</div>
                        </div>
                    </div>
                    <div className='text-center mt-4 text-black'>
                        <Link to={`/checkout/${userid}`} 
                        className='border-2 bg-red-500 border-inherit rounded-xl ps-4 pe-4 p-2'>
                            Proceed to Checkout</Link>
                    </div>
                </div>
            </div>

        )
    } else if (error?.status === 204 || error?.status === 500) {

        return (
            <div>
                <div className='text-center mt-10'>
                    <div className='font-medium text-2xl'>{error.error}</div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className='text-center mt-10'>
                    <div className='font-medium text-2xl'>No proudcts in your cart</div>
                </div>
            </div>
        )
    }

}

export default Cart