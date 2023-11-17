import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken';
import Cart from '../model/cart.js';
import Product from '../model/product.js';

import mongoose from 'mongoose';
import Order from '../model/order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto'
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// user login authenication
export const userLogin = (req, res,next) => {

    const { email, password } = req.body

    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then(response => {
            if (!response) { return res.status(401).json("User not registered") };

            bcrypt.compare(password, response.password)
                .then(isTrue => {
                    if (!isTrue) return res.status(401).json("Password incorrect");
                    const { name, email, _id } = response;
                    const user = { name, email, _id }
                    jwt.sign({ _id: response._id }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, decoded) => {
                        if (err) throw err;
                        res.status(200).json({ user, token: decoded })
                    })
                })
                .catch(err => {
                    next("Sorry, Something went wrong. Please try again later")
                })

        })
    })
}

//registering new user in the User collection
export const registerUser = (req, res, next) => {

    const { email, name, password } = req.body

    return new Promise(async (resolve, reject) => {
        const salt = await bcrypt.genSalt();
        User.findOne({ email: email }).then(userinfo => {
            if (userinfo) {
                return res.status(401).json("User already registerd");
            } else {
                bcrypt.hash(password, salt)
                    .then(hashpassword => {

                        User.create({
                            name: name,
                            email: email,
                            password: hashpassword
                        }).then(response => {
                            const { name, email, _id } = response;
                            const user = { name, email, _id }
                            jwt.sign({ _id: response._id }, process.env.SECRET_KEY, { expiresIn: '4h' }, (err, decoded) => {
                                if (err) throw err;
                                res.status(200).json({ user, token: decoded })
                            })
                        }).catch(err => res.status(500).json(err.message))
                    })
                    .catch(err => {

                        res.status(500).json(err.message)
                    })
            }

        })
            .catch(err => {

                next("Sorry, Something went wrong. Please try again later")
            })
    })
}

//adding products to the user Cart when clicking the add button
export const addToCart = (req, res, next) => {
    const { _id } = req.user
    const { proid, price } = req.body;
    const obj = {
        productId: proid,
        quantity: 1
    }
    return new Promise(async (resolve, reject) => {
        const product = await Product.findOne({ _id: proid }, { quantity: 1 });
        const user = await Cart.findOne({ userId: _id });

        //if the user selected  product quantity greater than 0 , 
        if (product.quantity > 0) {
            // if user have products in the cart
            if (user) {
                if (user.products.length > 0) {
                    //Checking user selected product in the user cart products array
                    const isCurrentProtrue = user.products.some(obj => obj.productId == proid)

                    if (isCurrentProtrue) {
                        //getting the current quantity of product in the user cart products
                        const currentProduct = user.products.find(obj => obj.productId == proid)
                        const { quantity } = currentProduct
                        //increment by 1 
                        const desiredquantity = quantity + 1;
                        //checking actual product quantity from product collection
                        // greater than user selected
                        // product in the user cart products array
                        if (product.quantity >= desiredquantity) {
                            Cart.updateOne({ userId: _id, 'products.productId': proid }, {
                                $set: {
                                    'products.$.quantity': 1
                                }

                            }, { new: true }).then(response => {
                                res.status(200).json(response)
                            }).catch(err => res.status(500).json(err))
                        } else {
                            res.status(404).json("Product out of stock")
                        }

                    } else {
                       
                            Cart.updateOne({ userId: _id }, {
                                $push: { products: obj }  
                            }).then(response => {
                                res.status(200).json(response)
                            }).catch(err => res.status(500).json(err))
                       
                    }

                } else {
                   
                        Cart.updateOne({ userId: _id }, {
                            $push: { products: obj }
                        }).then(response => {
                            res.status(200).json(response)
                        }).catch(err => res.status(500).json(err))
                    
                }
            } else {
             
                    Cart.create({
                        userId: _id,
                        products: [obj]
                    }).then(response => {
                        res.status(201).json(response)
                    }).catch(err => res.status(500).json(err.message))
             

            }


        } else {
            next("Sorry, Something went wrong. Please try again later")
        }
    })
}

