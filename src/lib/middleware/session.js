'use strict';

let sessionScope = null;

exports.session = {
  attach: function(_scope, opts) {
    opts = (opts) ? opts : {};
    sessionScope = _scope;
    return function(req, res, next) {
      let session = req.session;

      let sessionKey = session.sessionKey;
      if (!session || !sessionKey) {
        next();
        return;
      }
    };
  },
  authorize: function(req, res, next) {
    res.redirect('login');
  }
};
