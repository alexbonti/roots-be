var Service = require('../../services');
var UniversalFunctions = require('../../utils/UniversalFunctions');
var async = require('async');
var TokenManager = require('../../lib/TokenManager');
var CodeGenerator = require('../../lib/CodeGenerator');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var SUCCESS = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS;
var _ = require('underscore');


//Apply for a job as user via accesstoken
var applyJob = function (userData, payloadData, callback) {
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
      var options = {
        lean: true
      };
      Service.UserService.getUser(query, projection, options, function (err, data) {
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
      var projection = {
        __v: 0,
        employerId: 0,
        accessToken: 0,
        codeUpdatedAt: 0,
      };
      var options = {
        lean: true
      };
      Service.OpportunityService.getOpportunity({_id: payloadData.jobId, active: true}, projection, options, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data == null || data.length == 0) {
            cb(ERROR.INVALID_JOB_APPLICATION)
          } else {
            cb()
          }
        }
      });
    },

    function (cb) {
      var projection = {
        __v: 0,
        accessToken: 0,
        codeUpdatedAt: 0,
      };

      var options = {
        lean: true
      };
      Service.JobsAppliedService.getJobs({candidateId: userData._id,jobId: payloadData.jobId,active: false}, projection, options, function (err, data) {
        if (err) {
            cb(err);
        } else {
          if (data.length > 0) {
            opportunityData = data;
            var dataToUpdate = {
              $set: {
                'active': true,
                'appliedDate': new Date().toISOString(),
                'withdrawDate': new Date(2050, 05, 05).toISOString(),
                'applicationStatus': "Processing"
              }
            };
            var condition = {
              _id: opportunityData[0]._id
            };
            Service.JobsAppliedService.updateJobs(condition, dataToUpdate, {}, function (err, data) {
              if (err) {
                cb(err);
              } else {
                cb(null);
              }
            });
          } else {
            dataToSave.candidateId = customerData._id;
            dataToSave.appliedDate = new Date().toISOString();
            dataToSave.applicationStatus = "Processing";
            dataToSave.active = true;
            dataToSave.withdrawDate = new Date(2040, 05, 05).toISOString();
            Service.JobsAppliedService.applyJob(dataToSave, function (err, opportunityDataFromDB) {
              console.log('hello', err, opportunityDataFromDB)
              if (err) {
                if (err.code == 11000) {
                  cb(ERROR.INVALID_JOB_APPLICATION)
                } else {
                  cb(err)
                }
              } else {
                opportunityData = opportunityDataFromDB;
                cb();
              }
            })
          }
        }
      });
    },
  ], function (err, data, user) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

//View jobs applied as user via accesstoken
var viewAppliedJobs = function (userData, callback) {
  var opportunityData;
  async.series([
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = {
          lean: true
        };
        Service.UserService.getUser(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
            else cb()
          }
        });
      },
      function (cb) {
        var path = "jobId";
        var select = "company positionTitle employmentType skills seniority startDate endDate location description";
        var populate = {
          path: path,
          match: {},
          select: select,
          options: {
            lean: true
          }
        };
        var projection = {
          __v: 0,
          codeUpdatedAt: 0,
          withdrawDate: 0,
          candidateId: 0
        };

        Service.JobsAppliedService.getPopulatedJobs({
          candidateId: userData._id
        }, projection, populate, {}, {}, function (err, data) {
          if (err) {
            cb(err);
          } else {
            opportunityData = data;
            console.log(opportunityData)
            cb();
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, {
          opportunityData: opportunityData
        });
      }
    });
}