export const getCartCount = async (req, res, next) => {
    const { userid } = req.params
    return new Promise(async () => {
        Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userid) } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$_id",
                    totalquantity: { $sum: "$products.quantity" }
                }
            }
        ]).then(count => {
            if (count.length > 0) {
                res.status(200).json(count[0].totalquantity)
            } else {
                res.status(200).json(0)
            }

        }).catch(err => next("Sorry, Something went wrong. Please try again later"))

    })
}

export const getCartProduct = (req, res,next) => {
    const { userid } = req.params;
    return new Promise(async () => {
        
        Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userid) } },
            { $unwind: "$products" },

            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: "_id",
                    as: "newproducts",
                },
            },
            {
                $project: { "products.productId": 1, "products.quantity": 1, newproducts: { $arrayElemAt: ["$newproducts", 0] } }
            }
        ]).then(response => {
            if (response.length > 0) {
                res.status(200).json({response:response})
            } else {

                res.status(204).send()
            }

        })
            .catch(err => next("Sorry, Something went wrong. Please try again later"))

    })


}

export const changeUserCartProductquantity = (req, res,next) => {
    return new Promise(async () => {
        const { userid } = req.params;
        console.log(req.body)
        let { value, proid, productqty, price } = req.body
        value = parseInt(value)
        productqty = parseInt(productqty);
        price = parseInt(price)

        if (value == -1 && productqty == 1)
            return res.status(401).json("Minimum quantity is required")
       
        
        const product = await Product.findOne({ _id: proid }, { quantity: 1 })

        if (value == 1 && product.quantity >= (productqty + 1)) {

            Cart.updateOne({ userId: userid, 'products.productId': proid }, {
                $set: {
                    'products.$.quantity': productqty + 1,
                }
                
            }).then(response => {
                res.status(200).json(response)
            }).catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
        } else if (value === -1 && product.quantity >= (productqty - 1) && productqty !== 1) {

            Cart.updateOne({ userId: userid, 'products.productId': proid }, {
                $set: {
                    'products.$.quantity': productqty-1,
                    
                }
                
            }).then(response => {
                res.status(200).json(response)
            }).catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
        } else if (product.quantity === 0) {
            res.status(404).json("Product out of stock")
        } else if(value == 1 && product.quantity < (productqty + 1)) {
            res.status(404).json("Product out of stock")
        }
    })




}

export const auth = (req, res) => {
    res.status(200).json("Ok")
}

export const removeProductfromCart = (req, res,next) => {
    const { userid } = req.params;
    let { productid,quantity } = req.body.productinfo
    return new Promise(async () => {
        
        quantity = parseInt(quantity);
        
        const usercart = await Cart.findOne({ userId: userid })
        const newusercart = usercart.products.filter(obj => obj.productId.toString() !== productid)
        usercart.products = newusercart;
        usercart.save().then(response => {
            res.status(200).json(response)
        }).catch(err => {

            next("Sorry, Something went wrong. Please try again later")
        })

    })
}

export const getCartTotal = async (req, res,next)=> {
    
        try {

        const { userid } = req.params;
        const totalamount = await Cart.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(userid)},
                
             },
             {
                $unwind: '$products'
             },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            {
                $unwind: '$productInfo'
            },
            {
                $group: {
                    _id: null,
                    totalamount: {
                        $sum : {$multiply: ['$products.quantity', '$productInfo.price']}
                    }
                }
            }
            
        ])
        res.status(200).json(totalamount[0])
    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }
    
}



