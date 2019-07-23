var UniversalFunctions = require('../../utils/universalFunctions');
var Controller = require('../../controllers');
var Joi = require('joi');
var Config = require('../../config');

var employerRegister = {
  method: 'POST',
  path: '/api/employer/register',
  config: {
    description: 'Register a new employer',
    tags: ['api', 'employer'],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else {
          Controller.EmployerBaseController.createEmployer(payloadData, function (err, data) {
            console.log(">>>>>>>".err, data)
            if (err) {
              reject(UniversalFunctions.sendError(err));
            } else {
              resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data))
            }
          });
        }
      })

    },
    validate: {
      payload: {
        first_name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        last_name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        emailId: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).optional(),
        password: Joi.string().optional().min(5).allow(''),
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

var verifyOTP =
{
  method: 'PUT',
  path: '/api/employer/verifyOTP',
  config: {
    auth: 'UserAuth',
    description: 'Verify OTP for employer',
    tags: ['api', 'otp'],
    handler: function (request, h) {
      var payloadData = request.payload;
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
          console.log(employerData, "=============")
        Controller.EmployerBaseController.verifyOTP(employerData, payloadData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_COMPLETE, data))
          }
        })
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        OTPCode: Joi.string().length(6).required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


var login = {
  method: 'POST',
  path: '/api/employer/login',
  config: {
    description: 'Login Via Email & Password For employer',
    tags: ['api', 'employer'],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.loginEmployer(payloadData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(null, data))
          }
        });
      })
    },
    validate: {
      payload: {
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


var resendOTP =
{
  method: 'PUT',
  path: '/api/employer/resendOTP',
  config: {
    auth: 'UserAuth',
    description: 'Resend OTP for Customer',
    tags: ['api', 'customer'],
    handler: function (request, h) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.resendOTP(employerData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, data))
          }
        })
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getOTP = {
  method: 'GET',
  path: '/api/employer/getOTP',
  config: {
    description: 'get OTP for Customer',
    tags: ['api', 'employer'],
    handler: function (request, reply) {
      var employerData = request.query;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.getOTP(employerData, function (error, success) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
          }
        })
      });
    },
    validate: {
      query: {
        phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5)
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var accessTokenLogin =
{
  /* *****************access token login****************** */
  method: 'POST',
  path: '/api/employer/accessTokenLogin',
  config: {
    description: 'access token login',
    tags: ['api', 'employer'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.accessTokenLogin(employerData, function (err, data) {
          console.log('%%%%%%%%%%%%%%%', err, data)
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(null, data));
          }
          else {
            return reject(UniversalFunctions.sendError(err));
          }
        });

      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }

}

var logoutCustomer = {
  method: 'PUT',
  path: '/api/employer/logout',
  config: {
    description: 'Logout employer',
    auth: 'UserAuth',
    tags: ['api', 'employer'],
    handler: function (request, reply) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.logoutCustomer(employerData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.LOGOUT));
          }
        });
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }

  }
};

var getProfile = {
  method: 'GET',
  path: '/api/employer/getProfile',
  config: {
    description: 'get profile of employer',
    auth: 'UserAuth',
    tags: ['api', 'employer'],
    handler: function (request, reply) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.getProfile(employerData, function (error, success) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
          }
        });
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var changePassword =
{
  method: 'PUT',
  path: '/api/employer/changePassword',
  config: {
    description: 'change Password',
    tags: ['api', 'customer'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.EmployerBaseController.changePassword(employerData, request.payload, function (err, employer) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, employer));
          }
          else {
            return reject(UniversalFunctions.sendError(err));
          }
        });
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        oldPassword: Joi.string().required().min(4),
        newPassword: Joi.string().required().min(4)
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

var forgotPassword = {
  method: 'POST',
  path: '/api/employer/forgotPassword',
  config: {
    description: 'forgot password',
    tags: ['api', 'employer'],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.forgetPassword(request.payload, function (error, success) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, success));
          }
        });
      })
    },
    validate: {
      payload: {
        phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5)
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }

  }
};

var resetPassword = {

  method: 'POST',
  path: '/api/employer/resetPassword',
  config: {
    description: 'reset password',
    tags: ['api', 'employer'],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.resetPassword(request.payload, function (error, success) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, success));
          }
        });
      })
    },
    validate: {
      payload: {
        password: Joi.string().min(6).required().trim(),
        phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5),
        OTPCode: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }

  }
};

var EmployerBaseRoute =
  [
    employerRegister,
    verifyOTP, 
    login,
    resendOTP,
    getOTP,
    accessTokenLogin,
    logoutCustomer,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword
  ]
module.exports = EmployerBaseRoute;