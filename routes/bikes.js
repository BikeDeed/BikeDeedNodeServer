var express = require('express');
var router = express.Router();
var bikes = require('../lib/bikes.js');

/* GET bikes page. */
router.get('/', async function(req, res, next) {
  var deedid = req.query.deedid;
  res.render('bikes', { title: 'BikeDeed', bike: await bikes.getBike(deedid),
    pageTestScript: '/qa/tests-bikes.js' });
});

module.exports = router;
