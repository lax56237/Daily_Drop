const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerOrderSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    customer: {
        name: String,
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            landmark: String
        }
    },
    itemName: String,
    quantity: Number,
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    delivery_status: {
        type: String,
        enum: ['ready', 'ondelivery', 'delivered'],
        default: 'ready'
    }
});

module.exports = mongoose.model('SellerOrder', sellerOrderSchema);
