const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
    purchase_date: {
        type: Date,
        required: true
    },
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total_sales: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('sale', saleSchema)