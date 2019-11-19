const express = require('express');
const objectId = require('mongoose').Types.ObjectId;

const router = express.Router();

let contact = require('../model/contact');

router.post('/', (req, res) => {

    let contactObj = new contact({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    });

    contactObj.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else
            console.log(`Error in Saving: ${JSON.stringify(err, undefined, 2)}`);
    });
});

module.exports = router;