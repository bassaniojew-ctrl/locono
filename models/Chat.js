const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin', 'ai']
    }
  }],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  messages: [{
    sender: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
      },
      role: {
        type: String,
        enum: ['customer', 'vendor', 'admin', 'ai']
      }
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'order_update', 'system'],
      default: 'text'
    },
    attachments: [{
      url: String,
      filename: String,
      fileType: String,
      size: Number
    }],
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'closed'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [String],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
