const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  cost_price: {
    type: Number,
    required: true
  },
  selling_price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('product', productSchema)