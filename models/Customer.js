const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Home, Work
  address: { type: String, required: true },
  pincode: { type: String, required: true }
});

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  addresses: [addressSchema] // ✅ Array of addresses
});

module.exports = mongoose.model("Customer", customerSchema);