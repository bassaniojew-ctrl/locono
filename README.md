# Locono - Hyperlocal Marketplace Platform

A comprehensive hyperlocal marketplace platform connecting customers with local vendors for groceries, bakery items, street food, and sweets.

## 🚀 Features

### Customer Features
- **Multi-category Shopping**: Groceries, Bakery, Street Food, Sweets
- **Smart Search & Comparison**: Find and compare prices across vendors
- **Multi-vendor Cart**: Add items from different vendors
- **Daily Subscriptions**: Subscribe for essentials like milk, bread, eggs, curd
- **Real-time Order Tracking**: Track orders from preparation to delivery
- **Chat Support**: Direct communication with vendors and AI chatbot
- **Price Transparency**: Compare prices and save money

### Vendor Features
- **Easy Registration**: Simple vendor onboarding process
- **Product Management**: Add, edit, and manage product listings
- **Order Management**: Accept, prepare, and track orders
- **Subscription Management**: Handle daily essential subscriptions
- **Sales Dashboard**: View analytics and performance metrics
- **Customer Communication**: Chat with customers directly

### Admin Features
- **Vendor Approval**: Review and approve vendor applications
- **Platform Management**: Manage users, products, and orders
- **Analytics Dashboard**: Comprehensive platform analytics
- **Notification System**: Send notifications to users and vendors
- **Content Moderation**: Manage products and user content

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design principles

## 📁 Project Structure

```
locono-marketplace/
├── models/                 # Database models
│   ├── User.js
│   ├── Vendor.js
│   ├── Product.js
│   ├── Order.js
│   ├── Subscription.js
│   └── Chat.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── vendors.js
│   ├── subscriptions.js
│   ├── admin.js
│   └── chat.js
├── middleware/             # Custom middleware
│   └── auth.js
├── config/                 # Configuration files
│   └── database.js
├── public/                 # Static files
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js              # Main server file
├── package.json           # Dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd locono-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory. You can use MongoDB or Supabase. If Supabase URL is present, the server auto-switches to Supabase.
   
   MongoDB (default):
   ```env
   MONGODB_URI=mongodb://localhost:27017/locono
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   PORT=3000
   ```

   Supabase (no SQL needed):
   ```env
   DB_TYPE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://qiygpsaptyfdiqsckjjm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWdwc2FwdHlmZGlxc2NramptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjcxMDcsImV4cCI6MjA3NzI0MzEwN30.ryOm4TVfp2wcBVPX88Lt81QPBm1i1MxYLzkZK3Qga0E
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   PORT=3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application (Next.js)**
   ```bash
   # Development
   npm run dev

   # Build and start
   npm run build
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register/customer` - Customer registration
- `POST /api/auth/register/vendor` - Vendor registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products/compare` - Compare products
- `POST /api/products` - Add product (Vendor)
- `PUT /api/products/:id` - Update product (Vendor)
- `DELETE /api/products/:id` - Delete product (Vendor)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Vendor)
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/rate` - Rate order

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/my-subscriptions` - Get user subscriptions
- `PUT /api/subscriptions/:id` - Update subscription
- `PUT /api/subscriptions/:id/pause` - Pause subscription
- `PUT /api/subscriptions/:id/resume` - Resume subscription
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `GET /api/vendors/:id/products` - Get vendor products
- `PUT /api/vendors/profile` - Update vendor profile
- `GET /api/vendors/dashboard/data` - Get vendor dashboard data

### Chat
- `POST /api/chat/start` - Start chat
- `GET /api/chat/my-chats` - Get user chats
- `GET /api/chat/:id/messages` - Get chat messages
- `POST /api/chat/:id/messages` - Send message
- `POST /api/chat/ai/chat` - AI chatbot

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/vendors` - Get all vendors
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/vendors/:id/status` - Update vendor status

## 🎯 Key Features Implementation

### 1. Multi-vendor Cart System
- Customers can add items from different vendors
- Separate checkout process for each vendor
- Consolidated cart view with vendor grouping

### 2. Subscription System
- Daily essentials subscription (milk, bread, eggs, curd)
- Flexible frequency options (daily, weekly, monthly)
- Automated delivery scheduling
- Easy pause/resume functionality

### 3. Real-time Communication
- Socket.io integration for real-time chat
- Direct vendor-customer communication
- AI chatbot for common queries
- Order status updates

### 4. Price Comparison
- Transparent pricing across vendors
- Sort by price, distance, rating
- Best deal recommendations
- Price history tracking

### 5. Delivery Management
- Different delivery radius for categories
- PAN-India delivery for sweets
- Real-time order tracking
- Delivery person assignment

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers

## 📊 Database Schema

### Users
- Customer and admin user management
- Profile information and preferences
- Address management
- Subscription items

### Vendors
- Business information and verification
- Delivery radius configuration
- Commission settings
- Rating and review system

### Products
- Multi-category product catalog
- Inventory management
- Pricing and discount system
- Review and rating system

### Orders
- Multi-vendor order support
- Order status tracking
- Payment integration
- Delivery management

### Subscriptions
- Recurring delivery system
- Flexible scheduling
- Pause/resume functionality
- Delivery history

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Set up SSL certificates for production
4. Configure domain and DNS settings

### Production Considerations
- Use PM2 for process management
- Set up Nginx reverse proxy
- Configure MongoDB replica sets
- Implement proper logging
- Set up monitoring and alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@locono.com
- Phone: +91 9876543210
- Website: https://locono.com

## 🎉 Acknowledgments

- Express.js community
- MongoDB team
- Socket.io developers
- All contributors and testers

---

**Locono** - Connecting local businesses with customers for a better shopping experience! 🛒✨
"# locono" 
