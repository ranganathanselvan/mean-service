const mongoosedb = require('../db');

let incomes = mongoosedb.model('incomes', {
    incometype: {type: String},
    date: { type: Date, default: Date.now},
    amount: {type: Number},
    comment: {type: String}
});


module.exports = incomes;