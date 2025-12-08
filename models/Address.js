// models/Address.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true }, // e.g., "Home", "Work"
  address: { type: String, required: true },
  pincode: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Address", addressSchema);