import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import Admin from "../model/admin.js";
import bcrypt from 'bcryptjs';
import Order from '../model/order.js';
import Category from "../model/Category.js";
import SubCategory from "../model/SubCategory.js";
import Brand from "../model/Brand.js";
import mongoose from "mongoose";
import Product from "../model/product.js";



export const loginAdmin = (req, res,next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(new Error("Required all field"));
    return new Promise(() => {
        Admin.findOne({ email: email }).then(response => {
            if (!response) return res.status(401).json("Admin not registered");
            bcrypt.compare(password, response.password).then(isOK => {
                if (isOK) {
                    const {email} = response
                    const admin = {email}
                    jwt.sign({ _id: admin._id }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, decoded) => {
                        if (err) throw err;
                        res.status(200).json({ admin, token: decoded })
                    })
                    
                } else {
                    res.status(401).json("Password incorrect")
                }
            }).catch(err => {
                
                next("Sorry!, Something went wrong. Please try again later")
            })
        }).catch(err => {
           
            next("Sorry!, Something went wrong. Please try again later")
        })
    })

}

export const signupAdmin = (req, res, next) => {
    const { email, password } = req.body;
    return new Promise((resolve, reject) => {
        Admin.findOne({ email: email }).then(admin => {
            if (admin) return res.status(401).json(new Error("Email already exist"));
            bcrypt.genSalt(8,(err,salt)=> {
                bcrypt.hash(password,salt).then(hashpassword=> {
                    new Admin({
                        email : email,
                        password: hashpassword
                    }).save()
                    .then(response=> {
                        res.status(201).json(response)
                    }).catch(err=> {
                        next("Sorry!, Something went wrong. Please try again later")
                    })
                }).catch(err=> {
                    next("Sorry!, Something went wrong. Please try again later")
                })
            })
            
        }).catch(err => {
            res.status(500).json(err)
        })
    })
}



