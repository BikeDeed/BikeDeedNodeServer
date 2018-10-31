var express = require('express');
var router = express.Router();
var wallet = require('../lib/hdwallet.js');

/* GET wallet page. */
router.get('/', async function(req, res, next) {
  let action = req.query.action;
  wallet.setContractAddress(req.app.get('contractAddress'));
  wallet.setWeb3Provider(req.app.get('web3Provider'));
  wallet.setExtendedPrivateKey(req.app.get('extendedPrivateKey'));

  console.log("action: " + action);
  if (action == '' || action === undefined){
    res.sendStatus(404);
  }
  else if (action  == 'performtransaction' ){
    var accountType = req.query.accounttype;
    var userId = req.query.userid;
    var userId = req.query.userid;
    var privateKey = wallet.performTransaction(accountType, userId);
    res.json(privateKey);
    //res.render('transaction', { privateKey: wallet.performTransaction(accountType, userId) });
  }
  else if (action  == 'getpubkey' ){
    var accountType = req.query.accounttype;
    var userId = req.query.userid;
    var publicKey = wallet.getPublicKey(accountType, userId);
    res.json(publicKey);
    //res.render('publickey', { publicKey: wallet.getPublicKey(accountType, userId) });
  }
  else if (action  == 'getpubkeys' ){
    var publicKeys = wallet.getPublicKeys();
    res.json(publicKeys);
    //res.render('publickeys', { publicKeys: wallet.getPublicKeys() });
  }
});

module.exports = router;
