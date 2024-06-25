const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    amount: [{ id: Number, amount: String }]
});

module.exports = mongoose.model('Product', productSchema);
