    import mongoose from "mongoose";
    const productSchema = new mongoose.Schema({
        product_name: {type: String},
        category: {type: mongoose.Schema.Types.ObjectId ,ref:'Category', required: true},
        subcategory: {type: mongoose.Schema.Types.ObjectId ,ref: 'SubCategory',required: true},
        price: {type: Number , required: true},
        quantity: {type: Number , required: true},
        gender: {type: String ,enum:["Men", "Women"],required: true},
        brand: {type: mongoose.Schema.Types.ObjectId ,ref:'Brand',required: true},
        filename: {type: String , required: true},
        description: {type: String},
        is_deleted : {type:Boolean, default: false}

    }, { timestamps: true});

    productSchema.index({description: 'text',gender: 'text',product_name: 'text'});
   
   

    const Product = mongoose.model("Product", productSchema);
    export default Product;