const crypto = require('crypto');
const _ = require('lodash');

exports.objectToString = (obj) => {
  let arr = Object.keys(obj).sort();
  let str = '';
  arr.forEach((key) => {
    str += `${str.length > 0 ? '&' : ''}${key}=${_.toString(obj[key])}`;
  });
  return str;
};

exports.md5 = (str) => {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return hash;
};

exports.sha256 = (str) => {
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  return hash;
};

exports.sha256sha256 = (str) => {
  let hash = crypto.createHash('sha256').update(str).digest('hex');
  hash = crypto.createHash('sha256').update(hash).digest('hex');
  return hash;
};
