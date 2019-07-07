const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let Bills = require('../model/bills');

// => localhost:3000/api/bills/
router.get('/', (req, res) => {
    Bills.find((err, docs) => {
        if (!err)
            res.status(200).send(docs);
        else
            console.log(`Error in Retriving bills: ${JSON.stringify(err, undefined, 2)}`);
    });

});

// => localhost:3000/api/bills/
router.get('/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.status(400).send({ errorMsg: `No Record found for the given id ${req.params.id}` });

    Bills.findById(req.params.id, (err, docs) => {
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
    let billObj = new Bills({
        shopname: req.body.shopname,
        purchaseDate: req.body.purchaseDate,
        Cashier: req.body.Cashier,
        items: itemsObj,
        totalAmount: req.body.totalAmount
    });
    billObj.save((err, doc) => {
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
        shopname: req.body.shopname,
        purchaseDate: req.body.purchaseDate,
        Cashier: req.body.Cashier,
        items: req.body.items,
        totalAmount: req.body.totalAmount
    }
    Bills.findByIdAndUpdate(req.params.id, { $set: objBill }, { new: true }, (err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in update: ${JSON.stringify(err, undefined, 2)}`);
    });
});

module.exports = router;