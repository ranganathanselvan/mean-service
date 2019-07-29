const mongoosedb = require('../db');

let bills = mongoosedb.model('bills', {
    billtype: {type: String},
    paymentmode: {type: String},
    shopname: { type: String },
    billno: {type: String},
    purchasedate: { type: String },
    cashier: { type: String },
    items: [],
    totalamount: { type: String }
});


module.exports = bills;