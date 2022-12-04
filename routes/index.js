var express = require('express');
var router = express.Router();
const Shortlink = require('../models/shortlinkmodel');

router.get('/', (req, res, next) => {
    res.render("index")
});

router.post('/add', async (req, res, next) => {
  Shortlink.findOne({short: req.body.short}, async (err, existingShortlink) => {
    if (existingShortlink == null) {
      await Shortlink.create({full: req.body.full, short: req.body.short})
      res.send("Added.")
    } else {
      res.sendStatus(400);
    }
  });
});

router.get('/:shortlink', async (req, res) => {
  const shortlink = await Shortlink.findOne({short: req.params.shortlink}) 
  if (shortlink == null) {
      res.sendStatus(404)
  } else {
    res.redirect(shortlink.full);
  }
});

module.exports = router;