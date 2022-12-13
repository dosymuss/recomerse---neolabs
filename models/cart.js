const {Schema, model} = require("mongoose")

const cartSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:"Product"
    }, 
    quantity: {
        type: Number,
        required:true,
        default: 1,
    }, 
    owner:  {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }, 
})
module.exports = model("Cart", cartSchema)