//View jobs posted as employer via access token
var viewJobsPosted = function (userData, callback) {
  var numberOfApplicants = [] ; 
  var jobsData;
  async.series([
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = {
          lean: true
        };
        Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
            else cb()
          }
        });
      },
      function (cb) {
        var projection = {
          __v: 0,
          accessToken: 0,
          codeUpdatedAt: 0
        };
        var options = {
          lean: true
        };
        Service.OpportunityService.getOpportunity({
          employerId: userData._id,
          active : true
        }, projection, options, function (err, data) {
          if (err) {
            if (data == null) {
              cb(ERROR.INVALID_OPPORTUNITY_ID)
            } else cb(err);
          } else {
            jobsData = data;
            cb();
          }
        });
      },
      function(cb){
        if (jobsData) {
          var taskInParallel = [];
          for (var key in jobsData) {
              (function (key) {
                  taskInParallel.push((function (key) {
                      return function (embeddedCB) {
                          //TODO
                          Service.JobsAppliedService.getJobs({jobId : jobsData[key]._id, active : true}, {}, { lean : true} , function(err, data){
                            if(err)
                            {
                              embeddedCB(err)
                            }
                            else{
                              jobsData[key].numberOfApplications = data.length;
                              embeddedCB()
                            }
                          })
                      }
                  })(key))
              }(key));
          }
          async.parallel(taskInParallel, function (err, result) {
              cb(null);
          });
      }
      else {
          cb()
      }
      }
    ],
    function (error, result) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, {
          jobsData: jobsData
        });
      }
    });
}

//View job applicants by specific job via access token
var viewJobApplicants = function (userData, payloadData, callback) {
  var opportunityData = [];
  var jobsData;
  async.series([
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = {
          lean: true
        };
        Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
            else cb()
          }
        });
      },

      function (cb) {
        var projection = {
          __v: 0,
          employerId: 0,
          password: 0,
          accessToken: 0,
          codeUpdatedAt: 0,
        };
        var options = {
          lean: true
        };
        Service.OpportunityService.getOpportunity({
          "_id": payloadData.opportunityId,
          "active": true
        }, projection, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data == null || data.length == 0) {
              cb(ERROR.INVALID_OPPORTUNITY_ID)
            } else {
              jobsData = data;
              cb()
            }
          }
        });
      },
      function (cb) {
        var path = "jobId candidateId";
        var select = "company positionTitle startDate endDate employmentType location employerId first_name last_name emailId linkedinId";
        var populate = {
          path: path,
          match: {},
          select: select,
          options: {
            lean: true
          }
        };
        var projection = {
          __v: 0,
          codeUpdatedAt: 0,
          withdrawDate: 0,
        };

        Service.JobsAppliedService.getPopulatedJobs({
          jobId: payloadData.opportunityId,
          active: true
        }, projection, populate, {}, {}, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if(data == null || data.length == 0)
            {
              opportunityData = jobsData
              cb();
            }
            else{
            opportunityData = data;
            console.log(opportunityData)
            cb();
            }
            
          }
        });
      },
      function(cb){
        if (opportunityData) {
          var taskInParallel = [];
          for (var key in opportunityData) {
            (function (key) {
              taskInParallel.push((function (key) {
                return function (embeddedCB) {
                  Service.UserService.getUserExtended({ userId : opportunityData[key].candidateId._id},{},{}, function (err, data) {
                    if (err) {
                      embeddedCB(err)
                    } else {
                      if(data.length !=0)
                      {opportunityData[key].UserExtendedProfile = data && data[0] || null;
                        console.log("Not Null",data[0])
                      embeddedCB()}
                      else{
                        opportunityData[key].UserExtendedProfile = null;
                        console.log("null")
                        embeddedCB()
                      }
                    }
                  })
                }
              })(key))
            }(key));
          }
          async.parallel(taskInParallel, function (err, result) {
            cb(null);
          });
        }
      }
    ],
    function (error, result) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, {
          opportunityData: opportunityData
        });
      }
    });
}

