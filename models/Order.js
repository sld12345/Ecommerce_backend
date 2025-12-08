// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number,
      totalPrice: Number
    }
  ],
  address: String,
  pincode: String,
  deliveryDate: String,
  total: Number,
  placedAt: String,
  status: { type: String, default: 'pending' } // pending | paid | delivered
});

module.exports = mongoose.model('Order', orderSchema);
