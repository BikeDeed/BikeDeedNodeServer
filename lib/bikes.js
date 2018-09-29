
var Web3 = require('web3');
var QRCode = require('qrcode');
var contract = require('truffle-contract');
const fs = require('fs');
const bikeDeedHome = '/home/centos/BikeDeed';
//const bikeDeedHome = '/Users/kwoodruf/ethereum/BikeDeed';

var contractAddress = '0xa7aB6FcA68f407BB5258556af221dE9d8D1A94B5';

var myBikes = [];
var myBike;

exports.getBikes = async function() {
  const BikeDeed = contract(require(bikeDeedHome + '/build/contracts/BikeDeed.json'));
  var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/uHJFDlXprJ52gu4uK9oA')
  );

  myBikes.length=0;
  BikeDeed.setProvider(web3.currentProvider);

  const FIELD_NAME  = 0
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_IPFS_HASH = 3
  const FIELD_DATE_CREATED = 4
  const FIELD_DATE_DELETED = 5

  const deed = await BikeDeed.at(contractAddress);

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
  let rawdata = fs.readFileSync(bikeDeedHome + '/app/javascript/bikemanufacturers.json');
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
  const BikeDeed = contract(require(bikeDeedHome + '/build/contracts/BikeDeed.json'));

  var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/uHJFDlXprJ52gu4uK9oA')
  );

  BikeDeed.setProvider(web3.currentProvider);

  const FIELD_NAME  = 0
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_IPFS_HASH = 3
  const FIELD_DATE_CREATED = 4
  const FIELD_DATE_DELETED = 5

  const deed = await BikeDeed.at(contractAddress);

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
