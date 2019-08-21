const mongoosedb = require('../db');

let salary = mongoosedb.model('salary', {
    month: { type: String },
    year: { type: Number },
    earnings: { type: Array },
    deductions: { type: Array },
    earningsamount: { type: Number },
    deductionsamount: { type: Number },
    netamount: { type: Number }
});


module.exports = salary;