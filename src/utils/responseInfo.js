const httpStatus = require("http-status")

const responseInfo = (message, data) => {
    return {
        status: 'ok',
        code: httpStatus.OK,
        message,
        data,
    };
};

module.exports = responseInfo;