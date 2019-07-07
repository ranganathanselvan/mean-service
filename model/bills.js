const mongoosedb = require('../db');

let bills = mongoosedb.model('bills', {
    shopname: { type: String },
    purchaseDate: { type: String },
    Cashier: { type: String },
    items: [],
    totalAmount: { type: String }
});


module.exports = bills;