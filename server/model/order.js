import mongoose from "mongoose";
const {Schema} = mongoose
const OrderSchema = new mongoose.Schema({
    userId : {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number }
      }],
    shipping_address: {type: Object, required : true},
    payment_method: {type: String ,enum: ['razorpay', 'stripe', 'cash_on_delivery'] ,required:true},
    status : {type: String,enum: ['Placed', 'Pending','cancelled'], reqired : true},
    reason_for_cancellation: {type: Object},
    totalamount : {type: Number, required: true}

}, {timestamps:true});
OrderSchema.index({payment_method: 'text' ,status: 'text'})
const Order = mongoose.model("Orders", OrderSchema);
export default Order;