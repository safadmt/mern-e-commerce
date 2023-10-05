import mongoose from "mongoose";
const {Schema} = mongoose
const subCategorySchema = new mongoose.Schema({
    subcategory_name : {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    is_deleted : {type:Boolean, default: false}
});

const SubCategory = mongoose.model("Subcategory", subCategorySchema);
export default SubCategory;