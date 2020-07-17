/**
* Created by Sanchit Dang
*/

var Service = require('../../services');
var UniversalFunctions = require('../../utils/universalFunctions');
var async = require('async');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

const searchUser = (payloadData, callback) => {
  let result = [];
  async.series([(cb) => {
    const userData = payloadData.user;
    let criteria = {
      _id: userData._id,
      emailVerified: true
    }

    Service.EmployerService.getEmployer(criteria, {}, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
        else cb()
      }
    });
  },
  (cb) => {
    let projection = {
      password: 0,
      codeUpdatedAt: 0,
      accessToken: 0,
      __v: 0,
      emailVerified: 0,
      registrationDate: 0
    };
    Service.UserService.getUser({ emailVerified: true }, projection, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
        else {
          result = data;
          cb();
        }
      }
    });
  }
  ], (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, { users: result });
    }
  })
}

const getUserDetailExtended = (payloadData, callback) => {
  let result = [];
  async.series([(cb) => {
    let criteria = {
      _id: payloadData.employer._id
    }
    Service.EmployerService.getEmployer(criteria, {}, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
        else cb()
      }
    });
  },
  (cb) => {
    let criteria = {
      userId: payloadData.userId
    };
    let projection = {
      __v: 0
    };
    Service.UserService.getUserExtended(criteria, projection, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
        else {
          result = data;
          cb();
        }
      }
    });
  }
  ], (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, { users: result });
    }
  })
}

module.exports = {
  searchUser: searchUser,
  getUserDetailExtended: getUserDetailExtended
};
