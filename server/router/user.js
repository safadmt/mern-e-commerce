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

import { addRating, addReview, getAverageProductRating, getProductReviews } from '../controllers/product.js';
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
router.get('/orders/:userid',jwtAuth, getUserOrders);
router.get('/order/:orderid', getOneOrder);
router.get('/', getAllUsers);
router.get('/:id',jwtAuth, getOneUser);
router.put('/:id', jwtAuth, editUserInfo);
router.post('/stripe-payment-intent/:userid',jwtAuth, stripePayment)
router.post('/orders/create/:userid', jwtAuth, createNewOrder)
router.post('/product-review/:productId',jwtAuth, addReview);
router.post('/product-rating/:productId',jwtAuth, addRating);
router.get('/product-reviews/:productId', getProductReviews);
router.get('/product/average-rating/:productId', getAverageProductRating);
export default router;