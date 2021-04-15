const path = require("path");
const _ = require("lodash");
const config = require("config");
const helper = require("../lib/helper");
const WebServer = require("../web-server");
const route = require("./route");
const model = require("../model");
// const adminModel = require("../model/admin");
// const userModel = require("../model/user");

const AppError = require("../lib/app-error");

// TODO:: errorCode
const ERROR_CODE = {
  [-50000]: "Account does not exist",
  [-50001]: "Password is not correct",
  [-50002]: "Account is not active",
  [-50003]: "Company key does not exist",
};

AppError.setErrorCode(ERROR_CODE);

const debug = require("debug")("app:admin/index");

let env = config.util.getEnv("NODE_ENV");
let webConfig = config.get("API");
let namespace = "";

exports.init = (ns) => {
  namespace = ns;
  webConfig = config.get(namespace);

  WebServer.setAuthentication("AdminAuth", async function (req, callback) {
    try {
      // Do your custom user finding logic here, or set to false based on req object
      // let {session_context, user_id} = req.session;
      // user_id = _.toInteger(user_id);
      // if (session_context === namespace && user_id > 0) {
      //   return callback(null, user_id);
      // }
      console.log("test");
      // return callback(null, false);
      let postData = {
        email: "",
        password: "",
      };
      postData = helper.validateFormData(req.body, postData);

      // Admin Account
      let [userRc] = await adminModel.selectAccount({
        where: {
          email: postData.email,
        },
      });

      /* ERROR HANDLE START */
      if (!userRc) {
        return callback(null, {
          status: -1,
          errorCode: -50000,
          errorMessage: ERROR_CODE[-50000],
        });
      }

      if (userRc.password !== postData.password) {
        return callback(null, {
          status: -1,
          errorCode: -50001,
          errorMessage: ERROR_CODE[-50001],
        });
      }

      if (userRc.is_active <= 0) {
        return callback(null, {
          status: -1,
          errorCode: -50002,
          errorMessage: ERROR_CODE[-50002],
        });
      }

      /* ERROR HANDLE END */

      /* Success */
      return callback(null, { admin_id: userRc.admin_id });
    } catch (err) {
      console.error(err);
      callback(err);
    }
  });

  WebServer.setAuthentication("UserAuth", async function (req, callback) {
    try {
      // Do your custom user finding logic here, or set to false based on req object
      let postData = {
        email: "",
        password: "",
      };
      postData = helper.validateFormData(req.body, postData);
      console.log("test", postData);

      let [userRc] = await userModel.selectUser({
        where: {
          email: postData.email,
        },
      });
      if (!userRc || userRc.password !== postData.password) {
        return callback(null, {
          user_id: 0,
          status: -1,
          errorCode: -50001,
          errorMessage: ERROR_CODE[-50001],
        });
      }
      if (userRc.is_active !== 1) {
        return callback(null, {
          user_id: 0,
          status: -1,
          errorCode: -50002,
          errorMessage: ERROR_CODE[-50002],
        });
      }
      return callback(null, {
        user_id: userRc.user_id,
      });
    } catch (err) {
      console.error(err);
      callback(err);
    }
  });

  WebServer.setAuthentication(
    "CompanyAdminAuth",
    async function (req, callback) {
      try {
        // Do your custom user finding logic here, or set to false based on req object
        let postData = {
          company_key: "",
          email: "",
          mobile: "",
        };
        postData = helper.validateFormData(req.body, postData);

        let [companyRc] = await model.company.company.selectCompany({
          where: { company_key: postData.company_key },
        });
        if (!companyRc) {
          return callback(null, {
            status: -1,
            errorCode: -50003,
            errorMessage: ERROR_CODE[-50003],
          });
        }

        let [companyAdminRc] = await model.company.admin.selectAdmin({
          where: {
            email: postData.email,
            company_id: companyRc.company_id,
          },
        });

        if (!companyAdminRc) {
          return callback(null, {
            status: -1,
            errorCode: -50000,
            errorMessage: ERROR_CODE[-50000],
          });
        }
        if (companyAdminRc.mobile != postData.mobile) {
          return callback(null, {
            status: -1,
            errorCode: -500001,
            errorMessage: ERROR_CODE[-50001],
          });
        }
        if (companyAdminRc.is_active !== 1) {
          return callback(null, {
            status: -1,
            errorCode: -50002,
            errorMessage: ERROR_CODE[-50002],
          });
        }
        return callback(null, {
          company_admin_id: companyAdminRc.company_admin_id,
          company_key: postData.company_key,
          company_id: companyAdminRc.company_id,
        });
      } catch (err) {
        console.error(err);
        callback(err);
      }
    }
  );

  return exports;
};

exports.start = () => {
  startWebServer();
};

exports.namespace = () => {
  return namespace;
};

const startWebServer = function () {
  WebServer.createServer({
    port: process.env.PORT || webConfig.PORT,
    mount: webConfig.MOUNT ? webConfig.MOUNT : null,
    viewsPath: [],
    staticPath: [
      path.join(__dirname, "client", env === "production" ? "build" : "build"),
      path.join(config.get("MEDIA.PUBLIC")),
    ],
    sessionSecret: webConfig.SESSION_SECRET,
    mysql: config.get("DB.master"),
    router: route.getRouter(exports.namespace()),
  });
};
