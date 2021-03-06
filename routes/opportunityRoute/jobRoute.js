var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

//Create new job opportunity as employer via accessToken
var postOpportunities = {
  method: "POST",
  path: "/api/jobs/opportunities",
  config: {
    description: "Post a new job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.validateLatLongValues(request.payload.latitude, request.payload.longitude)) {
          reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_LAT_LONG));
        }
        else {
          Controller.OpportunityController.createOpportunity(
            userData,
            payloadData,
            function (err, data) {
              console.log(">>>>>>>".err, data);
              if (err) {
                reject(UniversalFunctions.sendError(err));
              } else {
                resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .CREATED,
                    data
                  )
                );
              }
            }
          );
        }
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        positionTitle: Joi.string().required(),
        employmentType: Joi.string().required(),
        skills: Joi.array().required(),
        seniority: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        industryField: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var createOpportunityDraft = {
  method: "POST",
  path: "/api/jobs/opportunityDraft",
  config: {
    description: "Save as draft for later",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, h) {
      var payloadData = request.payload;
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.validateLatLongValues(request.payload.latitude, request.payload.longitude)) {
          reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_LAT_LONG));
        }
        else {
          Controller.OpportunityController.createOpportunityDraft(
            userData,
            payloadData,
            function (err, data) {
              console.log(">>>>>>>".err, data);
              if (err) {
                reject(UniversalFunctions.sendError(err));
              } else {
                resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .CREATED,
                    data
                  )
                );
              }
            }
          );
        }
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        positionTitle: Joi.string().optional().allow(""),
        employmentType: Joi.string().optional().allow(""),
        skills: Joi.array().optional().allow(""),
        seniority: Joi.string().optional().allow(""),
        startDate: Joi.date().optional().allow(""),
        endDate: Joi.date().optional().allow(""),
        industryField: Joi.string().optional().allow(""),
        description: Joi.string().optional().allow(""),
        location: Joi.string().optional().allow(""),
        latitude: Joi.number().optional().allow(""),
        longitude: Joi.number().optional().allow("")
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

// Retrieves all jobOpportunities
var viewOpportunities = {
  method: "GET",
  path: "/api/jobs/viewOpportunities",
  config: {
    description: "get job opportunities",
    tags: ["api", "jobs"],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.getOpportunity(function (
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var searchOpportunities = {
  method: "GET",
  path: "/api/jobs/searchOpportunities",
  config: {
    description: "search job opportunities",
    tags: ["api", "jobs"],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.searchOpportunities(request.query, function (
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    validate: {
      query: {
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        distance: Joi.number().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getOpportunityDraft = {
  method: "GET",
  path: "/api/jobs/getOpportunityDraft",
  config: {
    description: "get job opportunities from draft",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.getOpportunityDraft(userData, function (
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

//Update job opportunity poster by the employer via accesstoken
var updateOpportunity = {
  method: "PUT",
  path: "/api/jobs/ChangeOpportunities",
  config: {
    description: "Update job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.changeOpportunity(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        opportunityId: Joi.string().required(),
        positionTitle: Joi.string().optional(),
        employmentType: Joi.string().optional(),
        skills: Joi.array().optional(),
        seniority: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
        industryField: Joi.string().optional(),
        description: Joi.string().optional(),
        location: Joi.string().optional(),
        latitude: Joi.number(),
        longitude: Joi.number()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var updateOpportunityDraft = {
  method: "PUT",
  path: "/api/jobs/updateOpportunityDraft",
  config: {
    description: "Update job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.changeOpportunityDraft(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        opportunityId: Joi.string().required(),
        positionTitle: Joi.string().optional().allow(""),
        employmentType: Joi.string().optional().allow(""),
        skills: Joi.array().optional().allow(""),
        seniority: Joi.string().optional().allow(""),
        startDate: Joi.date().optional().allow(""),
        endDate: Joi.date().optional().allow(""),
        industryField: Joi.string().optional().allow(""),
        description: Joi.string().optional().allow(""),
        location: Joi.string().optional().allow(""),
        latitude: Joi.number().optional().allow(""),
        longitude: Joi.number().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

//Soft Delete job opportunity posted
var deleteOpportunity = {
  method: "DELETE",
  path: "/api/jobs/deleteOpportunities",
  config: {
    description: "Delete job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.deleteOpportunity(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        opportunityId: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var deleteOpportunityDraft = {
  method: "DELETE",
  path: "/api/jobs/deleteOpportunityDraft",
  config: {
    description: "Delete job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.deleteOpportunityDraft(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        opportunityId: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var postDraftToOpportunities = {
  method: "POST",
  path: "/api/jobs/postDraftToOpportunities",
  config: {
    description: "Post draft to  job opportunity",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.postDraftToOpportunities(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        draftId: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var updateShortListed = {
  method: "PUT",
  path: "/api/jobs/updateShortListed",
  config: {
    description: "update Short Listed",
    tags: ["api", "jobs"],
    auth: "UserAuth",
    handler: function (request, reply) {
      var userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.OpportunityController.updateShortListed(
          userData,
          request.payload,
          function (err, opportunity) {
            if (!err) {
              return resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  opportunity
                )
              );
            } else {
              return reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      payload: {
        opportunityId: Joi.string().required(),
        shortListed: Joi.array().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var JobRoute = [
  postOpportunities,
  viewOpportunities,
  updateOpportunity,
  deleteOpportunity,
  createOpportunityDraft,
  getOpportunityDraft,
  updateOpportunityDraft,
  deleteOpportunityDraft,
  postDraftToOpportunities,
  updateShortListed,
  searchOpportunities
];
module.exports = JobRoute;
