const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let Incomes = require('../model/incomes');

// => localhost:3000/api/incomes/
router.get('/', (req, res) => {
    Incomes.find((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving incomes: ${JSON.stringify(err, undefined, 2)}`);
    });
});

// => localhost:3000/api/incomes/
router.get('/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    Incomes.findById(req.params.id, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving income for the given id : ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/incomes/
router.post('/', (req, res) => {
    
    let incomeObj = new Incomes({
        incometype: req.body.incometype,
        date: req.body.date,
        amount: req.body.amount,
        comment: req.body.comment
    });
    incomeObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.put('/', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    const objBill = {
        incometype: req.body.incometype,
        date: req.body.date,
        amount: req.body.amount,
        comment: req.body.comment
    }
    Incomes.findByIdAndUpdate(req.params.id, { $set: objBill }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.delete('/', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    Incomes.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in delete a income: ${JSON.stringify(err, undefined, 2)}`);
    });

});

module.exports = router;