export const userLogout = (req, res,next) => {
    try {
        res.clearCookie('token');
        res.status(200).json("logout success");
    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const placeOrder = async (req, res,next) => {
    return new Promise(async () => {
        const { amount, payment_method, address_details } = req.body;
        console.log(req.body)
        if(!req.body || !amount || !payment_method || !address_details) {
            res.status(400).json("Payment method undefined")
        } else {
            const { userid } = req.params
            

            const usercart = await Cart.findOne({ userId: userid });
            
        const status = payment_method == "cash_on_delivery" ? "Placed" : "Pending";
        const orderplace = {
            userId: userid,
            products: usercart.products,
            shipping_address: address_details,
            payment_method,
            totalamount: amount,
            status: status
        }
        const neworder = await Order.create(orderplace)
        if (payment_method == "cash_on_delivery") {
            
            //Use promise chaining to update product quantities
            const promises = usercart.products.map(product => {
                return Product.updateOne({ _id: product.productId }, {
                    $inc: { quantity: -product.quantity }
                })
            })

            Promise.all(promises)
                .then((response) => {
                    console.log(response)
                    return Cart.deleteOne({ userId: userid })

                }).then(response => {
                    console.log(response)
                    res.status(200).json({ neworder: neworder, status: "placed" });
                })
                .catch(err => {
                    next("Sorry, Something went wrong. Please try again later")
                });


        } else if (payment_method == "razorpay") {
            var options = {
                amount: neworder.totalamount * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + neworder._id
            };
            instance.orders.create(options, function (err, order) {
                if (err) return res.status(400).json(err)

                res.status(200).json({ order: order, status: "pending" })

            })
        }



        }
        
    })
}

export const verfiyPayment = async (req, res,next) => {
    const { _id } = req.user;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response
    return new Promise(async () => {
        let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        hmac = hmac.digest('hex')
        if (hmac == razorpay_signature) {
            await Order.updateOne({ _id: req.body.orderid }, {
                $set: { status: "placed" }
            })
            const orders = await Order.findOne({ _id: req.body.orderid }, { products: 1 })

            const promiseproduct = orders.products.map(product => {
                return Product.updateOne({ _id: product.productId }, {
                    $inc: { quantity: -product.quantity }
                })
            })

            Promise.all(promiseproduct)
                .then(response => {
                    return Cart.deleteOne({ userId: _id })
                }).then(response => {
                    res.status(200).json("success")
                }).catch(err => {
                    next("Sorry, Something went wrong. Please try again later")
                })


        }
    })
}

export const removeOrder = async (req, res, next) => {
    return new Promise(() => {
        const { orderid } = req.params;
        Order.deleteOne({ _id: orderid }).then(response => {
            res.status(200).json(response)
        })
            .catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
    })
}

export const getUserOrders = async (req, res ,next) => {
    try {
        console.log(req.params.userid)
        const { userid } = req.params;

        const orders = await Order.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(userid)}
            },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'newproduct'
                }
            },
            {
                $unwind: '$newproduct'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'newproduct.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'newproduct.subcategory',
                    foreignField: '_id',
                    as: 'subcategoryInfo'
                }
            },
            {
                $unwind: '$subcategoryInfo'
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'newproduct.brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            {
                $unwind: '$brandInfo'
            },
            {
                $group: {
                    _id: '$_id',
                userId: { $first: '$userId' },
                shipping_address: { $first: '$shipping_address' },
                payment_method: { $first: '$payment_method' },
                status: { $first: '$status' },
                totalamount: { $first: '$totalamount' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                orders: {
                   $push: {product_name: '$newproduct.product_name',_id: '$newproduct._id',
                category: '$categoryInfo.category_name',subcategory: '$subcategoryInfo.subcategory_name',
                brand: '$brandInfo.brand_name',price: '$newproduct.price', quantity: '$products.quantity',
                gender: '$newproduct.gender', filename: '$newproduct.filename',
                 description: '$newproduct.description'}
                    
                }}
            }
            
        ])
       
        if(orders.length > 0) {
            res.status(200).json(orders)
        } else {
            res.status(404).json("No orders created yet")
        }
        
    } catch (err) {
        
        next("Sorry, Something went wrong. Please try again later")
    }
}
// $project: { "products.productId": 1, "products.quantity": 1,
//  "totalamount": 1, newproducts: { $arrayElemAt: ["$newproducts", 0] } }
export const getOneOrder = async (req, res ,next) => {
    if(!req.params.orderid) return res.status(400).json("Order id is undefined")
    try {
        Order.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.orderid) }
            },

            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'orderproduct'
                }
            },
            {
                $unwind: '$orderproduct'
            },
            {
                $group: {
                    _id: '$_id',
                    userId: {$first: '$userId'},
                    address: {$first:'$address'},
                    payment_method: {$first:'$payment_method'},
                    totalamount: {$first:'$totalamount'},
                    createdAt: {$first:'$createdAt'},
                    status: {$first:'$status'},
                    shipping_address: {$first:'$shipping_address'},
                    productId: {$first:'$products.productId'},
                    quantity: {$first: '$products.quantity'},
                    orderDetails: {
                        $push: {_id: '$orderproduct._id', product_name: '$orderproduct.product_name',
                        category: '$orderproduct.category', subcategory: '$orderproduct.subcategory',
                        price: '$orderproduct.price', quantity: '$orderproduct.quantity',
                        filename: '$orderproduct.filename', description: '$orderproduct.description'}
                    }
                }
            }
            // {
            //     $project: {
            //         userId: 1,
            //         address: 1,
            //         payment_method: 1,
            //         totalamount: 1,
            //         createdAt: 1,
            //         status: 1,
            //         shipping_address:1,
            //         productId: '$products.productId',
            //         quantity: '$products.quantity',
            //         orderproduct: { $arrayElemAt: ['$orderproduct', 0] }
            //     }
            // }

        ]).then(response => {
            if(!response) return res.status(404).json("Requested order not found")
            console.log(response)
            res.status(200).json(response[0]);
        })

    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 });
        console.log(users)
        console.log('Hello world')
        if (users.length <= 0) {
            res.status(204).json("No users found")
        } else if (users.length > 0) {
            res.status(200).json(users);
        }
    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}


