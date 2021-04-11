const _ = require('lodash');
const moment = require('moment');
const model = require('../../../model');
const app = require('../../index');

const debug = require('debug')('app:admin:middleware:logger');

exports.logActions = () => {
  return async (req, res, next) => {
    try {
      let sessionData = req.session[app.namespace()];
      // debug(`sessionData >> `, sessionData);

      if (!sessionData || !sessionData.isLoggedIn) {
        next();
        return;
      }

      let {admin_id} = sessionData.account;

      let method = _.toString(req.method);
      let data = '';

      if (method.toLowerCase() === 'get') {
        next();
        return;
      }

      data = JSON.stringify(req.body);

      let actionLog = {
        ctime: moment().unix(),
        client_ip: req.realIP(),
        admin_id,
        method,
        endpoint: _.toString(req.url),
        data
      }

      // debug(`actionLog >> `, actionLog);

      await model.logging.save('ams_actions', actionLog);

      next();
    } catch (err) {
      res.apiError(err);
    }
  }
}
