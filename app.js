const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const mongoose = require('./db');
const billsController = require('./controller/billsController');
const incomeController = require('./controller/incomeController');
const transactionController = require('./controller/transactionController');
const salaryController = require('./controller/salaryController');
const portfolioController = require('./controller/portfolioController');

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));
console.log(`Your port is ${process.env.PORT}`); // 8626
let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 3000;
}
//const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
app.use(express.static(__dirname + '/app'));
app.use("/tamilselvan", express.static(__dirname + '/portfolio'));

app.use('/api/bills', billsController);
app.use('/api/incomes', incomeController);
app.use('/api/transaction', transactionController);
app.use('/api/salary', salaryController);
app.use('api/portfolio', portfolioController);