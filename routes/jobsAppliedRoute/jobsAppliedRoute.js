var UniversalFunctions = require('../../utils/universalFunctions');
var Controller = require('../../controllers');
var Joi = require('joi');
var Config = require('../../config');

//Apply for a job as user via accesstoken
var applyJob = {
  method: 'POST',
  path: '/api/user/applyjob',
  config: {
    description: 'Apply for job',
    tags: ['api', 'jobsapplication'],
    auth: 'UserAuth',
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.JobsAppliedController.applyJob(userData,payloadData, function (err, data) {
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
        jobId: Joi.string().required(),
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

//View jobs applied as user via accesstoken
var viewJobsApplied =
{
  method: 'GET',
  path: '/api/user/viewjobs',
  config: {
    description: 'View job Application',
    tags: ['api', 'viewjobapplication'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.JobsAppliedController.viewAppliedJobs(userData, function (err, opportunity) {
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
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

//View jobs posted as employer via access token
var viewJobsPosted =
{
  method: 'GET',
  path: '/api/employer/viewjobsposted',
  config: {
    description: 'View jobs Posted',
    tags: ['api', 'viewjobsposted'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.JobsAppliedController.viewJobsPosted(userData, function (err, opportunity) {
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
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

//View job applicants by specific job via access token
var viewJobApplicants =
{
  method: 'POST',
  path: '/api/employer/viewjobapplicants',
  config: {
    description: 'View job Applicants',
    tags: ['api', 'viewjobapplicants'],
    auth: 'UserAuth',
    handler: function (request, reply) {

      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.JobsAppliedController.viewJobApplicants(userData,payloadData, function (err, opportunity) {
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
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        opportunityId : Joi.string().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

//Withdraw from a specific job via accesstoken
var withdrawJob =
{
  method: 'DELETE',
  path: '/api/user/withdrawjob',
  config: {
    description: 'Withdraw job application',
    tags: ['api', 'withdrawjobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.JobsAppliedController.withdrawJob(userData, request.payload, function (err, opportunity) {
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
        opportunityId : Joi.string().required()
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



//Reject an applicant by opportunityId and candidateId via accesstoken
var rejectApplicant =
{
  method: 'DELETE',
  path: '/api/employer/rejectapplication',
  config: {
    description: 'Reject an applicant for a specific job',
    tags: ['api', 'rejectapplicant'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.JobsAppliedController.rejectApplicant(userData, request.payload, function (err, opportunity) {
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
        opportunityId : Joi.string().required(),
        candidateId : Joi.string().required()
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



var JobsAppliedRoute = [
    applyJob,
    withdrawJob,
    viewJobsApplied,
    viewJobApplicants,
    viewJobsPosted,
    rejectApplicant
   ]
 module.exports = JobsAppliedRoute;