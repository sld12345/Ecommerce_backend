const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Serve images
app.use('/images', express.static('public/images'));

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');

// Default route
app.get('/', (req, res) => {
  res.send('🍞 Bakery E-commerce API is running!');
});

// CATEGORY ROUTES
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = new Category({ name, description, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PRODUCT ROUTES
app.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, image, unitType } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      unitType
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ OTP ROUTE
const otpRoutes = require('./routes/otp');
app.use('/api', otpRoutes);

// ✅ ORDER ROUTES
const orderRoutes = require('./routes/order');
app.use('/api', orderRoutes);

const customerRoutes = require("./routes/customer");
app.use("/api", customerRoutes);

const PORT = process.env.PORT || 5000;  // Use Render's port if available
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

