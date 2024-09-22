const httpStatus = require("http-status")

const expectationFailed = (message, data) => {
    return {
        status: 'Expectation Failed',
        code: httpStatus.EXPECTATION_FAILED,
        message,
        data,
    };
};

module.exports = expectationFailed;