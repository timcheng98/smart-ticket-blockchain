const fs = require('fs');
const path = require('path');
const util = require('util');
// const P = require('bluebird');
const _ = require('lodash');
// const ut = require('@ikoala/node-util');
const AppError = require('../app-error');

exports.renderPage = function (contentPage, opts) {
  opts = opts || {};

  var viewData = {
    partials: {
      content: contentPage
    },
    header: util.format('<link rel="stylesheet" href="css/%s.min.css">', contentPage),
    footer: util.format('<script src="js/%s.min.js"></script>', contentPage)
  };

  if (opts.header) {
    viewData.header += opts.header;
    delete opts.header;
  }

  if (opts.footer) {
    viewData.footer += opts.footer;
    delete opts.footer;
  }

  _.merge(viewData, opts);
  this.render('page', viewData);
};

exports.renderError = function(err) {
  console.error(err);
  this.sendStatus(500);
};

exports.apiResponse = function(payload) {
  this.json({
    status: 1,
    ...payload,
  });
};

exports.apiError = function(err) {
  console.error(err);

  if (err instanceof AppError) {
    return this.json({
      status: -1,
      errorCode: err.code,
      errorMessage: err.message
    });
  }

  return this.json({
    status: -1,
    errorCode: 0,
    errorMessage: 'unknown internal server error'
  });
};

exports.attach = function (opts) {
  opts = (opts) ? opts : {};
  return function(req, res, next) {
    res.renderPage = exports.renderPage.bind(res);
    res.renderError = exports.renderError.bind(res);
    res.apiResponse = exports.apiResponse.bind(res);
    res.apiError = exports.apiError.bind(res);
    next();
  };
};

// ut.import(exports, __dirname);

var files = fs.readdirSync(__dirname);
_.each(files, (file) => {
  let fileObj = path.parse(file);
  if (fileObj.ext === '.js' && fileObj.name !== 'index') {
    exports[fileObj.name] = require('./' + fileObj.name);
  }
});
