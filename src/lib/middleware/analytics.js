'use strict';

exports.ga = function(GA_TRACKING_ID, opts) {
  opts = opts || {};
  return function(req, res, next) {
    res.locals.GA_TRACKING_ID = (GA_TRACKING_ID && GA_TRACKING_ID.length > 0) ? GA_TRACKING_ID : null;
    next();
  };
};
