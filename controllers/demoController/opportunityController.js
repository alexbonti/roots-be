var Service = require('../../services');
var UniversalFunctions = require('../../utils/UniversalFunctions');
var async = require('async');
var TokenManager = require('../../lib/TokenManager');
var CodeGenerator = require('../../lib/CodeGenerator');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require('underscore');

var createOpportunity = function (userData,payloadData, callback) {
  console.log('payload:', payloadData);
  var accessToken = null;
  var uniqueCode = null;
  var dataToSave = payloadData;
  console.log('payload Data:', payloadData);
  if (dataToSave.password)
    dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
  var opportunityData = null;
  var appVersion = null;
  var customerData;
  var userdata = {}
  var userFound = null;
  async.series([
    
    function (cb) {
      var query = {
        _id: userData._id
      };
      var projection = {
        __v: 0,
        password: 0,
        accessToken: 0,
        codeUpdatedAt: 0
      };
      var options = { lean: true };
      Service.EmployerService.getEmployer(query, projection, options, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
          else {
            customerData = data && data[0] || null;
            cb()
          }
        }
      });
    },

    function (cb) {
      dataToSave.employerId = customerData._id;
      dataToSave.publishDate = new Date().toISOString();
      Service.OpportunityService.createOpportunity(dataToSave, function (err, opportunityDataFromDB) {
        console.log('hello', err, opportunityDataFromDB)
        if (err) {
          cb(err)
        } else {
          opportunityData = opportunityDataFromDB;
          cb();
        }
      })
    }    
  ], function (err, data, user) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, {});
    }
  });
};


var getOpportunity = function (callback) {
  var opportunityData;
  async.series([
    function (cb) {
      var projection = {
        __v: 0,
        employerId: 0,
        _id:0,
        password: 0,
        accessToken: 0,
        codeUpdatedAt: 0,
      };
      var options = { lean: true };
      Service.OpportunityService.getOpportunity({"active" : true}, projection, options, function (err, data) {
        if (err) {
          cb(err);
        } else {
            opportunityData = data;
            cb()
        }
      });
    }

  ], function (err, result) {
    if (err) return callback(err)
    else return callback(null, { opportunityData: opportunityData })
  })
}

var changeOpportunity = function (userData, payloadData, callbackRoute) {
  var opportunityData;
  async.series([
    function (cb) {
      var query = {
        _id: userData._id
      };
      var options = { lean: true };
      Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
          else cb()
        }
      });
    },

    function(cb)
    {
      var projection = {
        __v: 0,
        _id:0,
        accessToken: 0,
        codeUpdatedAt: 0
      };
      
      var options = { lean: true };
      Service.OpportunityService.getOpportunity({_id: payloadData.opportunityId}, projection, options, function (err, data) {
        if (err) {
          cb(err); 
        } else {
          opportunityData = data && data[0] || null;
          cb();
        }
      });
    },

    
    function (callback) {
      console.log(">>>>>>",opportunityData)
      if(userData._id == opportunityData.employerId){
        var date = Date.now();
        var dataToUpdate = { $set: { 'position': payloadData.position, 'jobType': payloadData.jobType ,'location': payloadData.location,'content':payloadData.content,'publishDate': date } };
        var condition = { _id: payloadData.opportunityId };
        Service.OpportunityService.updateOpportunity(condition, dataToUpdate, {}, function (err, opportunity) {
          console.log("opportunityData-------->>>" + JSON.stringify(opportunity));
          if (err) {
            callback(err);
          } else {
            if (!opportunity || opportunity.length == 0) {
              callback(ERROR.NOT_FOUND);
            }
            else {
              callback(null);
            }
          }
        });
      }
      else{
        callback(ERROR.INVALID_OPPORTUNITY_ID)
      }
    }
  ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null),{ opportunityData: opportunityData };
      }
    });
}

 

var deleteOpportunity = function (userData, payloadData, callbackRoute) {
  var opportunityData;
  async.series([
    function (cb) {
      var query = {
        _id: userData._id
      };
      var options = { lean: true };
      Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
          else cb()
        }
      });
    },



    function(cb)
    {
      var projection = {
        __v: 0,
        _id:0,
        accessToken: 0,
        codeUpdatedAt: 0
      };
      
      var options = { lean: true };
      Service.OpportunityService.getOpportunity({_id: payloadData.opportunityId}, projection, options, function (err, data) {
        if (err) {
          cb(err); 
        } else {
          opportunityData = data && data[0] || null;
          cb();
        }
      });
    },

    function (callback) {
      if(userData._id == opportunityData.employerId){

        var dataToUpdate = { $set: { 'active': false } };
        var condition = { _id: payloadData.opportunityId };
        Service.OpportunityService.updateOpportunity(condition, dataToUpdate, {}, function (err, opportunity) {
          console.log("opportunityData-------->>>" + JSON.stringify(opportunity));
          if (err) {
            callback(err);
          } else {
            if (!opportunity || opportunity.length == 0) {
              callback(ERROR.NOT_FOUND);
            }
            else {
              callback(null);
            }
          }
        });
      }
      else{
        callback(ERROR.INVALID_OPPORTUNITY_ID)
      }
    }
  ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null),{ opportunityData: opportunityData };
      }
    });
} 



module.exports = {
    createOpportunity: createOpportunity, 
    getOpportunity: getOpportunity,
    changeOpportunity:changeOpportunity,
    deleteOpportunity: deleteOpportunity
};