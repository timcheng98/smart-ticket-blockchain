'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const ut = require('@ikoala/node-util');
const middlewareCore = require('../../../lib/middleware');

module.exports = exports = _.extend({}, middlewareCore);

// ut.import(exports, __dirname);

// var files = fs.readdirSync(__dirname);
// _.each(files, (file) => {
//   let fileObj = path.parse(file);
//   if (fileObj.ext === '.js' && fileObj.name !== 'index') {
//     exports[fileObj.name] = require('./' + fileObj.name);
//   }
// });

exports.security = require('./security');
exports.session = require('./session');

/**
 * Attach responder functions to response object
 * @return {[type]} [description]
 */
exports.responder = function () {
  return (req, res, next) => {
    res.renderPage = exports.renderPage.bind(res);
    res.renderError = exports.renderError.bind(res);
    res.apiResponse = exports.apiResponse.bind(res);
    res.apiError = exports.apiError.bind(res);
    next();
  };
};

exports.assignLocals = (opts) => {
  opts = opts || {};
  return (req, res, next) => {
    next();
  };
};
