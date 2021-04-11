'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const P = require('bluebird');
const _ = require('lodash');
const hogan = require('hogan.js');

let datastore;

const warnNoDatastore = () => console.warn(`i18n :: datastore not available`);

const hash = exports.hash = (text) => {
  return crypto.createHash('md5').update(text, 'utf8').digest("hex");
};

const load = ({category, lang}) => {
  if (!datastore) { warnNoDatastore(); return P.resolve({}); }
  let langObj = {};
  let hashKeyArr = [];

  return datastore.load({category})
    .then((rs) => {
      if (rs.length === 0) { return langObj; }
      _.each(rs, (rc) => {
        langObj[rc.hashKey] = rc;
        hashKeyArr.push(rc.hashKey);
      });

      return datastore.load({lang: lang, hashKey: hashKeyArr});
    }).then((rs) => {
      _.each(rs, (rc) => {
        langObj[rc.hashKey].text = rc.text;
      });

      return langObj;
    });
};

const save = (dataObj) => {
  if (!datastore) { warnNoDatastore(); return P.resolve(); }
  return datastore.save(dataObj);
};

exports.scanDirectory = (viewPath) => {
  return P.fromCallback((cb) => {
    return fs.readdir(viewPath, cb);
  }).then((files) => {
    return P.map(files, (file) => {
      return exports.scanTemplate(viewPath, file);
    });
  });
};

exports.scanTemplate = function(root, file) {
  return P.try(function() {
    let fileObj = path.parse(path.join(root, file));

    // console.log(`fileObj >> ${util.inspect(fileObj)}`);

    // only support mustache extension
    if (fileObj.ext !== '.mustache') {
      return;
    }

    return P.fromCallback((cb) => {
      return fs.readFile(path.join(root, file), {
        encoding: 'utf8'
      }, cb);
    }).then((template) => {

      // console.log(`template >> ${template}`);

      let result = hogan.parse(hogan.scan(template));

      // console.log(`result >> ${util.inspect(result)}`);

      let dataArr = [];

      _.each(result, function(tagObj) {
        if (tagObj.tag === '#' && tagObj.n === 'i') {
          // var text = _.replace(tagObj.n, /^[A-Z]+\./g, '');
          // var text = _.replace(tagObj.n, /^LANG\./, '');
          let text = tagObj.nodes[0].text.toString();

          // console.log(tagObj);
          // console.log(`text >> ${text}`);

          dataArr.push({
            hashKey: hash(text),
            // text: _.truncate(text, {lenfgth: 50}),
            text: text,
            category: fileObj.name
          });
        }
      });

      if (dataArr.length <= 0) { return; }

      return P.map(dataArr, save);
    });
  });
};

exports.setDatastore = (_ds) => {
  datastore = _ds;
};

exports.middleware = (opts) => {
  opts = opts || {};
  return (req, res, next) => {

    // console.log(`i18n.load >> ${req.url}`);

    let category = req.url.substring(1);
    let langObj;
    let lang = 'en';

    return load({category, lang}).then((rc) => {

      langObj = rc;

      res.locals.i = () => {
        return (text) => {

          // console.log(`i18n.i >> ${text}`);

          let hashKey = hash(text);
          let t = langObj[hashKey] ? langObj[hashKey].text : text;

          return t;
        };
      };
      next();
    });
  };
};
