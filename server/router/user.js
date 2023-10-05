import express from 'express';
import { userLogin, registerUser , userLogout, 
    addToCart,getCartCount, getCartProduct, 
    changeUserCartProductquantity,auth, 
    removeProductfromCart, 
     placeOrder,
    verfiyPayment, removeOrder, 
    getUserOrders,getAllUsers, 
    getOneOrder, getOneUser,
    editUserInfo,createNewOrder,
    getCartTotal, stripePayment} from '../controllers/user.js';

import { jwtAuth } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register',registerUser);
router.post('/login', userLogin);
router.get('/logout', userLogout);
router.post('/addtocart/:userid', jwtAuth, addToCart);
router.get('/cartcount/:userid', jwtAuth, getCartCount);
router.get('/cartproduct/:userid',jwtAuth, getCartProduct);
router.put('/incordecproductqty/:userid',jwtAuth, changeUserCartProductquantity);
router.get('/auth', jwtAuth, auth);
router.put('/removecartproduct/:userid', removeProductfromCart);
router.get('/carttotalprice/:userid', jwtAuth, getCartTotal);
router.post('/payment/place-order/:userid', jwtAuth, placeOrder);
router.post('/payment/verify-payment', jwtAuth, verfiyPayment);
router.delete('/order/remove-order/:orderid', jwtAuth, removeOrder);
router.get('/orders/:userid', getUserOrders);
router.get('/order/:orderid', getOneOrder);
router.get('/', getAllUsers);
router.get('/:id',jwtAuth, getOneUser);
router.put('/:id', jwtAuth, editUserInfo);
router.post('/stripe-payment-intent/:userid',jwtAuth, stripePayment)
router.post('/orders/create/:userid', jwtAuth, createNewOrder)

export default router;