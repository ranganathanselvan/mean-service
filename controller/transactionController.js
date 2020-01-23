const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let transaction = require('../model/transaction');

// => localhost:3000/api/transaction/
/**Transaction Creation 
 * load all the transaction into the page. no limitaion
*/
router.get('/', (req, res) => {
    /*transaction.find((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving transaction: ${JSON.stringify(err, undefined, 2)}`);
    });db.transactions.find({}).sort({_id:-1}).limit(10)*/
    transaction.find({}).sort({_id: -1}).limit(10)
    /*transaction.aggregate(
        [
            { $sort: { date: -1 } },
            { $limit: 10 },
            { $sort: { date: 1 } }
        ]
    )*/.exec((err, docs) => {
        if (!err) {
            res.status(200).send(docs);
        } else {
            console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
            res.status(500).send('Unable to retrive expense.' + JSON.stringify(err, undefined, 2));
        }
    });
});

// => localhost:3000/api/transaction/monthlyexpense/:month/:year
/**Transaction Dashboard
 * load the transaction by month and year
 */
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

// => localhost:3000/api/transaction/getExpenseDetailsByDesc/:month/:year/:description
/**Transaction Dashboard 
 * load the transaction by month, year and description
 */
router.get('/getExpenseDetailsByDesc/:month/:year/:description', (req, res) => {

    if (!req.params.month || !req.params.year || !req.params.description) {
        res.status(500).send('Unable to retrive expense. Invalid month or year or description.');
    }
    const month = Number(req.params.month);
    const year = Number(req.params.year);
    const desc = req.params.description;

    transaction.aggregate(
        [
            { $project: { transactiontype: 1, description: 1, date: 1, month: { $month: '$date' }, year: { $year: '$date' }, amount: 1, comment: 1 } },
            { $match: { month: month, year: year, transactiontype: "Expense", description: desc } }
        ]
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

// => localhost:3000/api/transaction/loadTransactions
/**Transaction Creation
 * Load the tranaction by limitation. if start date and end date is no specified
 * if start date and end date specified. load transactio by given dates
 */
router.post('/loadTransactions', (req, res) => {

    if (!req.body.startDate && !req.body.endDate) {
        transaction.aggregate(
            [
                { $sort: { date: -1 } },
                { $limit: 10 },
                { $sort: { date: 1 } }
            ]
        ).exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            } else {
                console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
                res.status(500).send('Unable to retrive expense.' + JSON.stringify(err, undefined, 2));
            }
        });
    } else {
        console.log(JSON.stringify(req.body));
        const sDate = new Date(req.body.startDate);
        const eDate = new Date(req.body.endDate);

        console.log(sDate);
        console.log(eDate);

        transaction.aggregate(
            [
                { $match: { date: { $gte: sDate, $lte: eDate } } },
                { $sort: { date: 1 } }
            ]
        ).exec((err, docs) => {
            if (!err) {
                res.status(200).send(docs);
            } else {
                console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
                res.status(500).send('Unable to retrive expense.' + JSON.stringify(err, undefined, 2));
            }
        });
    }
});

// => localhost:3000/api/transaction/
/**Trasaction Creation
 * Insert transaction into collection
 */
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