import mongoose from 'mongoose';
import Admin from '../model/admin.js';
import Product from '../model/product.js';
import fs from 'fs';





export const createProduct = (req, res, next) => {
    console.log(req.file);
    console.log(req.body)
    const { category, price, product_name, subcategory, quantity, brand, gender, description } = req.body;
    console.log(description)
    const sanitizedDescription = description == "undefined" ? null : description
    return new Promise(() => {
        new Product({
            product_name: product_name == "undefined" ? null : product_name,
            category,
            subcategory,
            price:Number(price),
            quantity: Number(quantity),
            brand,
            gender,
            filename: req.file.filename,
            description: sanitizedDescription
        }).save()
            .then(response => {
                res.status(201).json(response)
            }).catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
    })
}

export const getAllProduct = (req, res, next) => {
    let { page, limit } = req.body;
    page = Number(page);
    limit = limit ? Number(limit) : 12;
    page = page ? (page - 1) * limit : 0 * limit;
    return new Promise(async () => {
        const totalproduct = await Product.countDocuments();
        const Totalpages = Math.ceil(totalproduct / limit)
        Product.aggregate([
            {
                $match: { is_deleted: false }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
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
                    localField: 'subcategory',
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
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            {
                $unwind: '$brandInfo'
            },
            {
                $sort: { _id: -1 },

            },
            {
                $skip: page
            },
            {
                $limit: limit
            }

        ]).then(products => {
            if (products.length > 0) {
                
                res.status(200).json({ products: products, totalpages: Totalpages })
            } else {
                res.status(204).send();
            }

        }).catch(err => {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const getOneProduct = (req, res , next) => {
    const { id } = req.params;
    return new Promise(() => {
        Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id), is_deleted: false }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
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
                    localField: 'subcategory',
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
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            {
                $unwind: '$brandInfo'
            }
        ]).then(response => {
            if(response) {
                res.status(200).json(response[0])
            }else {
                res.status(404).json("Sorry !, The requested product not found")
            }
            
        }).catch(err => {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const getSearchProduct = async (req, res , next) => {
    try {
        if (!req.body) return res.status(401).json("Please include the search term")
        const { searchText } = req.body;
        console.log(searchText)
        let Totalpages = await Product.countDocuments({$text: {$search: searchText}})
        Totalpages = Math.ceil(Totalpages/12)
        const searchResults = await Product.aggregate([
            {
                $match: {
                    is_deleted : false,
                    $text: {
                        $search: searchText
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategoryInfo'
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            
            {
                $project: {
                    product_name: 1,
                    price: 1,
                    quantity: 1,
                    filename: 1,
                    gender: 1,
                    description: 1,
                    categoryInfo: { $arrayElemAt: ['$categoryInfo',0]},
                    subcategoryInfo: {$arrayElemAt: ['$subcategoryInfo',0]},
                    brandInfo: {$arrayElemAt: ['$brandInfo',0]},
                    is_deleted: 1
                }
            }
        ])
        
        if (!searchResults) return res.status(204).json("Search results not found");
        res.status(200).json({ products: searchResults ,totalpages: Totalpages});
    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }

}

export const editProduct = (req, res , next) => {

    const { id } = req.params
    if (req.params.id === undefined || req.params.id === null)
        return res.status(401).json("Required product Id")
    console.log(req.body)
    const { brand, price, product_name, subcategory, quantity, category, description, gender } = req.body;
    return new Promise(async (resolve, reject) => {
        const product = await Product.findOne({ _id: id });
        console.log(product)

        if (req.file) {
            Product.updateOne({ _id: id }, {
                $set: {
                    product_name: (product_name == 'undefined' || product_name === null) ? null : product_name,
                    subcategory,
                    brand,
                    price,
                    gender,
                    quantity,
                    category,
                    description: (description == 'undefined' || description === null) ? null : description,
                    filename: req.file.filename,

                }
            }).then(response => {
               

                const filepath = `./public/images/${product.filename}`
                fs.unlink(filepath, err => {
                    if (err) throw err,
                        console.log("file deleted");
                })
                res.status(200).json(response);
            })
                .catch(err => {
                    next("Sorry, Something went wrong. Please try again later")
                })
        } else {
            Product.updateOne({ _id: id }, {
                $set: {
                    product_name: (product_name == 'undefined' || product_name === null) ? null : product_name,
                    subcategory: subcategory,
                    brand,
                    price,
                    quantity,
                    category,
                    gender,
                    description: (description == 'undefined' || description === null) ? null : description
                }
            }).then(response => {
                res.status(200).json(response);
            })
                .catch(err => {
                    next("Sorry, Something went wrong. Please try again later")
                })
        }
    })
}

export const softDeleteProduct = (req, res, next) => {
    const { id } = req.params;
    return new Promise(() => {
        Product.updateOne({ _id: id }, {
            $set: { is_deleted: true }
        }).then(response=> {
            res.status(204).json(response)
        }).catch(err=> {
            next("Sorry, Something went wrong. Please try again later")
        })
    })
}

export const deleteProduct = (req, res, next) => {
    const { id } = req.params
    return new Promise((resolve, reject) => {
        Product.findOne({ _id: id })
        .then(product => {

            Product.deleteOne({ _id: id }).then(response => {
                const filepath = `./public/images/${product.filename}`
                fs.unlink(filepath, err => {
                    if (err) throw err,
                        console.log("file deleted");
                })
                res.status(204).json("deleted");
            })
        })
            .catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
    })
}

export const getProductByPrice = async (req, res, next) => {
    return new Promise(() => {

        let { value, page, limit } = req.body;
        page = Number(page);
        limit = Number(limit)
        value = Number(value)
        page = (page - 1) * limit

        return new Promise(async () => {
            const totalproduct = await Product.countDocuments();
            const Totalpages = Math.ceil(totalproduct / limit)
            Product.aggregate([
                {
                    $match: { is_deleted: false }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
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
                        localField: 'subcategory',
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
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brandInfo'
                    }
                },
                {
                    $unwind: '$brandInfo'
                },
                {
                    $sort: { price: value }

                },
                {
                    $skip: page
                },
                {
                    $limit: limit
                }

            ]).then(products => {
                if (products.length > 0) {

                    res.status(200).json({ products: products, totalpages: Totalpages })
                } else {
                    res.status(204).json("Product not found")
                }

            }).catch(err => {
                next("Sorry, Something went wrong. Please try again later")
            })
        })
    })

}

export const getFilteredProducts = async (req, res, next) => {
    try {

        let { page, limit, filteredItems } = req.query;
        console.log(req.query)
        let { brand, price, category, gender, subcategory } = filteredItems;
        if ((brand && brand.length === 0) && (category && category.length === 0) &&
            (gender && gender.length === 0) && (subcategory && subcategory.length === 0) &&
            (!price || (typeof price === Array && price.length === 0)))
            return res.status(401).json("Not selected any filtering item")

        limit = limit ? Number(limit) : 12
        page = page ? (parseInt(page) - 1) * limit : 0 * limit;



        let filter = {}
        if (brand && brand.length > 0) {
            const brandId = brand.map(item => new mongoose.Types.ObjectId(item))
            filter.brand = { $in: brandId }
        }
        if (category && category.length > 0) {
            const categoryId = category.map(item => new mongoose.Types.ObjectId(item))
            filter.category = { $in: categoryId }
        }
        if (gender && gender.length > 0) {
            filter.gender = { $in: gender }
        }
        if (subcategory && subcategory.length > 0) {
            const subcategoryId = subcategory.map(item => new mongoose.Types.ObjectId(item))
            filter.subcategory = { $in: subcategoryId }
        }
        if (price) {
            console.log(price)
            price = (typeof price === Array && price.length > 0) ? price[0] : price;
            switch (price) {
                case 'lt 1000':
                    filter.price = { $lt: 1000 }
                    break;
                case 'gt 1000 lt 2000':
                    filter.price = { $gte: 1000, $lt: 2000 }
                    break;
                case 'gt 2000':
                    filter.price = { $gte: 2000 }
                    break;
                default:
                    filter.price = { $gte: 1 }
            }
        }


        const totaldocument = await Product.countDocuments(filter);
        const Totalpages = Math.ceil(totaldocument / limit)
        const filteredProducts = await Product.aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
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
                    localField: 'subcategory',
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
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            {
                $unwind: '$brandInfo'
            },
            {
                $sort: { price: 1 },

            },
            {
                $skip: page
            },
            {
                $limit: limit
            }

        ])

        if (filteredProducts.length > 0) {

            res.status(200).json({ products: filteredProducts, totalpages: Totalpages })
        } else {
            res.status(204).json("No products match filtered items")
        }

    } catch (err) {
        next("Sorry, Something went wrong. Please try again later")
    }
}
