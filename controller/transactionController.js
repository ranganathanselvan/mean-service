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

// => localhost:3000/api/transaction/30days
router.get('/30days', (req, res) => {
    var deductDate = new Date('2019-09-10');
    var startDate = deductDate.setDate(deductDate - 30);
    console.log(deductDate);
    console.log(startDate);

    /*transaction.find({date: {$gte: startDate, $lte: deductDate}}, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction: ${JSON.stringify(err, undefined, 2)}`);
    });*/
});

router.get('/monthlyexpense', (req, res) => {

    transaction.aggregate(
        [{ $project: { transactiontype: 1, description: 1, month: { $month: '$date' }, year: { $year: '$date' }, amount: 1 } },
        { $match: { month: 09, year: 2019, transactiontype: "Expense" } },
        { $group: { _id: { type: "$transactiontype", desc: "$description" }, total: { $sum: "$amount" }, count: { $sum: 1 } } }]
    ).exec((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/transaction/
router.get('/:id', (req, res) => {
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