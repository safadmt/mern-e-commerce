import mongoose from "mongoose";

const ReviewandRatingSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    rating: {type:Number},
    review: {type: String}

},{timestamps:true});

const ProductReview = mongoose.model('ProductReview',ReviewandRatingSchema);
export default ProductReview;