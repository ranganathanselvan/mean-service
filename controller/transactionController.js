const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let transaction = require('../model/transaction');

// => localhost:3000/api/transaction/
router.get('/', (req, res) => {
    transaction.find((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction: ${JSON.stringify(err, undefined, 2)}`);
    });
});

// => localhost:3000/api/transaction/date
router.get('/date', (req, res) => {
    var Date = {};
    var d = new Date();
    d.setDate(d.getDate() - 10);
    Date.currentDate = new Date();
    Date.reduceDate = d;
    res.status(200).send(JSON.stringify(Date));
    /*transaction.find({date: {$gte: startDate, $lte: deductDate}}, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction: ${JSON.stringify(err, undefined, 2)}`);
    });*/
});

// => localhost:3000/api/transaction/monthlyexpense/:month/:year
router.get('/monthlyexpense/:month/:year', (req, res) => {

    console.log('Month: ' + req.params.month);
    console.log('Year: ' + req.params.year);
    if (!req.params.month || !req.params.year) {
        res.status(500).send('Unable to retrive expense. Invalid month or year.');
    }
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    transaction.aggregate(
        [{ $project: { transactiontype: 1, description: 1, month: { $month: '$date' }, year: { $year: '$date' }, amount: 1 } },
        { $match: { month: month, year: year, transactiontype: "Expense" } },
        { $group: { _id: { type: "$transactiontype", desc: "$description" }, total: { $sum: "$amount" }, count: { $sum: 1 } } }]
    ).exec((err, docs) => {
        if (!err) {
            res.status(200).send(docs);
        } else {
            console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
            res.status(500).send('Unable to retrive expense.' + JSON.stringify(err, undefined, 2));
        }
    });

});

// => localhost:3000/api/transaction/expenseById/:id
router.get('/expenseById/:id', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    transaction.findById(req.query.id, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction for the given id : ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/transaction/
router.post('/', (req, res) => {

    let transactionObj = new transaction({
        transactiontype: req.body.transactiontype,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        balance: req.body.balance,
        comment: req.body.comment
    });
    transactionObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.put('/', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    const objTransaction = {
        transactiontype: req.body.transactiontype,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        balance: req.body.balance,
        comment: req.body.comment
    }
    transaction.findByIdAndUpdate(req.query.id, { $set: objTransaction }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.delete('/', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    transaction.findByIdAndRemove(req.query.id, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in delete a transaction: ${JSON.stringify(err, undefined, 2)}`);
    });

});

module.exports = router;