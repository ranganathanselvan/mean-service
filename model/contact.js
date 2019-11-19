const mongoosedb = require('../db');

let contact = mongoosedb.model('portfolioContacts', {
    name: {type: String},
    email: {type: String},
    comment: {type: String}
});


module.exports = contact;