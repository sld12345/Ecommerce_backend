// backend/routes/otp.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

let currentOtp = null;

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();

 const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
     user: "sld.dk123123@gmail.com",
     pass: "ilpoiwaqsovkvrco", // Use your Gmail App Password
   },
   tls: {
     rejectUnauthorized: false,
   },
 });

  const mailOptions = {
    from: 'sld.dk123123@gmail.com',
    to: email,
    subject: 'Your OTP for Order Confirmation',
    text: `Your OTP is: ${currentOtp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully', otp: currentOtp }); // remove otp in production
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

module.exports = router;
