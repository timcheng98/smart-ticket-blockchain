const _ = require('lodash');
const moment = require('moment');
const model = require('../../../model');
const app = require('../../index');

exports.limitGeoLocation = function(locArr) {
  return function(req, res, next) {
    let ipAddress = req.headers['cf-connecting-ip'] || req.ip || req.remoteAddress;
    // always allow local loopback
    let loopback = ['localhost', '127.0.0.1', '::1'];
    if (_.includes(loopback, ipAddress)) {
      return next();
    }
    let geo = model.security.getGeoLocation(ipAddress);
    let country = _.toString(geo.country) || req.headers['cf-ipcountry'];
    if (locArr.indexOf(country) < 0) {
      return res.sendStatus(404);
    }
    next();
  };
};
