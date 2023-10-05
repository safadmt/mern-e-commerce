import mongoose from "mongoose";
const {Schema} = mongoose
const categorySchema = new mongoose.Schema({
    category_name : {type: String, required: true},
    is_deleted : {type:Boolean, default: false}
});

const Category = mongoose.model("Category", categorySchema);
export default Category;