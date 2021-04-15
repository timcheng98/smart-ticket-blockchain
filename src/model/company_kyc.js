const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('./index');

exports.selectCompanyKyc = model.createSelect('company_kyc', 'company_kyc_id');
exports.updateCompanyKyc = model.createUpdate('company_kyc', 'company_kyc_id');
exports.insertCompanyKyc = model.createInsert('company_kyc', 'company_kyc_id');