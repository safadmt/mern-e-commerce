import mongoose from "mongoose";
const {Schema} = mongoose
const cartSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, 
        required: true , ref: 'User'},
        products: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number }
          }],
        totalamount: {type: Number}
}); 

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;