module.exports = {
  USER: {
    NOT_EXIST: 'USER_NOT_EXIST',
  },
  TOKEN: {
    INVALID: 'INVALID_ACCESS_TOKEN',
    WRONG_SIGN: 'WRONG_SIGNATURE',
    EXPIRED: 'ACCESS_TOKEN_IS_EXPIRED',
  },
  CODE: {
    error400: {
      statusCode: 400,
      statusMessage: 'Request error',
    },
    error401: {
      statusCode: 401,
      statusMessage: 'UnAuthorize',
    },
    error404: {
      statusCode: 404,
      statusMessage: 'Not found',
    },
    error403: {
      statusCode: 403,
      statusMessage: "Access Denied. You don't have permission to access.",
    },
  },
}
