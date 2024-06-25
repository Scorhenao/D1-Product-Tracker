const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    ShoppingLists: [
        {
            id: Number,
            name: String,
            date: String,
            items: [
                {
                    id: Number,
                    name: String,
                    quantity: Number,
                    amount: String,
                    price: Number
                }
            ]
        }
    ]
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
