const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const eventModel = require("../../model/event");
const middleware = require("./middleware");

const debug = require("debug")(`app:event`);

const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use("/api/event", middleware.session.authorize());

    router.get("/api/event/all", getEventAll);
    router.get("/api/event", getEvent);
    router.get("/api/company/event", getCompanyEvent);
    router.post("/api/event", postEvent);
    router.patch("/api/event", patchEvent);
    router.patch("/api/admin/event", patchEventByAdmin);
  },
};

const getEventAll = async (req, res) => {
  try {
    let result = await eventModel.selectEvent({ all: true });

    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getEvent = async (req, res) => {
  try {
    let { event_id } = req.query;
    // let { admin_id } = req.user;

    let eventRc = await eventModel.selectEvent({ where: { event_id } });

    res.apiResponse({
      status: 1,
      eventRc,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getCompanyEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;

    let eventRc = await eventModel.selectEvent({ where: { admin_id } });

    res.apiResponse({
      status: 1,
      eventRc,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const postEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;
    let postObj = {
      ...req.body,
      admin_id,
      start_time: moment(req.body.start_time).unix(),
      end_time: moment(req.body.end_time).unix(),
      released_date: moment(req.body.released_date).unix(),
      close_date: moment(req.body.close_date).unix(),
      event_code: shortid.generate().toUpperCase().replace(/-/g, ""),
      tags: JSON.stringify(req.body.tags),
      categories: JSON.stringify(req.body.categories),
      // country: '',
      // region: '',
      // address: '',
      // status: 1, // Pending
      issued_tickets: 0,
      type: 0,
    };
    delete postObj.start_end_time;
    delete postObj.released_close_date;

    let eventRc = await eventModel.insertEvent(postObj);

    res.apiResponse({
      status: 1,
      eventRc,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const patchEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;
    let postData = {};

    _.each(
      _.pick(req.body, [
        "name",
        "country",
        "region",
        "district",
        "address",
        "short_desc",
        "long_desc",
        "approval_doc",
        "seat_doc",
        "reject_reason",
        "venue",
        "target",
        "email",
        "performer",
        "organization",
        "contact_no",
        "banner_1",
        "banner_2",
        "thumbnail",
      ]),
      (val, key) => {
        postData[key] = _.toString(val);
      }
    );

    _.each(
      _.pick(req.body, [
        "status",
        "need_kyc",
        "is_seat_doc_verified",
        "is_approval_doc_verified",
      ]),
      (val, key) => {
        postData[key] = _.toInteger(val);
      }
    );

    _.each(_.pick(req.body, ["longitude", "latitude"]), (val, key) => {
      postData[key] = _.toNumber(val);
    });

    _.each(_.pick(req.body, ["tags", "categories"]), (val, key) => {
      postData[key] = JSON.stringify(val);
    });

    _.each(
      _.pick(req.body, [
        "released_date",
        "close_date",
        "start_time",
        "end_time",
      ]),
      (val, key) => {
        postData[key] = _.toInteger(moment(val).unix());
      }
    );
    let [eventRC] = await eventModel.updateEvent(req.body.event_id, postData);

    res.apiResponse({
      status: 1,
      eventRC,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const patchEventByAdmin = async (req, res) => {
  try {
    let postData = {};
    console.log("req.body", req.body);
    _.each(
      _.pick(req.body, [
        "name",
        "country",
        "region",
        "address",
        "short_desc",
        "long_desc",
        "approval_doc",
        "seat_doc",
        "reject_reason",
        "banner_1",
        "banner_2",
        "thumbnail",
      ]),
      (val, key) => {
        postData[key] = _.toString(val);
      }
    );

    _.each(_.pick(req.body, ["tags", "categories"]), (val, key) => {
      postData[key] = JSON.stringify(val);
    });

    _.each(
      _.pick(req.body, [
        "status",
        "is_seat_doc_verified",
        "is_approval_doc_verified",
        "admin_id",
      ]),
      (val, key) => {
        postData[key] = _.toInteger(val);
      }
    );

    console.log("postData", postData);
    let eventRC = await eventModel.updateEvent(req.body.event_id, postData);
    // console.log('eventRC', eventRC)
    res.apiResponse({
      status: 1,
      eventRC,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
