// const util = require('util');
const _ = require('lodash');
const moment = require('moment');
const config = require("config");
const AppError = require('../../../lib/app-error');
const model = require('../../../model');

const debug = require('debug')('app:api:route:middleware:session');

exports.get = function (opts) {
  return async (req, res, next) => {
    try {
      return next(); // not working, disabled by Ryan

      // opts = opts || {};
      // let haveBody = (Object.keys(req.body).length > 0);
      // let access_token = (haveBody === true) ? req.body.access_token : req.query.access_token;
      // // let app_key = (haveBody === true) ? req.body.app_key : req.query.app_key;
      // access_token = _.toString(access_token);
      // // app_key = _.toString(app_key);

      // debug(`access_token >> ${access_token}`);
      // // debug(`access_token >> ${access_token}, app_key >> ${app_key}`);


      // // if (app_key.length !== 32) {
      // //   // throw new AppError(-103, `invalid access_token or app_key`);
      // //   next();
      // //   return;
      // // }

      // let companyUserSession = await model.staff.getSession({
      //   where: { access_token }
      // });

      // // console.log(`companyUserSession >> `, companyUserSession);

      // // if (!companyUserSession || companyUserSession.status <= 0) {
      // if (!companyUserSession || !companyUserSession.isAccessTokenValid()) {
      //   // throw new AppError(-101, `invalid customer session`);
      //   next();
      //   return;
      // }

      // await companyUserSession.touch();

      // // req.session = {
      // //
      // // };

      // let stfAccount = await model.company.selectUser(companyUserSession.company_user_id, {
      //   fields: ['company_user_id']
      // });
      // // console.log('stfAccount\n\n\n\n\n\n',stfAccount);
      // req.staffAccount = req.stfAccount = {
      //   company_user_id: stfAccount.company_user_id,
      // };



      // let stfSession = await model.staff.getSession({
      //   where: {access_token}
      // });

      // // console.log(`stfSession >> `, stfSession);

      // // if (!stfSession || stfSession.status <= 0) {
      // if (!stfSession || !stfSession.isAccessTokenValid()) {
      //   // throw new AppError(-101, `invalid customer session`);
      //   next();
      //   return;
      // }

      // await stfSession.touch();

      // // req.session = {
      // //
      // // };

      // let stfAccount = await model.customer.getAccount(stfSession.staff_id, {
      //   fields: ['staff_id', 'company_id', 'company_position_id', 'company_department_id']
      // });

      // req.staffAccount = req.stfAccount = {
      //   staff_id: stfAccount.staff_id,
      //   stf_id: stfAccount.staff_id,
      //   company_id: stfAccount.company_id,
      //   company_position_id: stfAccount.company_position_id,
      //   company_department_id: stfAccount.company_department_id
      // };

    } catch (err) {
      console.error(err);
    }

    next();
  };
};

// exports.authorize = function (opts) {
//   return async (req, res, next) => {
//     try {
//       // debug('#authorize :: %s', req.url);
//       opts = opts || {};

//       let haveBody = (Object.keys(req.body).length > 0);
//       let access_token = (haveBody === true) ? req.body.access_token : req.query.access_token;
//       access_token = _.toString(access_token);

//       debug(`access_token >> ${access_token}`);

//       let companyUserSession = await model.user_session.getSession({
//         where: { access_token }
//       });

//       //Check session expiry
//       if (!companyUserSession || !companyUserSession.isAccessTokenValid()) {
//         throw new AppError(-101, `invalid session`);
//       }

//       await companyUserSession.touch();

//       req.companyUserAccount = req.companyUAccount = {
//         company_user_id: companyUserSession.company_user_id,
//       };

//       let hasSession = req.companyUAccount && req.companyUAccount.company_user_id > 0;
//       if (!hasSession) {
//         throw new AppError(-101, `invalid session`);
//       }

//       next();
//     } catch (err) {
//       res.apiError(err);
//     }
//   };
// };