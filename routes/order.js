const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const Order = require('../models/Order');

// Place Order
router.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Generate QR code
    const qrData = `upi://pay?pa=abc&pn=BakeryStore&am=${order.total}&tn=Order%20Payment`;
    const qrImage = await QRCode.toDataURL(qrData);

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sld.dk123123@gmail.com",
        pass: "ilpoiwaqsovkvrco",
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: "sld.dk123123@gmail.com",
      to: order.email,
      subject: "Complete Your Payment",
      html: `
        <h3>Thank you for your order!</h3>
        <p>Total: ₹${order.total}</p>
        <img src="cid:paymentqr" style="width:220px;height:220px;" />
        <p>Once payment is confirmed, your order will be marked as paid.</p>
      `,
      attachments: [
        {
          filename: "payment-qr.png",
          content: qrImage.split("base64,")[1],
          encoding: "base64",
          cid: "paymentqr"
        }
      ]
    });

    res.status(201).json({ success: true, orderId: order._id, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Fetch Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
router.patch('/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
