var express = require('express');
var router = express.Router();
var bikes = require('../lib/bikes.js');

/* GET bikes page. */
router.get('/:deedid', async function(req, res, next) {
  var deedid = req.params.deedid;
  bikes.setContractAddress(req.app.get('contractAddress'));
  bikes.setWeb3Provider(req.app.get('web3Provider'));
  console.log("deedid: " + deedid);
  if (deedid == '' || deedid === undefined) {
    res.render('bikes', { bikes: await bikes.getBikes() });
  }
  else {
    var format = req.query.format;
    if (!format) {
      res.render('bike', { bike: await bikes.getBike(deedid) });
    }
    else {
      res.render('bike', { bike: await bikes.getBike(deedid) });
    }
  }
});

module.exports = router;
