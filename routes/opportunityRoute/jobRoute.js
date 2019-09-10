var UniversalFunctions = require('../../utils/universalFunctions');
var Controller = require('../../controllers');
var Joi = require('joi');
var Config = require('../../config');

//Create new job opportunity as employer via accessToken
var postOpportunities = {
  method: 'POST',
  path: '/api/jobs/opportunities',
  config: {
    description: 'Post a new job opportunity',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.createOpportunity(userData,payloadData, function (err, data) {
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
        positionTitle: Joi.string().required(),
        employmentType: Joi.string().required(),
        skills : Joi.array().required(),
        seniority : Joi.string().required(),
        startDate : Joi.date().required(),
        endDate : Joi.date().required(),
        industryField : Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
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

// Retrieves all jobOpportunities
var viewOpportunities = {
  method: 'GET',
  path: '/api/jobs/viewOpportunities',
  config: {
    description: 'get job opportunities',
    tags: ['api', 'jobs'],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.getOpportunity(function (error, success) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
          }
        });
      })
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};


//Update job opportunity poster by the employer via accesstoken
var updateOpportunity =
{
  method: 'PUT',
  path: '/api/jobs/ChangeOpportunities',
  config: {
    description: 'Update job opportunity',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.OpportunityController.changeOpportunity(userData, request.payload, function (err, opportunity) {
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
        positionTitle: Joi.string().required(),
        employmentType: Joi.string().required(),
        skills : Joi.array().required(),
        seniority : Joi.string().required(),
        startDate : Joi.date().required(),
        endDate : Joi.date().required(),
        industryField : Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
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

//Soft Delete job opportunity posted
var deleteOpportunity =
{
  method: 'DELETE',
  path: '/api/jobs/deleteOpportunities',
  config: {
    description: 'Delete job opportunity',
    tags: ['api', 'jobs'],
    auth: 'UserAuth',
    handler: function (request, reply) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise((resolve, reject) => {

        Controller.OpportunityController.deleteOpportunity(userData, request.payload, function (err, opportunity) {
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



var JobRoute = [postOpportunities,
   viewOpportunities, 
   updateOpportunity,
   deleteOpportunity
  ]
module.exports = JobRoute;