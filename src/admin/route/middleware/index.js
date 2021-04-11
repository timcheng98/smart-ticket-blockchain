const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const config = require('config');
const ut = require('@ikoala/node-util');
const middlewareCore = require('../../../lib/middleware');
const app = require('../../index');
const model = require('../../../model');

const debug = require('debug')(`app:admin:middleware`);

module.exports = exports = _.extend({}, middlewareCore);

// ut.import(exports, __dirname);

var files = fs.readdirSync(__dirname);
_.each(files, (file) => {
  let fileObj = path.parse(file);
  if (fileObj.ext === '.js' && fileObj.name !== 'index') {
    exports[fileObj.name] = require('./' + fileObj.name);
  }
});

exports.parseIP = () => {
  return (req, res, next) => {
    const ip_addr = req.headers['x-forwarded-for']
      || req.headers['x-real-ip']
      || req.headers['cf-connecting-ip']
      || req.ip
      || req.remoteAddress;
    req.realIP = () => {
      return ip_addr;
    };
    next();
  };
};

exports.assignRenderer = function (req, res, next) {
  res.renderPage = exports.renderPage.bind(res);
  res.renderError = exports.renderError.bind(res);
  res.apiResponse = exports.apiResponse.bind(res);
  res.sendError = res.apiError = exports.apiError.bind(res);
  next();
};

exports.assignLocals = (opts) => {
  opts = opts || {};
  return async (req, res, next) => {
    let appConfig = [{
      k: 'ORIGIN',
      v: config.get('ADMIN.ORIGIN')
    }, {
      k: 'STATIC_SERVER_URL',
      v: config.get('STATIC_SERVER_URL')
    }];
    res.locals.appConfig = appConfig;
    next();
  };
};
