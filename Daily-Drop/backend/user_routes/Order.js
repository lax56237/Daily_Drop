const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  email: String,
  items: [itemSchema],
  totalPrice: Number,
  delivery_status: {
    type: String,
    enum: ['ready', 'ondelivery', 'delivered'],
    default: 'ready'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema); 