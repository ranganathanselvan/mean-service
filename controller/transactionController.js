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

// => localhost:3000/api/transaction/
router.get('/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    transaction.findById(req.params.id, (err, docs) => {
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
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    const objTransaction = {        
        transactiontype: req.body.transactiontype,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        balance: req.body.balance,
        comment: req.body.comment
    }
    transaction.findByIdAndUpdate(req.params.id, { $set: objTransaction }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.delete('/', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    transaction.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in delete a transaction: ${JSON.stringify(err, undefined, 2)}`);
    });

});

module.exports = router;