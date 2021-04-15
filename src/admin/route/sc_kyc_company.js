const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const kycModel = require("../../model/smart-contract/kyc");
const middleware = require("./middleware");
const debug = require("debug")(`app:event`);

const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());

    router.get("/api/sc/kyc/company", getCompanyIdentity);
    router.get("/api/sc/kyc/company/total", getTotalCompanyCount);
    router.post("/api/sc/kyc/company/target", getTargetCompanyIdentity);
    router.post("/api/sc/kyc/company/verify", verifyCompanyCredential);
    router.post(
      "/api/sc/kyc/company/credential/create",
      createCompanyCredential
    );
    router.post("/api/sc/kyc/company/credential/renew", renewCompanyCredential);
    router.post("/api/sc/kyc/company/credential/burn", burnCompanyCredential);
  },
};

const getCompanyIdentity = async (req, res) => {
  try {
    const { admin_id } = req.query;
    let result = await kycModel.getCompanyIdentity(admin_id);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTotalCompanyCount = async (req, res) => {
  try {
    let result = await kycModel.getTotalCompanyCount();
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTargetCompanyIdentity = async (req, res) => {
  try {
    const { ids } = req.body;
    let result = await kycModel.getTargetCompanyIdentity(ids);
    let data = [];
    result.map((item, index) => {
      data.push({ admin_id: ids[index], company_credential: item });
    });
    res.apiResponse({
      status: 1,
      result: data,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const verifyCompanyCredential = async (req, res) => {
  try {
    const { id, hashHex } = req.body;
    let result = await kycModel.verifyCompanyCredential(id, hashHex);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const createCompanyCredential = async (req, res) => {
  try {
    const { admin_id, id, company } = req.body;
    let result = await kycModel.createCompanyCredential(
      { admin_id },
      id,
      company
    );
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const renewCompanyCredential = async (req, res) => {
  try {
    const { admin_id, id, hashHex } = req.body;
    let result = await kycModel.renewCompanyCredential(
      { admin_id },
      id,
      hashHex
    );
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const burnCompanyCredential = async (req, res) => {
  try {
    const { admin_id, id, hashHex } = req.body;
    let result = await kycModel.burnCompanyCredential(
      { admin_id },
      id,
      hashHex
    );
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
