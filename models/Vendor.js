const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  businessType: {
    type: String,
    enum: ['general_store', 'bakery', 'sweet_shop', 'street_food'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  businessHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  deliveryRadius: {
    groceries: { type: Number, default: 20 }, // km
    bakery: { type: Number, default: 35 },
    streetFood: { type: Number, default: 25 },
    sweets: { type: String, default: 'pan_india' }
  },
  documents: {
    gstNumber: String,
    panNumber: String,
    aadharNumber: String,
    businessLicense: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  commission: {
    type: Number,
    default: 10 // percentage
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
