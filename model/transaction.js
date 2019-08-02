const mongoosedb = require('../db');

let transactions = mongoosedb.model('transactions', {
    transactiontype: {type: String},
    description: {type: String},
    date: { type: Date, default: Date.now},
    amount: {type: Number},
    balance: {type: Number},
    comment: {type: String}
});


module.exports = transactions;