const _ = require('lodash');
const model = require('../../../model');

const debug = require('debug')('app:api/route/middleware/security');

/**
 * @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
 */
exports.parseIP = () => {
  return (req, res, next) => {
    // debug(`parseIP >> `, req.headers);
    const ip_addr = req.headers['cf-connecting-ip']
      || req.headers['x-forwarded-for']
      || req.headers['x-real-ip']
      || req.ip
      || req.remoteAddress;
    req.realIP = () => {
      debug(`parseIP >> `, req.headers);
      return ip_addr;
    };
    next();
  };
};

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
