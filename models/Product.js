const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Laundry', 'Kitchen', 'Entertainment', 'Cooling', 'Refrigeration', 'Cleaning']
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);