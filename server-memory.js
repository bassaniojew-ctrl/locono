const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// In-memory database
const db = {
  users: [],
  vendors: [],
  products: [],
  orders: [],
  subscriptions: [],
  chats: []
};

// Sample data for demonstration
const sampleProducts = [
  {
    _id: '1',
    name: 'Fresh Milk',
    description: 'Fresh cow milk delivered daily',
    category: 'groceries',
    subcategory: 'dairy',
    vendor: { _id: 'v1', businessName: 'Local Dairy Store' },
    price: 60,
    unit: 'l',
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
    subscriptionFrequency: ['daily'],
    rating: { average: 4.5, count: 120 },
    images: [{ url: '/images/milk.jpg', alt: 'Fresh Milk' }]
  },
  {
    _id: '2',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread',
    category: 'bakery',
    subcategory: 'bread',
    vendor: { _id: 'v2', businessName: 'Bakery Corner' },
    price: 45,
    unit: 'packet',
    stock: 50,
    isAvailable: true,
    isSubscriptionAvailable: true,
    subscriptionFrequency: ['daily', 'weekly'],
    rating: { average: 4.3, count: 89 },
    images: [{ url: '/images/bread.jpg', alt: 'Whole Wheat Bread' }]
  },
  {
    _id: '3',
    name: 'Samosa',
    description: 'Crispy potato samosa with chutney',
    category: 'street_food',
    subcategory: 'snacks',
    vendor: { _id: 'v3', businessName: 'Street Food Hub' },
    price: 15,
    unit: 'piece',
    stock: 200,
    isAvailable: true,
    isSubscriptionAvailable: false,
    rating: { average: 4.7, count: 156 },
    images: [{ url: '/images/samosa.jpg', alt: 'Samosa' }]
  },
  {
    _id: '4',
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings in sugar syrup',
    category: 'sweets',
    subcategory: 'milk_sweets',
    vendor: { _id: 'v4', businessName: 'Sweet Paradise' },
    price: 80,
    unit: 'box',
    stock: 30,
    isAvailable: true,
    isSubscriptionAvailable: false,
    rating: { average: 4.6, count: 78 },
    images: [{ url: '/images/gulab-jamun.jpg', alt: 'Gulab Jamun' }]
  }
];

// Initialize sample data
db.products = sampleProducts;

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, limit = 20 } = req.query;
  
  let products = [...db.products];
  
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  products = products.slice(0, parseInt(limit));
  
  res.json({
    products,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: products.length
    }
  });
});

// Search products
app.get('/api/products/search/:query', (req, res) => {
  const { query } = req.params;
  const products = db.products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
  res.json(products);
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  const products = db.products.filter(p => p.category === category);
  res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Compare products
app.post('/api/products/compare', (req, res) => {
  const { productIds } = req.body;
  const products = db.products.filter(p => productIds.includes(p._id));
  res.json(products);
});

// Authentication endpoints (simplified)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email && password) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: 'user1',
        name: 'Demo User',
        email: email,
        phone: '9876543210',
        role: 'customer'
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register/customer', (req, res) => {
  const { name, email, phone, password } = req.body;
  
  const newUser = {
    _id: 'user' + Date.now(),
    name,
    email,
    phone,
    role: 'customer',
    createdAt: new Date()
  };
  
  db.users.push(newUser);
  
  const token = 'mock-jwt-token-' + Date.now();
  res.status(201).json({
    message: 'Customer registered successfully',
    token,
    user: newUser
  });
});

app.post('/api/auth/register/vendor', (req, res) => {
  const { businessName, ownerName, email, phone, password, businessType } = req.body;
  
  const newVendor = {
    _id: 'vendor' + Date.now(),
    businessName,
    ownerName,
    email,
    phone,
    businessType,
    status: 'pending',
    createdAt: new Date()
  };
  
  db.vendors.push(newVendor);
  
  const token = 'mock-jwt-token-' + Date.now();
  res.status(201).json({
    message: 'Vendor registered successfully. Awaiting approval.',
    token,
    vendor: newVendor
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: 'user1',
      name: 'Demo User',
      email: 'demo@locono.com',
      phone: '9876543210',
      role: 'customer'
    }
  });
});

// Orders endpoints (simplified)
app.post('/api/orders', (req, res) => {
  const order = {
    _id: 'order' + Date.now(),
    orderNumber: 'LOC' + Date.now(),
    customer: 'user1',
    items: req.body.items || [],
    status: 'pending',
    createdAt: new Date()
  };
  
  db.orders.push(order);
  res.status(201).json({
    message: 'Order created successfully',
    order
  });
});

// Subscriptions endpoints (simplified)
app.post('/api/subscriptions', (req, res) => {
  const subscription = {
    _id: 'sub' + Date.now(),
    customer: 'user1',
    product: req.body.productId,
    quantity: req.body.quantity,
    frequency: req.body.frequency,
    status: 'active',
    createdAt: new Date()
  };
  
  db.subscriptions.push(subscription);
  res.status(201).json({
    message: 'Subscription created successfully',
    subscription
  });
});

// Chat endpoints (simplified)
app.post('/api/chat/ai/chat', (req, res) => {
  const { message } = req.body;
  
  let response = "Thank you for your message! I'm here to help with any questions about Locono.";
  
  if (message.toLowerCase().includes('subscription')) {
    response = "To subscribe for daily essentials like milk, bread, eggs, or curd, go to the subscription section on our homepage. You can choose your preferred frequency and delivery time!";
  } else if (message.toLowerCase().includes('delivery')) {
    response = "Our delivery radius varies by category: Groceries (20km), Bakery (30-40km), Street Food (25km), and Sweets (PAN-India). You can track your order in real-time!";
  } else if (message.toLowerCase().includes('price')) {
    response = "We offer transparent pricing with the ability to compare prices across different vendors. You can see all prices before ordering and choose the best deal!";
  }
  
  res.json({
    message: response,
    timestamp: new Date()
  });
});

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Locono server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
  console.log(`💡 This is a demo version with in-memory database`);
  console.log(`🔧 For full functionality, install MongoDB and use server.js`);
});

module.exports = app;
