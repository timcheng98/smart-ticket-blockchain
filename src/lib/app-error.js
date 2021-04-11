const ErrorCode = {};

/**
 * new AppError(errorCode, errorMessage)
 * @example new AppError('401', 'authorization failed')
 * @extends Error
 */
class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message || ErrorCode[code];

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = exports = AppError;

exports.setErrorCode = (ec) => {
  Object.keys(ec).forEach((key) => {
    if (key in ErrorCode) {
      throw new Error(`AppError :: error code exists for key <${key}> <${ErrorCode[key]}>`);
    }
    ErrorCode[key] = ec[key];
  });
};
