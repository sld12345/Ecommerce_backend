const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// -------------------------
// ✅ Static routes first
// -------------------------

// Check if customer exists
router.post("/check-customer", async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });

    if (customer) {
      res.json({ exists: true, customer });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new customer
router.post("/add-customer", async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    let existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Customer already exists" });
    }

    const customer = new Customer({ email, name, phone });
    await customer.save();

    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ error: "Failed to save customer" });
  }
});

// Simulated login via OTP (for demo, always OTP = 1234)
router.post("/login", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otp !== "1234") {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // In real life, create JWT token
    res.json({
      success: true,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// -------------------------
// ✅ Dynamic routes below
// -------------------------

// Get full customer profile (name, phone, addresses)
router.get("/:email", async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    if (!customer) {
      return res.json({
        email: req.params.email,
        name: "",
        phone: "",
        addresses: []
      });
    }
    res.json(customer);
  } catch (err) {
    console.error("❌ Error fetching customer:", err.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// Update profile (name, phone, addresses)
router.put("/:email", async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { email: req.params.email },
      { $set: { name, phone, addresses } },  // ✅ update all fields
      { new: true, upsert: true }
    );

    res.json(customer);
  } catch (err) {
    console.error("❌ Error updating profile:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Add new address
router.post("/:email/address", async (req, res) => {
  try {
    const { name, address, pincode } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { email: req.params.email },
      { $push: { addresses: { name, address, pincode } } },
      { new: true, upsert: true }
    );

    const newAddress = customer.addresses[customer.addresses.length - 1]; // last added
    res.json({ address: newAddress });  // ✅ matches frontend expectation
  } catch (err) {
    res.status(500).json({ error: "Failed to add address" });
  }
});

// Delete address
router.delete("/:email/address/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { email: req.params.email },
      { $pull: { addresses: { _id: req.params.id } } },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    console.error("❌ Error deleting address:", err.message);
    res.status(500).json({ error: "Failed to delete address" });
  }
});


module.exports = router;
