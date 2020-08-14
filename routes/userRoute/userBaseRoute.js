/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require('../../utils/universalFunctions');
var Controller = require('../../controllers');
var Joi = require('joi');

var userRegister = {
  method: 'POST',
  path: '/api/user/register',
  config: {
    description: 'Register a new user',
    tags: ['api', 'user'],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else {
          Controller.UserBaseController.createUser(payloadData, function (err, data) {
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
        linkedinId: Joi.string().optional().trim().allow(''),
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
  path: '/api/user/verifyOTP',
  config: {
    auth: 'UserAuth',
    description: 'Verify OTP for User',
    tags: ['api', 'otp'],
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.verifyOTP(userData, payloadData, function (err, data) {
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
  path: '/api/user/login',
  config: {
    description: 'Login Via Email & Password For User',
    tags: ['api', 'user'],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.loginUser(payloadData, function (err, data) {
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


var linkedinLogin =
{
  method: 'POST',
  path: '/api/user/loginViaLinkedin',
  config: {
    description: 'Login Via Linkedin For Customer',
    tags: ['api', 'customer'],
    handler: function (request, reply) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.loginViaLinkedin(payloadData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(UniversalFunctions.sendSuccess(null, data))
          }

        })
      });
    },
    validate: {
      payload: {
        linkedinId: Joi.string().required(),

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

var resendOTP =
{
  method: 'PUT',
  path: '/api/user/resendOTP',
  config: {
    auth: 'UserAuth',
    description: 'Resend OTP for Customer',
    tags: ['api', 'customer'],
    handler: function (request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.resendOTP(userData, function (err, data) {
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
  path: '/api/getOTP',
  config: {
    description: 'get OTP for Customer',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.query;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getOTP(userData, function (error, success) {
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

var accessTokenLogin =
{
  /* *****************access token login****************** */
  method: 'POST',
  path: '/api/user/accessTokenLogin',
  config: {
    description: 'access token login',
    tags: ['api', 'user'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.accessTokenLogin(userData, function (err, data) {
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
  path: '/api/user/logout',
  config: {
    description: 'Logout user',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.logoutCustomer(userData, function (err, data) {
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
  path: '/api/user/getProfile',
  config: {
    description: 'get profile of user',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getProfile(userData, function (error, success) {
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
  path: '/api/user/changePassword',
  config: {
    description: 'change Password',
    tags: ['api', 'customer'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.changePassword(userData, request.payload, function (err, user) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, user));
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
  path: '/api/user/forgotPassword',
  config: {
    description: 'forgot password',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.forgetPassword(request.payload, function (error, success) {
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

var resetPassword = {

  method: 'POST',
  path: '/api/user/resetPassword',
  config: {
    description: 'reset password',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.resetPassword(request.payload, function (error, success) {
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

var volunteerUserExtended =
{
  method: 'PUT',
  path: '/api/user/volunteerUserExtended',
  config: {
    description: 'Create/Update user volunteer profile',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.volunteerUserExtended(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        volunteer: [
          {
            volunteerTitle: Joi.string(),
            companyName: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            description: Joi.string()
          }
        ],
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

var removeVolunteerExperience =
{
  method: 'PUT',
  path: '/api/user/removeVolunteerExperience',
  config: {
    description: 'remove Volunteer Experience',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.removeVolunteerExperience(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        volunteerId: Joi.string(),
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

var editVolunteerExperience =
{
  method: 'PUT',
  path: '/api/user/editVolunteerExperience',
  config: {
    description: 'edit Volunteer Experience',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.editVolunteerExperience(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        volunteerId: Joi.string(),
        volunteerTitle: Joi.string(),
        companyName: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        description: Joi.string()
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

var workExperienceUserExtended =
{
  method: 'PUT',
  path: '/api/user/workExperienceUserExtended',
  config: {
    description: 'Create/Update user work experience profile',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.workExperienceUserExtended(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        workExperience: [
          {
            positionTitle: Joi.string(),
            companyName: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            description: Joi.string(),
            referee: Joi.object(
              {
                name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).optional().allow(''),
                phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).optional().allow('')
              }
            ).optional().allow('')
          }
        ]
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

var removeWorkExperience =
{
  method: 'PUT',
  path: '/api/user/removeWorkExperience',
  config: {
    description: 'remove Work Experience',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.removeWorkExperience(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        workExperienceId: Joi.string(),
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

var editWorkExperience =
{
  method: 'PUT',
  path: '/api/user/editWorkExperience',
  config: {
    description: 'edit work Experience',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.editWorkExperience(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        workExperienceId: Joi.string(),
        positionTitle: Joi.string(),
        companyName: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        description: Joi.string(),
        referee: Joi.object(
          {
            name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).optional().allow(''),
            phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).optional().allow('')
          }
        ).optional().allow('')
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


var educationUserExtended =
{
  method: 'PUT',
  path: '/api/user/educationUserExtended',
  config: {
    description: 'Create/Update user education profile',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.educationUserExtended(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        education: [
          {
            school: Joi.string(),
            major: Joi.string(),
            degree: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date()
          }
        ]
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

var removeEducation =
{
  method: 'PUT',
  path: '/api/user/removeEducation',
  config: {
    description: 'remove Education',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.removeEducation(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        educationId: Joi.string(),
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

var editEducation =
{
  method: 'PUT',
  path: '/api/user/editEducation',
  config: {
    description: 'edit Education',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.editEducation(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        educationId: Joi.string(),
        school: Joi.string(),
        major: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        degree: Joi.string()
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

var preferrencesUserExtended =
{
  method: 'PUT',
  path: '/api/user/preferrencesUserExtended',
  config: {
    description: 'Create/Update user preferrences',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.preferrencesUserExtended(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        avatar: Joi.string(),
        preferredLocation: Joi.string().optional().allow(""),
        skills: Joi.array(),
        preferredIndustry: Joi.array().optional().allow(""),
        resumeURL: Joi.string().optional().allow(""),
        coverLetter: Joi.string().optional().allow("")
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

var uploadNewResumeAndCoverLetter =
{
  method: 'PUT',
  path: '/api/user/uploadNewResumeAndCoverLetter',
  config: {
    description: 'upload New Resume And Cover Letter',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.UserBaseController.uploadNewResumeAndCoverLetter(userData, request.payload, function (err, opportunity) {
          if (!err) {
            return resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, opportunity));
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
        resumeURL: Joi.string().optional().allow(""),
        coverLetter: Joi.string().optional().allow("")
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



var getUserExtended = {
  method: 'GET',
  path: '/api/user/getUserExtended',
  config: {
    description: 'get exptended profile of user',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getUserExtended(userData, function (error, success) {
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

var saveJob = {
  method: 'PUT',
  path: '/api/user/saveJob',
  config: {
    description: 'Saves the job as wishlist',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.saveJob(userData, request.payload, function (error, success) {
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
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        jobId: Joi.string().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var unSaveJob = {
  method: 'PUT',
  path: '/api/user/unSaveJob',
  config: {
    description: 'Unsaves the job from wishlist',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.unSaveJob(userData, request.payload, function (error, success) {
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
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        jobId: Joi.string().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};


var getSavedJobs = {
  method: 'GET',
  path: '/api/user/getSavedJobs',
  config: {
    description: 'Rereives the jobs saved by user',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getSavedJobs(userData, function (error, success) {
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
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var updateProfile = {
  method: 'PUT',
  path: '/api/user/updateProfile',
  config: {
    description: 'update Profile',
    auth: 'UserAuth',
    tags: ['api', 'user'],
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.updateProfile(userData, request.payload, function (error, success) {
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
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        first_name: Joi.string().optional().allow(""),
        last_name: Joi.string().optional().allow(""),
        firstLogin: Joi.boolean().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

/**
 * @author Sanchit Dang
 * @description Route for retriving user certificates
 */
const getUserCertificates = {
  method: "GET",
  path: `/api/user/certificates/getUserCertificates`,
  config: {
    description: `Get User Certificates`,
    auth: 'UserAuth',
    tags: ['api', 'user', `extended`, `certificates`, `get`],
    handler: (request, h) => {
      const userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        let payloadData = {
          user: userData
        };
        Controller.UserBaseController.getUserCertificates(payloadData, (error, success) => {
          if (error) return reject(UniversalFunctions.sendError(error));
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
        });
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

/**
 * @author SanchitDang
 * @description Route for creating user certificate
 */
const addUserCertificate = {
  method: "POST",
  path: `/api/user/certificates/addCertificate`,
  config: {
    description: `Add User Certificate`,
    auth: 'UserAuth',
    tags: ['api', 'user', `extended`, `certificates`, `add`],
    handler: (request, h) => {
      const userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        let payloadData = {
          user: userData,
          data: request.payload
        };
        Controller.UserBaseController.addUserCertificate(payloadData, (error, success) => {
          if (error) return reject(UniversalFunctions.sendError(error));
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
        });
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        title: Joi.string().required(),
        organisation: Joi.string().required(),
        credentialUrl: Joi.string().uri().required(),
        credentialId: Joi.string(),
        issueDate: Joi.date().required(),
        expiryDate: Joi.date()
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

/**
 * @author SanchitDang
 * @description Route for soft deleting user certificate
 */
const deleteCertificate = {
  method: "DELETE",
  path: `/api/user/certificates/delete/{_id}`,
  config: {
    description: `Delete User Certificate`,
    auth: 'UserAuth',
    tags: ['api', 'user', `extended`, `certificates`, `delete`],
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      params: {
        _id: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    },
    handler: (request) => {
      const userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      const certId = request.params && request.params._id || null;
      return new Promise((resolve, reject) => {
        let payloadData = {
          user: userData,
          certId: certId
        };
        Controller.UserBaseController.deleteUserCertificate(payloadData, (error, success) => {
          if (error) return reject(UniversalFunctions.sendError(error));
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
        });
      });
    }
  },
};

/**
 * @author SanchitDang
 * @description Route for editing user certificate
 */
const editCertificate = {
  method: "PUT",
  path: `/api/user/certificates/edit/{_id}`,
  config: {
    description: `Delete User Certificate`,
    auth: 'UserAuth',
    tags: ['api', 'user', `extended`, `certificates`, `edit`],
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        title: Joi.string().optional().allow(""),
        organisation: Joi.string().optional().allow(""),
        credentialUrl: Joi.string().uri().optional().allow(""),
        credentialId: Joi.string().optional().allow(""),
        issueDate: Joi.date().optional().allow(""),
        expiryDate: Joi.date().optional().allow("")
      },
      params: {
        _id: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    },
    handler: (request) => {
      const userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      const certId = request.params && request.params._id || null;
      return new Promise((resolve, reject) => {
        let payloadData = {
          user: userData,
          certId: certId,
          data: request.payload
        };
        Controller.UserBaseController.editUserCertificate(payloadData, (error, success) => {
          if (error) return reject(UniversalFunctions.sendError(error));
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
        });
      });
    }
  },
};

var UserBaseRoute =
  [
    userRegister,
    verifyOTP,
    login,
    linkedinLogin,
    resendOTP,
    getOTP,
    accessTokenLogin,
    logoutCustomer,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    volunteerUserExtended,
    workExperienceUserExtended,
    educationUserExtended,
    getUserExtended,
    saveJob,
    unSaveJob,
    getSavedJobs,
    preferrencesUserExtended,
    updateProfile,
    uploadNewResumeAndCoverLetter,
    removeVolunteerExperience,
    editVolunteerExperience,
    removeWorkExperience,
    editWorkExperience,
    removeEducation,
    editEducation,
    getUserCertificates,
    addUserCertificate,
    deleteCertificate,
    editCertificate
  ]
module.exports = UserBaseRoute;