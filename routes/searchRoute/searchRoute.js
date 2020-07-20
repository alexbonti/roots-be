const UniversalFunctions = require('../../utils/universalFunctions');
const Controller = require('../../controllers');
const Joi = require('joi');

const searchAllUsers = {
  method: "GET",
  path: "/api/search/users",
  config: {
    description: 'Search Users',
    auth: "UserAuth",
    tags: ['api', 'employer', 'search'],
    handler: (request, h) => {
      let userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          let payload = {
            user: userData
          }
          Controller.SearchController.searchUser(payload, (error, success) => {
            if (error)
              reject(UniversalFunctions.sendError(error));
            else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          })
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
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
}

const getUserDetailExtended = {
  method: "GET",
  path: "/api/search/user/{_id}",
  config: {
    description: 'Search User',
    auth: "UserAuth",
    tags: ['api', 'employer', 'search'],
    handler: (request, h) => {
      let userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          let payload = {
            employer: userData,
            userId: request.params._id
          };
          Controller.SearchController.getUserDetailExtended(payload, (error, success) => {
            if (error)
              reject(UniversalFunctions.sendError(error));
            else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          })
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      params: {
        _id: Joi.string().required(),
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

const getAllUserViaName = {
  method: "GET",
  path: "/api/search/users/name/{name}",
  config: {
    description: 'Search User By Name',
    auth: "UserAuth",
    tags: ['api', 'employer', 'search', 'name'],
    handler: (request, h) => {
      let userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          let payload = {
            employer: userData,
            userName: request.params.name
          };
          Controller.SearchController.searchAllUsersByName(payload, (error, success) => {
            if (error)
              reject(UniversalFunctions.sendError(error));
            else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          })
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction,
      params: {
        name: Joi.string().required(),
      }
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

module.exports =
  [searchAllUsers, getUserDetailExtended, getAllUserViaName];