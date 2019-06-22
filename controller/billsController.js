const express = require('express');
const router = express.Router();

let  Bills  = require('../model/bills');

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
router.post('/', (req, res) => {
    let items = []
    for (var i = 0; i < req.body.items; i++) {
        items.push(req.body.items[i]);
    }
    let billObj = new Bills({
        shopname: req.body.shopname,
        purchaseDate: req.body.purchaseDate,
        Cashier: req.body.Cashier,
        items: items,
        totalAmount: req.body.totalAmount
    });
    billObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

module.exports = router;