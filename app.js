const  express = require('express');

const mongoose = require('./db');
const billsController = require('./controller/billsController');

const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}` );
});

app.use('/api/bills', billsController);