//Withdraw from a specific job via accesstoken
var withdrawJob = function (userData, payloadData, callbackRoute) {
  var opportunityData;
  async.series([
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = {
          lean: true
        };
        Service.UserService.getUser(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
            else cb()
          }
        });
      },

      function (cb) {
        var projection = {
          __v: 0,
          employerId: 0,
          password: 0,
          accessToken: 0,
          codeUpdatedAt: 0,
        };
        var options = {
          lean: true
        };
        Service.OpportunityService.getOpportunity({
          "_id": payloadData.opportunityId,
          "active": true
        }, projection, options, function (err, data) {
          if (err) {
            if (data == null || data.length == 0) {
              cb(ERROR.INVALID_OPPORTUNITY_ID)
            } else {
              cb(err);
            }

          } else {
            if (data == null || data.length == 0) {
              cb(ERROR.INVALID_OPPORTUNITY_ID)
            } else {
              cb()
            }
          }
        });
      },
      function (cb) {
        var projection = {
          __v: 0,
          accessToken: 0,
          codeUpdatedAt: 0
        };

        var options = {
          lean: true
        };
        Service.JobsAppliedService.getJobs({
          jobId: payloadData.opportunityId,
          candidateId: userData._id,
          active: true
        }, projection, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) {
              cb(ERROR.INVALID_JOB_DATA)
            } else {
              opportunityData = data && data[0] || null;
              cb();
            }
          }
        });
      },

      function (callback) {
        var date = new Date().toISOString();
        var dataToUpdate = {
          $set: {
            'active': false,
            'withdrawDate': date,
            'applicationStatus': "Application withdrawn by applicant"
          }
        };
        var condition = {
          _id: opportunityData._id,
          active: true
        };
        Service.JobsAppliedService.updateJobs(condition, dataToUpdate, {}, function (err, opportunity) {
          console.log("opportunityData-------->>>" + JSON.stringify(opportunity));
          if (err) {
            callback(err);
          } else {
            if (!opportunity || opportunity.length == 0) {
              callback(ERROR.NOT_FOUND);
            } else {
              callback(null);
            }
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    });
}



//Reject an applicant by opportunityId and candidateId via accesstoken
var rejectApplicant = function (userData, payloadData, callbackRoute) {
  var opportunityData;
  async.series([
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = {
          lean: true
        };
        Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
            else cb()
          }
        });
      },
      function (cb) {
        var projection = {
          __v: 0,
          password: 0,
          accessToken: 0,
          codeUpdatedAt: 0,
        };
        var options = {
          lean: true
        };
        Service.OpportunityService.getOpportunity({
          _id: payloadData.opportunityId,
          active: true,
          employerId : userData._id
        }, projection, options, function (err, data) {
          if (err) {
              cb(err);
          } else {
            if (data == null || data.length == 0) {
              cb(ERROR.INVALID_OPPORTUNITY_ID)
            } else {
              cb()
            }
          }
        });
      },
      function (cb) {
        var projection = {
          __v: 0,
          accessToken: 0,
          codeUpdatedAt: 0
        };

        var options = {
          lean: true
        };
        Service.JobsAppliedService.getJobs({
          jobId: payloadData.opportunityId,
          candidateId: payloadData.candidateId,
          active: true
        }, projection, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data == null || data.length == 0) {
              cb(ERROR.INVALID_JOB_DATA)
            } else {
              opportunityData = data && data[0] || null;
              cb();
            }
          }
        });
      },

      function (callback) {
        var dataToUpdate = {
          $set: {
            'active': false,
            'withdrawDate': null,
            'applicationStatus': "Unsuccessful Application"
          }
        };
        var condition = {
          _id: opportunityData._id,
          candidateId: payloadData.candidateId,
          active: true
        };  
        Service.JobsAppliedService.updateJobs(condition, dataToUpdate, {}, function (err, opportunity) {
          console.log("opportunityData-------->>>" + JSON.stringify(opportunity));
          if (err) {
            callback(err);
          } else {
            if (!opportunity || opportunity.length == 0) {
              callback(ERROR.NOT_FOUND);
            } else {
              callback(null);
            }
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    });
}





module.exports = {
  applyJob: applyJob,
  withdrawJob: withdrawJob,
  viewAppliedJobs: viewAppliedJobs,
  viewJobApplicants: viewJobApplicants,
  viewJobsPosted: viewJobsPosted,
  rejectApplicant : rejectApplicant
};
