const moment = require('moment');
const controllerModel = require('../model/controller');

const encryption_version = 1;
const controller_key = '55C8A94180264E39B26A9C250EC97FEF';
const passcode = '098e6c30eb1d4272ae17b30648f81fcc';
const expiryTime = moment().year(2038).month(0).date(1).unix();

const encryptedPasscode = controllerModel.encryptPasscode(
  encryption_version,
  controller_key,
  passcode,
  expiryTime,
);

const decryptedPasscode = controllerModel.decryptPasscode(encryptedPasscode);

console.log(`encryptedPasscode >> ${encryptedPasscode}`);
console.log(`decryptedPasscode >> `, decryptedPasscode);