export const getOneUser = async(req, res ,next)=> {
    try{
        const {id} = req.params;
        const user = await User.findOne({_id: id},{password:0})
        if(!user) return res.status(404).json("User not found")
        res.status(200).json(user)
    }catch(err) {
        res.status(500).json(err)
    }
}

export const editUserInfo = async(req,res)=> {
    
    try{
        const {id} = req.params;
        console.log(id)
    const {name, email, current_password, new_password, confirm_password} = req.body;
    let userInfo;
    if(!name && !email && !current_password && !new_password && !confirm_password) {
        return res.status(401).json("user creadentials required")
    }
    const user = await User.findOne({_id: id}); 
    if(name) {
        
        user.name = name;
        const new_user = await user.save();
        console.log(new_user)
        res.status(200).json(new_user)
       
            
        
    }
    if(email) {
        console.log(email)
        const isEmailused = await User.findOne({email: email});
        if(isEmailused) return res.status(401).json("Email already registered")
        user.email = email;
        const new_user = await user.save();
        console.log(new_user)
        res.status(200).json(new_user)
        
    }

    if(current_password && new_password && confirm_password) {
        
            const isPasswordtrue = await bcrypt.compare(current_password, user.password)
            if(!isPasswordtrue) return res.status(401).json("Incorrect current password")

            const genSalt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(new_password,genSalt);
            user.password = hashedPassword
            const new_user = await user.save();
            if(new_user) {
                res.status(200).json(new_user)
            }else {
                console.log(new_user)
            }
        
    }
    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
    

}

export const stripePayment = async(req,res,next) => {
    
    const {userid} = req.params
    console.log(req.body)
    let { totalamount} = req.body

    try{
        totalamount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalamount * 100,
            currency: "inr",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
              enabled: true,
            },
          });
        
          res.json  ({
            clientSecret: paymentIntent.client_secret,
          });
        
    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const createNewOrder = (req,res,next) => {
    const {userid} = req.params
    console.log(req.body)
    return new Promise(async()=> {
        const {shipping_address, totalamount} = req.body
        const usercart = await Cart.findOne({userId: userid});

        const neworder =  new Order({
            userId: userid,
            products: usercart.products,
            shipping_address,
            payment_method: 'stripe',
            status: 'Placed',
            totalamount
        })

        await neworder.save();

        const promiseproduct = usercart.products.map(item=> {
            Product.updateOne({_id: item.productId}, {
                $inc: {quantity: -item.quantity}
            })
        })

        Promise.all(promiseproduct)
        .then(()=> {
            return Cart.deleteOne({_id: usercart._id})
        })
        .then(()=> {
            res.status(200).json('success')
        })
        .catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    
    })
        
}

