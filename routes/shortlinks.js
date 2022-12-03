var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Shortlink = require('../models/shortlinkmodel');

router.get('/', (req, res, next) => {
    res.send("Successfully added")
});


router.post('/add', async (req, res, next) => {
    await Shortlink.create({full: req.body.full, short: req.body.short})
    res.redirect(req.body.full)
});

module.exports = router;
