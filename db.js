const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// 'mongodb://localhost:27017/docmgnt',
// const uri = 'mongodb+srv://m001-student:m001-mongodb-basics@tamilselvan-cluster0-0y9tt.mongodb.net/docmgnt?retryWrites=true&w=majority';
/*const uri = "mongodb+srv://" + 
            process.env.API_DB_USERNAME + 
            ":" +
            process.env.API_DB_PASSWORD + 
            "@" +
            process.env.API_DB_HOST + 
            "/" +
            process.env.API_DB_NAME +
            "?retryWrites=true&w=majority";*/
const uri = 'mongodb+srv://tamran1988:1988-tamil@tamran0-ctnm5.mongodb.net/test?retryWrites=true&w=majority';
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('MongoDb connection succeeded');
    else
        console.log('Error in Db Connection: ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;