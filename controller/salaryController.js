const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let salary = require('../model/salary');

// => localhost:3000/api/salary/
router.get('/', (req, res) => {
    salary.find((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving salary: ${JSON.stringify(err, undefined, 2)}`);
    });
});

// => localhost:3000/api/salary/
router.get('/:id', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    salary.findById(req.query.id, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving salary for the given id : ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/salary/
router.post('/', (req, res) => {

    let salaryObj = new salary({
        month: req.body.month,
        year: req.body.year,
        earnings: req.body.earnings,
        deductions: req.body.deductions,
        earningsamount: req.body.earningsamount,
        deductionsamount: req.body.deductionsamount,
        netamount: req.body.netamount
    });
    salaryObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.put('/', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    const objSalary = {
        month: req.body.month,
        year: req.body.year,
        earnings: req.body.earnings,
        deductions: req.body.deductions,
        earningsamount: req.body.earningsamount,
        deductionsamount: req.body.deductionsamount,
        netamount: req.body.netamount
    }
    salary.findByIdAndUpdate(req.query.id, { $set: objSalary }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.delete('/', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    salary.findByIdAndRemove(req.query.id, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in delete a salary: ${JSON.stringify(err, undefined, 2)}`);
    });

});

module.exports = router;