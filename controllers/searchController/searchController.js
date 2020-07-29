/**
* Created by Sanchit Dang
*/

var Service = require('../../services');
var UniversalFunctions = require('../../utils/universalFunctions');
var async = require('async');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

const searchAllUser = (payloadData, callback) => {
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
        if (data.length == 0) cb(ERROR.NOT_FOUND)
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


const searchAllUsersByName = (payloadData, callback) => {
  let result = [];
  async.series([(cb) => {
    let criteria = {
      _id: payloadData.employer._id,
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
    let toSearch = payloadData.userName;
    let criteria = {
      $or: [
        { first_name: { $regex: `${toSearch}`, $options: "gi" }, emailVerified: true },
        { last_name: { $regex: `${toSearch}`, $options: "gi" }, emailVerified: true }
      ]
    };
    console.log(criteria)
    let projection = {
      password: 0,
      codeUpdatedAt: 0,
      accessToken: 0,
      __v: 0,
      emailVerified: 0,
      registrationDate: 0,
      OTPCode: 0,
      firstLogin: 0
    };
    Service.UserService.getUser(criteria, projection, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.USERS_WITH_CRITERIA_NOT_FOUND)
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
  let result = {};
  async.series([(cb) => {
    let criteria = {
      _id: payloadData.employer._id,
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
  }, (cb) => {
    let criteria = {
      emailVerified: true,
      _id: payloadData.userId
    };
    let projection = {
      password: 0,
      codeUpdatedAt: 0,
      accessToken: 0,
      __v: 0,
      emailVerified: 0,
      registrationDate: 0,
      firstLogin: 0
    };
    Service.UserService.getUser(criteria, projection, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.NOT_FOUND)
        else {
          Object.assign(result, data[0]);
          cb();
        }
      }
    });
  },
  (cb) => {
    let criteria = {
      userId: payloadData.userId
    };
    let projection = {
      __v: 0,
      userId: 0
    };
    Service.UserService.getUserExtended(criteria, projection, {}, (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.NOT_FOUND)
        else {
          let userData = data[0];
          if (userData.hasOwnProperty("certificates")) {
            if (userData.certificates.length > 0)
              userData.certificates = userData.certificates.filter(certificate => certificate.isActive == true);
          }
          Object.assign(result, userData);
          cb();
        }
      }
    });
  }
  ], (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, { user: result });
    }
  })
}

module.exports = {
  searchUser: searchAllUser,
  getUserDetailExtended: getUserDetailExtended,
  searchAllUsersByName: searchAllUsersByName
};
