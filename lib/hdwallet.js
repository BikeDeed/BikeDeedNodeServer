const ethWallet = require('ethereumjs-wallet');
const ethwalletHdKey = require('ethereumjs-wallet/hdkey');
const ethTx = require('ethereumjs-tx');
const bip39 = require('bip39');
const bip32 = require('bip32');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

const ACCOUNT_TYPE_OWNER = 0;
const ACCOUNT_TYPE_LBS = 1;
const ACCOUNT_TYPE_LE = 2;
const ACCOUNT_TYPE_OE = 3;

const extendedPublicKey = 'xpub661MyMwAqRbcEsZR5ZQo5xw8p8LfQxx5xJxuryTSZbmnHAGsgY6SBBXerYwxQJmqPavfZp7g1QbJDGQMu3DkzwHikrgeyC1nUZCWfKHq3kK';
const extendedPrivateKey = 'xprv9s21ZrQH143K2PUwyXsnipzQG6WB1WEEb63K4b3q1GEoQMwj8znBdPDB1G1dLpfWqcGktc5fN8qMeTueCbBa21o5Kp6Ha6XQ7AEdfGbJJYQ';

function createWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const masterPrivateKey = root.privateKey.toString('hex');  
  const publicExtendedKey = root.publicExtendedKey;
  const privateExtendedKey = root.privateExtendedKey;
  console.log(masterPrivateKey);
  for (var i = 0; i < 100; i++) {
    const path = "m/44'/60'/" + ACCOUNT_TYPE_LBS + "'/0/" + i;
    const addrNode = root.derive(path);
    const privKey = addrNode._privateKey;
    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    const address = ethUtil.toChecksumAddress(addr);
    console.log(ethUtil.baToJSON(privKey));
    console.log(ethUtil.bufferToHex(pubKey));
    console.log(address);
  }
}

exports.getPublicKeys = function() {
  var pubKeys = [];
  for (var i = 0; i < 100; i++) {
    const pubKey = getPubKey(ACCOUNT_TYPE_OWNER, i);
    console.log(pubKey);
    pubKeys.push(pubKey);
  }
  return pubKeys;
}

function getPubKey (accountType, userId) {
  var root = ethwalletHdKey.fromExtendedKey(extendedPrivateKey);
  const path = "m/44'/60'/" + accountType + "'/0/" + userId;
  const addrNode = root.derivePath(path);
  const wallet = addrNode.getWallet();
  const pubKey = wallet.getPublicKeyString();
  return pubKey;
}

function getPrivateKeys() {
  for (var i = 0; i < 100; i++) {
    const privKey = getPrivateKey(ACCOUNT_TYPE_OWNER, i);
    console.log(privKey);
  }
}

function getPrivateKey(accountType, userId) {
  var root = ethwalletHdKey.fromExtendedKey(extendedPrivateKey);
  const path = "m/44'/60'/" + accountType + "'/0/" + userId;
  const addrNode = root.derivePath(path);
  const wallet = addrNode.getWallet();
  const privKey = wallet.getPrivateKeyString();
  return privKey;
}

exports.getPublicKey = function(accountType, userId) {

  try {
    return getPubKey(accountType, userId);
  } catch (error) {
    console.log(error);
  }
}

exports.performTransaction = function(accountType, userId) {
  var privKey = getPrivateKey(accountType, userId);
  console.log(privKey);
  return privKey;
}