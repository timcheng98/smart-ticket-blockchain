const fs = require("fs");
const path = require("path");
const config = require("config");
const _ = require("lodash");
const express = require("express");
const model = require("../../model");
const middleware = require("./middleware");
const helper = require("../../lib/helper");
const moment = require("moment");

exports.getRouter = function (ns) {
  let router = new express.Router();

  router.use(middleware.assignRenderer);

  router.get("/api/config", (req, res) => {
    // let origin = config.get('ADMIN').ORIGIN;
    res.apiResponse({
      status: 1,
      STATIC_SERVER_URL: config.get("STATIC_SERVER_URL"),
      TICKET_VERIFY_URL: config.get("TICKET_VERIFY_URL"),
      TURRFLE_URL: config.get("TRUFFLE.ORIGIN"),
    });
  });

  // middleware.session.init(ns, {
  //   account: (admin_id) => {
  //     return model.admin.getAccount(admin_id, {
  //       fields: ['admin_id', 'status', `company_id`, 'nickname', 'level']
  //     });
  //   },
  //   getPermission: model.admin.getPermission
  // });
  router.use(middleware.session.get());

  router.use(middleware.parseIP());

  router.use(middleware.logger.logActions());

  router.use(middleware.analytics.ga(config.get("ADMIN.GA_TRACKING_ID")));
  router.use(middleware.assignLocals());

  var files = fs.readdirSync(__dirname);
  _.each(files, (file) => {
    let fileObj = path.parse(file);
    if (fileObj.ext === ".js" && fileObj.name !== "index") {
      var controller = require("./" + fileObj.name);
      controller.initRouter(router);
    }
  });

  // Servce ReactJS routes
  router.use("*", (req, res) => {
    res.sendFile("index.html", {
      root: path.join(__dirname, "..", "client", "build"),
    });
  });

  return router;
};