export const getAllOrders = async(req, res,next)=> {
    
    try{
        let {page,limit} = req.body;
        limit = Number(limit) || 12
        
        page = (Number(page) - 1) * limit;
        
        const totalDocs = await Order.countDocuments();
        const totalpages = Math.ceil(totalDocs/limit);
        const orders = await Order.find({}).sort({_id:-1}).skip(page).limit(limit);
        
       
        
        if(orders.length > 0) {
            res.status(200).json({orders, totalpages});
        }else{
            res.status(404).json("No created in the database.")
        }
    }catch(err) {
        
        next("Sorry, Something went wrong. Please try again later")
    }
}
export const searchOrders = async(req, res ,next) => {
    try{
        let {page, limit, searchtext} = req.query;
        limit = Number(limit);
        page = (Number(page) - 1) * limit;
        const totalDocs = await Order.countDocuments({$text: {$search: searchtext}});
        const totalpages = Math.ceil(totalDocs/limit);
        const orders = await Order.find({$text: {$search: searchtext}})
        .sort({createdAt: -1})
        .skip(page)
        .limit(limit)
        
        if(totalpages && orders.length > 0) {
            
            res.status(200).json({orders, totalpages})
        }else{
            res.status(204).send()
        }

        
    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}
// export const getFilteredOrders = async(req, res)=> {
    
//     try{
//         let orders;
//         console.log(req.query)
//         let {query, page, limit} = req.query;
//         const {payment_method, status} = query;
//         page = (page-1) * limit;
        
//         if(payment_method && payment_method.length > 0 && status && status.length > 0) {
            
//             orders = await Order.find(
//                 {payment_method: {$in: payment_method}, status: {$in : status}})
//                 .skip(page)
//                 .limit(limit)
//         }else if(payment_method && payment_method.length > 0) {
            
//             orders = await Order.find({payment_method: {$in: payment_method}})
//             .skip(page)
//             .limit(limit)
//         }else if(status && status.length > 0) {
            
//             orders = await Order.find({status: {$in: status}})
//             .skip(page)
//             .limit(limit)
//         }
        
        
//         if(orders.length > 0) {
//            console.log(orders)
//             res.status(200).json({orders: orders})
//         }else{
           
//             res.status(204).json("No orders created")
//         }
//     }catch(err) {
//         
//         res.status(500).json(err)
//     }
// }

export const AddNewCategory = async(req, res)=> {
    try{
            console.log(req.body)
            const new_category = new Category(req.body)
            await new_category.save();
            res.status(201).json(new_category);
    }catch(err) {
        res.status(500).json(err.message)
    }
}

export const AddNewSubCategory = async(req, res,next)=> {
    try{
        
            const new_subcategory = new SubCategory(req.body)
            await new_subcategory.save();
            res.status(201).json(new_subcategory);

    }catch(err) {
        next("Sorry, Something went wrong.")
    }
}

export const AddBrand = async(req, res ,next)=> {
    try{
            
            const new_brand = new Brand(req.body)
            await new_brand.save();
            res.status(201).json(new_brand);

    }catch(err) {
        next("Sorry, Something went wrong.")
    }
}


export const editCategory = async(req, res , next)=> {
    const {categoryId} = req.params;
   
    return new Promise(()=> {
        Category.updateOne({_id: categoryId},{
            $set: req.body
        }).then(()=> {
            
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const editSubCategory = async(req, res, next)=> {
    const {subcategoryId} = req.params;
    return new Promise(()=> {
        SubCategory.updateOne({_id: subcategoryId},{
            $set: req.body
        }).then(()=> {
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const editBrand = async(req, res , next)=> {
    const {brandId} = req.params;
    if(brandId) {
        return new Promise(()=> {
        Brand.updateOne({_id: brandId},{
            $set: req.body
        }).then(()=> {
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
        })
    }else{
        res.status(401).json("Id is undefined")
    }
    
}
export const getOneCategory = async(req, res,next)=> {
    try{
            const {categoryId} = req.params;
            const category = await Category.findOne({_id: categoryId})
            if(!category) return res.status(404).json("Category not found");
            res.status(200).json(category)

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const getOneSubCategory = async(req, res, next)=> {
    try{
            const {subcategoryId} = req.params;
            const subcategory = await SubCategory.aggregate([
                {$match: {_id: new mongoose.Types.ObjectId(subcategoryId), is_deleted:false}},
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField:'_id',
                        as:'newcategory'
                    }
                },  
                {
                    $unwind: '$newcategory'
                }
            ])
            
            if(!subcategory) return res.status(404).json("Sub Category not found");
            res.status(200).json(subcategory[0])

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const getOneBrand = async(req, res,next)=> {
    try{
            const {brandId} = req.params;
            const brand = await Brand.aggregate([
                {$match: {_id: new mongoose.Types.ObjectId(brandId)}},
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as:'category'
                    }
                },
                {
                    $project: {
                        brand_name : 1,
                        is_deleted:1,
                        category: {$arrayElemAt: ['$category',0]}
                    }
                }
            ])
            
            if(!brand) return res.status(404).json("the requested Brand not found");
            res.status(200).json({brand:brand[0]})

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}


export const getAllCategory = async(req, res, next)=> {
    try{
            
            const categories = await Category.find({is_deleted:false}).sort({_id:-1})
            
            if(categories.length === 0) return res.status(204).send();
            res.status(200).json({categories:categories})

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")    }
}

export const getAllSubCategory = async(req, res ,next)=> {
    try{
            
            const subcategories = await SubCategory.aggregate([
                {$match: {is_deleted : false}},
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "newcategory"
                    }
                },
                {
                    $project: {
                        subcategory_name:1,
                        category: { $arrayElemAt: ['$newcategory', 0] }
                    }
                },
                {
                    $sort: {_id: -1}
                }
            ])
           
            if(subcategories.length === 0) return res.status(204).send();
            res.status(200).json({subcategories:subcategories})

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")    }
}

export const getAllBrand = async(req, res, next)=> {
    try{
            
            const brands = await Brand.aggregate([
                {$match: {is_deleted: false}},
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "newcategory"
                    }
                },
                {
                    $unwind: "$newcategory"
                },
                {
                    $sort: {_id: -1}
                }
                
            ])
            
            if(brands.length === 0) return res.status(204).send()
            
            res.status(200).json({brands:brands})

    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}
// Soft deleting an item from the category collection
export const deleteOneCategory  = async(req,res,next) => {
    const {categoryId} = req.params;
    return new Promise(()=> {
        Category.updateOne({_id: categoryId}, {
            $set: {is_deleted: true}
        }).then(()=> {
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const deleteOneSubcategory  = async(req,res,next) => {
    const {subcategoryId} = req.params;
    return new Promise(()=> {
        SubCategory.updateOne({_id: subcategoryId}, {
            $set: {is_deleted: true}
        }).then(()=> {
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const removeOneBrand = (req,res,next) => {
    const {brandId} = req.params;
    return new Promise(async()=> {
        Brand.updateOne({_id: brandId},{
            $set: {is_deleted: true}
        }).then(()=> {
            res.status(204).send()
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const removeBrandPermenantly = async (req, res,next) => {
    const { brandId } = req.params;
    try {
        const brand = await Product.findOne({ brand: brandId });
        if (brand) {
            return res.status(422).json({ error: `Can't delete! Brand is associated 
            with products. First remove or modify products associated with this brand.` });
        }
        await Brand.deleteOne({ _id: brandId });
        res.status(204).send()
    } catch (err) {
        
        next("Sorry, Something went wrong. Please try again later")
    }
};

export const removeCategoryPermenant = async(req, res, next) => {
    try{
        const {categoryId} = req.params;
        const category = await Product.findOne({category: categoryId});
        if(category) return res.status(422).json(`Can't delete! Category is associated 
        with products. First remove or modify products associated with this category.`);

        await Category.deleteOne({_id:categoryId})
        res.status(204).send()
    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}

export const removeSubCategoryPermenant = async(req, res, next) => {
    try{
        const {subcategoryId} = req.params;
        const subcategory = await Product.findOne({subcategory: subcategoryId});
        if(subcategory) return res.status(422).json(`Can't delete! Subategory is associated 
        with products. First remove or modify products associated with this subcategory.`);

        await SubCategory.deleteOne({_id:subcategoryId})
        res.status(204).send()
    }catch(err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}





