var UniversalFunctions = require('../../utils/universalFunctions');
var Controller = require('../../controllers');
var Joi = require('joi');
var Config = require('../../config');

//Register Employer
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
        companyId: Joi.string().required(),
        // businessPhoneNumber: Joi.string().regex(/^[0-9]{10}$/).trim().min(2).required(),
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

//verifies OTP for email verification
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

//login Employer
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

//Resends the OTP
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

//Request OTP
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
        emailId: Joi.string().required()
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

//Login via accessToken
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

//Logout
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

//Get profile information via accesstoken
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

//change password via old password and accessToken
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
        oldPassword: Joi.string().required().min(5),
        newPassword: Joi.string().required().min(5)
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

//Reset password via phonenumber
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
        emailId: Joi.string().required()
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

//Reset password verification
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
        password: Joi.string().min(5).required().trim(),
        emailId: Joi.string().required(),
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


var createCompany = {
  method: 'POST',
  path: '/api/employer/createcompany',
  config: {
    description: 'Register company ',
    tags: ['api', 'createcompany'],
    auth: 'UserAuth',
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.createCompany(userData,payloadData, function (err, data) {
          console.log(">>>>>>>".err, data)
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data))
          }
        });
      })

    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        companyName: Joi.string().required(),
        companyLogo: Joi.string().required(),
        location: Joi.string().required(),
        companyIndustry : Joi.string().required(),
        companyDescription: Joi.string().required(),
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

var getCompany = {
  method: 'GET',
  path: '/api/employer/getcompany',
  config: {
    description: 'get company details',
    auth: 'UserAuth',
    tags: ['api', 'companydetails'],
    handler: function (request, reply) {
      var employerData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.getCompany(employerData, function (error, success) {
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

var updateCompany = {
  method: 'PUT',
  path: '/api/employer/updatecompany',
  config: {
    description: 'Update Company',
    auth: 'UserAuth',
    tags: ['api', 'updatecompany'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.updateCompany(userData, request.payload, function (error, data) {
          if (error) {
            reject(UniversalFunctions.sendError(error))
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
          }
        });
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        companyId : Joi.string().required(),
        companyName: Joi.string().required(),
        companyLogo: Joi.string().required(),
        location: Joi.string().required(),
        companyIndustry: Joi.string().required(),
        companyDescription: Joi.string().required()
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


var leaveCompany = {
  method: 'DELETE',
  path: '/api/employer/leavecompany',
  config: {
    description: 'Leave Company',
    auth: 'UserAuth',
    tags: ['api', 'leavecompany'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.leaveCompany(userData, function (error, data) {
          if (error) {
            reject(UniversalFunctions.sendError(error))
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
          }
        });
      })
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var assignToCompany = {
  method: 'POST',
  path: '/api/employer/assigntocompany',
  config: {
    description: 'Assign employer to an existing company ',
    tags: ['api', 'assigncompany'],
    auth: 'UserAuth',
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.EmployerBaseController.assignToCompany(userData,payloadData, function (err, data) {
          console.log(">>>>>>>".err, data)
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data))
          }
        });
      })

    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        companyId : Joi.string().required()
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

var EmployerBaseRoute = [
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
  resetPassword,
  createCompany,
  getCompany,
  updateCompany,
  assignToCompany,
  leaveCompany
]
module.exports = EmployerBaseRoute;
