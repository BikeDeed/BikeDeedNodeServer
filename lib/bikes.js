
var Web3 = require('web3');
var QRCode = require('qrcode');
var contract = require('truffle-contract');
var path = require('path');
const fs = require('fs');

let myBikes = [];
let myBike;

let CONTRACT_ADDRESS;
let WEB3_PROVIDER;

exports.setContractAddress = function(contractAddress) {
  CONTRACT_ADDRESS = contractAddress; 
}

exports.setWeb3Provider = function(web3Provider) {
  WEB3_PROVIDER = web3Provider; 
}

exports.getBikes = async function() {
  const BikeDeed = contract(require(path.join(__dirname, '../build/contracts/BikeDeed.json')));
  var web3 = new Web3(
    new Web3.providers.HttpProvider(WEB3_PROVIDER)
  );

  myBikes.length=0;
  BikeDeed.setProvider(web3.currentProvider);

  const FIELD_NAME  = 0
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_IPFS_HASH = 3
  const FIELD_DATE_CREATED = 4
  const FIELD_DATE_DELETED = 5

  const deed = await BikeDeed.at(CONTRACT_ADDRESS);

  let deedIds = await deed.ids();
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];

    var bikeDeed = await deed.deeds(deedId);
    try {
      var bikeOwner = await deed.ownerOf(deedId);
    } catch(error) {
      // probably a deleted token and therefore has no owner.
      continue;
    }
    if (bikeOwner == '0x') {
      // definitely deleted.
      continue;
    }

    const url = await deed.deedUri(deedId);
    const bike = {
      id: deedId,
      name:  web3.toAscii(bikeDeed[FIELD_NAME]),
      serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
      manufacturer: lookupManufacturerLabel(web3.toAscii(bikeDeed[FIELD_MANUFACTURER]).replace(/\u0000/g, '')),
      ipfsHash: bikeDeed[FIELD_IPFS_HASH],
      dateCreated: new Date(bikeDeed[FIELD_DATE_CREATED]*1000),
      dateDeleted: bikeDeed[FIELD_DATE_DELETED],
      owner: bikeOwner,
      bikeUrl: url
    }

    myBikes.push(bike);
  }
  return myBikes;
}


function lookupManufacturerLabel(value1) {
  let rawdata = fs.readFileSync(path.join(__dirname, '../bikemanufacturers.json'));
  let manufacturers = JSON.parse(rawdata);
  var i;
  for (i = 0; i < manufacturers.length; i++) {
    var value2 = manufacturers[i].value;
    if (value1.trim() == value2.trim()) {
      return manufacturers[i].text;
    }
  }
  return value1;
}

exports.getBike = async function(deedId) {
  const BikeDeed = contract(require(path.join(__dirname, '../build/contracts/BikeDeed.json')));

  var web3 = new Web3(
    new Web3.providers.HttpProvider(WEB3_PROVIDER)
  );

  console.log("CONTRACT_ADDRESS: " + CONTRACT_ADDRESS);
  console.log("WEB3_PROVIDER: " + WEB3_PROVIDER);

  BikeDeed.setProvider(web3.currentProvider);

  const FIELD_NAME  = 0
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_IPFS_HASH = 3
  const FIELD_DATE_CREATED = 4
  const FIELD_DATE_DELETED = 5

  const deed = await BikeDeed.at(CONTRACT_ADDRESS);

  console.log("deedId: " + deedId)

  const bikeDeed = await deed.deeds(deedId);
  try {
    var bikeOwner = await deed.ownerOf(deedId);
    } catch(error) {
      console.log("this is deleted deed");
  }

  const url = await deed.deedUri(deedId);

  var deedQRUrl = "https://bikedeed.io/bikes/" + deedId;

  var opts = {
    width: 100,
    height: 100,
    errorCorrectionLevel: 'H'
  };

  var deedQRCode;
  try {
    deedQRCode = await QRCode.toDataURL(deedQRUrl, opts);
    console.log("deedQRCode: " + deedQRCode);
  }
  catch(err) {
    console.error(err)
  }

  const bike = {
    id: deedId,
    name:  web3.toAscii(bikeDeed[FIELD_NAME]),
    serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
    manufacturer: lookupManufacturerLabel(web3.toAscii(bikeDeed[FIELD_MANUFACTURER]).replace(/\u0000/g, '')),
    ipfsHash: bikeDeed[FIELD_IPFS_HASH],
    dateCreated: new Date(bikeDeed[FIELD_DATE_CREATED]*1000),
    dateDeleted: bikeDeed[FIELD_DATE_DELETED],
    owner: bikeOwner,
    bikeUrl: url,
    qrCode: deedQRCode
  }

  myBike = bike;
  console.log(bike);
  return myBike;
}
