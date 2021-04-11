const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const express = require('express');
// const passport = require('passport');
const config = require('config');
const middleware = require('./middleware');
const packageData = require('../../../package.json');

exports.getRouter = function() {
  let router = new express.Router();

  router.use(middleware.responder());
  // router.use(middleware.analytics.ga(config.get('API.GA_TRACKING_ID')));
  router.use(middleware.session.get('api'));
  router.use(middleware.security.parseIP());
  router.use(middleware.assignLocals());

  router.get('/', (req, res) => {
    res.apiResponse({
      name: packageData.name,
      ts: moment().unix(),
      version: packageData.version
    });
  });

  router.get('/api', (req, res) => {
    res.apiResponse({
      name: packageData.name,
      ts: moment().unix(),
      version: packageData.version
    });
  });


  const files = fs.readdirSync(__dirname);
  _.each(files, (file) => {
    let fileObj = path.parse(file);
    if (fileObj.ext === '.js' && fileObj.name !== 'index') {
      // let controller = require('./' + fileObj.name);
      // controller.initRouter(router);
    }
  });

  return router;
};
