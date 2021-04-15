const { KycAPI } = require('./kycClass')


const kycAPI = new KycAPI();

// user
exports.createUserCredential = async (user, id, userObj) => {
  await kycAPI.init();
  return kycAPI.createUserCredential(user, id, userObj)
}

exports.getTotalUserCount = async () => {
  await kycAPI.init();
  return kycAPI.getTotalUserCount()
}

exports.getTargetUserIdentity = async (ids) => {
  await kycAPI.init();
  return kycAPI.getTotalUser(ids)
}

exports.verifyUserCredential = async (id, hashHex) => {
  await kycAPI.init();
  return kycAPI.verifyUserCredential(id, hashHex)
}

exports.getUserIdentity = async (id) => {
  await kycAPI.init();
  return kycAPI.getUser(id)
}

exports.getTotalUserCount = async () => {
  await kycAPI.init();
  return kycAPI.getTotalUserCount()
}

exports.renewUserCredential = async (user, id, hashHex) => {
  await kycAPI.init();
  return kycAPI.renewUserCredential(user, id, hashHex)
}

exports.burnUserCredential = async (user, id) => {
  await kycAPI.init();
  return kycAPI.burnUserCredential(user, id)
}





// company

exports.createCompanyCredential = async (user, id, company) => {
  await kycAPI.init();
  return kycAPI.createCompanyCredential(user, id, company)
}

exports.getTotalCompanyCount = async () => {
  await kycAPI.init();
  return kycAPI.getTotalCompanyCount()
}

exports.getTargetCompanyIdentity = async (ids) => {
  await kycAPI.init();
  return kycAPI.getTotalCompany(ids)
}

exports.verifyCompanyCredential = async (id, hashHex) => {
  await kycAPI.init();
  return kycAPI.verifyCompanyCredential(id, hashHex)
}

exports.getCompanyIdentity = async (id) => {
  await kycAPI.init();
  return kycAPI.getCompany(id)
}

exports.getTotalCompanyCount = async () => {
  await kycAPI.init();
  return kycAPI.getTotalCompanyCount()
}

exports.renewCompanyCredential = async (user, id, hashHex) => {
  await kycAPI.init();
  return kycAPI.renewCompanyCredential(user, id, hashHex)
}

exports.burnCompanyCredential = async (user, id) => {
  await kycAPI.init();
  return kycAPI.burnCompanyCredential(user, id)
}