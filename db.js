const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/docmgnt', { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('MongoDb connection succeeded');
    else
        console.log('Error in Db Connection: ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;