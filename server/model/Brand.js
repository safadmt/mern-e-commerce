import mongoose from "mongoose";
const {Schema} = mongoose
const brandSchema = new mongoose.Schema({
    brand_name : {type: String, required: true},
    category : {type: mongoose.Schema.Types.ObjectId,ref:"Category", required: true},
    is_deleted : {type : Boolean, default: false}
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;