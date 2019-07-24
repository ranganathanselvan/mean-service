const  express = require('express');
const cors = require('cors');

const mongoose = require('./db');
const billsController = require('./controller/billsController');
const incomeController = require('./controller/incomeController');

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}` );
});

app.use('/api/bills', billsController);
app.use('/api/incomes', incomeController);