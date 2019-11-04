const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let bills = require('../model/bills');

// => localhost:3000/api/bills/
router.get('/', (req, res) => {
    bills.find().sort({ purchasedate: -1 }).exec((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving bills: ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/bills/
router.get('/distinct/shopname', (req, res) => {
    bills.aggregate(
        [
            {$group: {_id: "$shopname"}},           
            {$project: {_id: 1}},
	        {$sort: {_id: 1}}
        ]
    ).exec((err, docs) => {
        if (!err) {
            res.status(200).send(docs);
        } else {
            console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
            res.status(500).send('Unable to retrive shopname.' + JSON.stringify(err, undefined, 2));
        }
    });
});


// => localhost:3000/api/bills/
router.get('/distinct/productname', (req, res) => {

    bills.aggregate(
        [
            {
                $group: {
                    _id: null,
                    array: { $push: "$items.ProductName" }
                }
            },
            {
                $project: {
                    _id: 0,
                    ProductName: {
                        $reduce: {
                            input: "$array",
                            initialValue: [],
                            in: { $concatArrays: [ "$$value", "$$this" ] }
                        }
                    }
                }
            },
            {$sort: {ProductName: 1}}
        ]
    ).exec((err, docs) => {
        if (!err) {
            res.status(200).send(docs);
        } else {
            console.log(`Error in Retriving transaction by Aggregate : ${JSON.stringify(err, undefined, 2)}`);
            res.status(500).send('Unable to retrive productname.' + JSON.stringify(err, undefined, 2));
        }
    });
});

// => localhost:3000/api/bills/
router.get('/:id', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    bills.findById(req.query.id, (err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving bill for the given id : ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/bills/
router.post('/', (req, res) => {
    let itemsObj = []
    for (var i = 0; i < req.body.items.length; i++) {
        itemsObj.push(req.body.items[i]);
    }
    let billObj = new bills({
        billtype: req.body.billtype,
        shopname: req.body.shopname,
        paymentmode: req.body.paymentmode,
        billno: req.body.billno,
        purchasedate: req.body.purchasedate,
        cashier: req.body.cashier,
        items: itemsObj,
        totalamount: req.body.totalamount
    });
    billObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.put('/', (req, res) => {
    if (!objectId.isValid(objectId(req.query.id)))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    const objBill = {
        billtype: req.body.billtype,
        paymentmode: req.body.paymentmode,
        shopname: req.body.shopname,
        billno: req.body.billno,
        purchasedate: req.body.purchasedate,
        cashier: req.body.cashier,
        items: req.body.items,
        totalamount: req.body.totalamount
    }
    bills.findByIdAndUpdate({ _id: objectId(req.query.id) }, { $set: objBill }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

router.delete('/', (req, res) => {
    if (!objectId.isValid(req.query.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.query.id}` });

    bills.findByIdAndRemove(req.query.id, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in delete a bill: ${JSON.stringify(err, undefined, 2)}`);
    });

});

module.exports = router;