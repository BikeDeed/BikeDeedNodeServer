var express = require('express');
var router = express.Router();
var bikes = require('../lib/bikes.js');

/* GET bikes page. */
router.get('/:deedid', async function(req, res, next) {
  var deedid = req.params.deedid;
  console.log("deedid: " + deedid);
  if (deedid == '' || deedid === undefined) {
    res.render('bikes', { bikes: await bikes.getBikes(),
      pageTestScript: '/qa/tests-bikes.js' });
  }
  else {
    var format = req.query.format;
    if (!format) {
      res.render('bike', { bike: await bikes.getBike(deedid),
        pageTestScript: '/qa/tests-bikes.js' });
    }
    else {
      res.render('bike', { bike: await bikes.getBike(deedid),
        layout: 'qrscan', pageTestScript: '/qa/tests-bikes.js' });
    }
  }
});

module.exports = router;
