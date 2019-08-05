 var Service = require('../../services');
 var UniversalFunctions = require('../../utils/UniversalFunctions');
 var async = require('async');
 var TokenManager = require('../../lib/TokenManager');
 var CodeGenerator = require('../../lib/CodeGenerator');
 var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
 var _ = require('underscore');
 
 //create/register as a new employer
 var createEmployer = function (payloadData, callback) {
   console.log('payload:', payloadData);
   var accessToken = null;
   var uniqueCode = null;
   var dataToSave = payloadData;
   console.log('payload Data:', payloadData);
   if (dataToSave.password)
     dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
   var customerData = null;
   var dataToUpdate = {};
   var appVersion = null;
   async.series([
     function (cb) {       
         var query = {
           emailId: payloadData.emailId
         };
         Service.EmployerService.getEmployer(query, {}, { lean: true }, function (error, data) {
           if (error) {
             cb(error);
           } else {
             if (data && data.length > 0) {
               if (data[0].emailVerified == true) {
                 cb(ERROR.USER_ALREADY_REGISTERED)
               }
               else {
                 Service.EmployerService.deleteEmployer({ _id: data[0]._id }, function (err, updatedData) {
                   if (err) cb(err)
                   else cb(null);
                 })
               }
             } else {
               cb(null);
             }
           }
         });
     },
     function (cb) {
       CodeGenerator.generateUniqueCode(6, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER, function (err, numberObj) {
         if (err) {
           cb(err);
         } else {
           if (!numberObj || numberObj.number == null) {
             cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
           } else {
             uniqueCode = numberObj.number;
             cb();
           }
         }
       })
     },
     function (cb) {
       //Insert Into DB
       dataToSave.OTPCode = uniqueCode;
       dataToSave.registrationDate = new Date().toISOString();
       Service.EmployerService.createEmployer(dataToSave, function (err, customerDataFromDB) {
         console.log('hello', err, customerDataFromDB)
         if (err) {
           if (err.code == 11000 && err.message.indexOf('emailId_1') > -1) {
             cb(ERROR.PHONE_NO_EXIST);
 
           }
           else {
             cb(err)
           }
         } else {
           customerData = customerDataFromDB;
           cb();
         }
       })
     },

     function (cb) {
       //Set Access Token
       if (customerData) {
         var tokenData = {
           id: customerData._id,
           type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER
         };
         TokenManager.setToken(tokenData, function (err, output) {
           if (err) {
             cb(err);
           } else {
             accessToken = output && output.accessToken || null;
             cb();
           }
         })
       } else {
         cb(ERROR.IMP_ERROR)
       }
     }
   ], function (err, data) {
     if (err) {
       return callback(err);
     } else {
       return callback(null, {
         accessToken: accessToken,
         otpCode: customerData.OTPCode,
         employerDetails: UniversalFunctions.deleteUnnecessaryUserData(customerData)
       });
     }
   });
 };
 
 //verifies OTP for email verification
 var verifyOTP = function (employerData, payloadData, callback) {
   var customerData;
   async.series([
     function (cb) {
       var query = {
         _id: employerData._id
       };
       var options = { lean: true };
       Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
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
       //Check verification code :
       if (payloadData.OTPCode == customerData.OTPCode) {
         cb();
       } else {
         cb(ERROR.INVALID_CODE)
       }
     },
     function (cb) {
       //trying to update customer
       var criteria = {
         _id: employerData._id,
         OTPCode: payloadData.OTPCode
       };
       var setQuery = {
         $set: { emailVerified: true },
         $unset: { OTPCode: 1 }
       };
       var options = { new: true };
       console.log('updating>>>', criteria, setQuery, options)
       Service.EmployerService.updateEmployer(criteria, setQuery, options, function (err, updatedData) {
         console.log('verify otp callback result', err, updatedData)
         if (err) {
           cb(err)
         } else {
           if (!updatedData) {
             cb(ERROR.INVALID_CODE)
           } else {
             cb();
           }
         }
       });
     }
   ], function (err, result) {
     if (err) {
       return callback(err)
     } else {
       return callback();
     }
 
   });
 }
 
 //Login Employer
 var loginEmployer = function (payloadData, callback) {
   var employerFound = false;
   var accessToken = null;
   var successLogin = false;
   var updatedEmployerDetails = null;
   var appVersion = null;
   async.series([
     function (cb) {
       var criteria = {
         emailId: payloadData.emailId
       };
       //var projection = {
       //    paymentCard: {$elemMatch: {isDefault: true}}
       //};
       var option = {
         lean: true
       };
       Service.EmployerService.getEmployer(criteria, {}, option, function (err, result) {
         if (err) {
           cb(err)
         } else {
           employerFound = result && result[0] || null;
           cb();
         }
       });
 
     },
     function (cb) {
       //validations
       if (!employerFound) {
         cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_FOUND);
       } else {
         if (employerFound && employerFound.password != UniversalFunctions.CryptData(payloadData.password)) {
           cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
         } else if (employerFound.emailVerified == false) {
 
           cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NOT_REGISTERED);
 
         }
         else {
           successLogin = true;
           cb();
         }
       }
     },
     function (cb) {
       var criteria = {
         _id: employerFound._id
       };
       var setQuery = {
         deviceToken: payloadData.deviceToken,
         deviceType: payloadData.deviceType
       };
       Service.EmployerService.updateEmployer(criteria, setQuery, { new: true }, function (err, data) {
         updatedEmployerDetails = data;
         cb(err, data);
       });
 
     },
     function (cb) {
       var criteria = {
         emailId: payloadData.emailId
 
       };
       var projection = {
         _id: 1,
         deviceToken: 1,
         deviceType: 1,
         countryCode: 1,
         emailId: 1,
         first_name: 1,
         last_name: 1,
         emailVerified: 1
       };
       var option = {
         lean: true
       };
       Service.EmployerService.getEmployer(criteria, projection, option, function (err, result) {
         if (err) {
           cb(err)
         } else {
           employerFound = result && result[0] || null;
           cb();
         }
       });
     },
     function (cb) {
       if (successLogin) {
         var tokenData = {
           id: employerFound._id,
           type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER,
         };
         TokenManager.setToken(tokenData, function (err, output) {
           if (err) {
             cb(err);
           } else {
             if (output && output.accessToken) {
               accessToken = output && output.accessToken;
               cb();
             } else {
               cb(ERROR.IMP_ERROR)
             }
           }
         })
       } else {
         cb(ERROR.IMP_ERROR)
       }
 
     }
   ], function (err, data) {
     if (err) {
       return callback(err);
     } else {
       return callback(null, {
         accessToken: accessToken,
         employerDetails: UniversalFunctions.deleteUnnecessaryUserData(employerFound),
       });
     }
   });
 };
 
 //Resends the OTP
 var resendOTP = function (employerData, callback) {
   /*
    Create a Unique 4 digit code
    Insert It Into Customer DB
    Send the 4 digit code via SMS
    Send Back Response
    */
   var uniqueCode = null;
   var customerData;
   async.series([
     function (cb) {
       var query = {
         _id: employerData._id
       };
       var options = { lean: true };
       Service.EmployerService.getEmployer(query, {}, options, function (err, data) {
         if (err) {
           cb(err);
         } else {
           if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
           else {
             customerData = data && data[0] || null;
             if (customerData.emailVerified == true) {
               cb(ERROR.PHONE_VERIFICATION_COMPLETE);
             } else {
               cb();
             }
           }
         }
       });
     },
     function (cb) {
       CodeGenerator.generateUniqueCode(6, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER, function (err, numberObj) {
         if (err) {
           cb(err);
         } else {
           if (!numberObj || numberObj.number == null) {
             cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
           } else {
             uniqueCode = numberObj.number;
             cb();
           }
         }
       })
     },
     function (cb) {
       var criteria = {
         _id: employerData._id
       };
       var setQuery = {
         $set: {
           OTPCode: uniqueCode,
           codeUpdatedAt: new Date().toISOString()
         }
       };
       var options = {
         lean: true
       };
       Service.EmployerService.updateEmployer(criteria, setQuery, options, cb);
     }
   ], function (err, result) {
     return callback(err, { OTPCode: uniqueCode });
   })
 };
 
 //Request OTP
 var getOTP = function (payloadData, callback) {
   var query = {
     emailId: payloadData.emailId
   };
   var projection = {
     _id: 0,
     OTPCode: 1
   };
   var options = { lean: true };
   Service.CustomerService.getCustomer(query, projection, options, function (err, data) {
     if (err) {
       return callback(err);
     } else {
       var customerData = data && data[0] || null;
       console.log("customerData-------->>>" + JSON.stringify(customerData))
       if (customerData == null || customerData.OTPCode == undefined) {
         return callback(ERROR.OTP_CODE_NOT_FOUND);
       } else {
         return callback(null, customerData);
       }
     }
   });
 };
 
 //Login via accessToken
 var accessTokenLogin = function (employerData, callback) {
   var appVersion;
   var employerdata = {};
   var employerFound = null;
   async.series([
     function (cb) {
       var criteria = {
         _id: employerData._id
       }
       Service.EmployerService.getEmployer(criteria, {}, {}, function (err, data) {
         if (err) cb(err)
         else {
           if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
           else {
             cb()
           }
         }
 
       })
     },
     function (cb) {
       var criteria = {
         _id: employerData._id,
 
       };
       var projection = {
         _id: 1,
         deviceToken: 1,
         deviceType: 1,
         countryCode: 1,
         emailId: 1,
         first_name: 1,
         last_name: 1,
         emailVerified: 1
       };
       var option = {
         lean: true
       };
       Service.EmployerService.getEmployer(criteria, projection, option, function (err, result) {
         if (err) {
           cb(err)
         } else {
           employerFound = result && result[0] || null;
           cb();
         }
       });
     }], function (err, employer) {
       if (!err) return callback(null, {
         accessToken: employerdata.accessToken,
         employerDetails: UniversalFunctions.deleteUnnecessaryUserData(employerFound),
       });
       else return callback(err);
 
     });
 }
 
 //Logout
 var logoutCustomer = function (employerData, callbackRoute) {
   console.log(employerData)
   async.series([
     function (cb) {
       var criteria = {
         _id: employerData._id
       }
       Service.EmployerService.getEmployer(criteria, {}, {}, function (err, data) {
         if (err) cb(err)
         else {
           console.log(data)
           if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
           else {
             cb()
           }
         }
 
       })
     },
     function (callback) {
       var condition = { _id: employerData._id };
       var dataToUpdate = { $unset: { accessToken: 1 } };
       Service.EmployerService.updateEmployer(condition, dataToUpdate, {}, function (err, result) {
         if (err) {
           callback(err);
         } else {
           console.log("------update customer -----logout -callback----->" + JSON.stringify(result))
           callback();
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
 };
 
 //Get profile information via accesstoken
 var getProfile = function (employerData, callback) {
   var customerData;
   async.series([
     function (cb) {
       var query = {
         _id: employerData._id
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
     }
 
   ], function (err, result) {
     if (err) return callback(err)
     else return callback(null, { customerData: customerData })
   })
 }
 
 //change password via old password and accessToken
 var changePassword = function (employerData, payloadData, callbackRoute) {
   var oldPassword = UniversalFunctions.CryptData(payloadData.oldPassword);
   var newPassword = UniversalFunctions.CryptData(payloadData.newPassword);
   async.series([
     function (cb) {
       var query = {
         _id: employerData._id
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
     function (callback) {
       var query = {
         _id: employerData._id
       };
       var projection = {
         password: 1
       };
       var options = { lean: true };
       Service.EmployerService.getEmployer(query, projection, options, function (err, data) {
         if (err) {
           callback(err);
         } else {
           var customerData = data && data[0] || null;
           console.log("customerData-------->>>" + JSON.stringify(customerData))
           if (customerData == null) {
             callback(ERROR.NOT_FOUND);
           } else {
             if (data[0].password == oldPassword && data[0].password != newPassword) {
               callback(null);
             }
             else if (data[0].password != oldPassword) {
               callback(ERROR.WRONG_PASSWORD)
             }
             else if (data[0].password == newPassword) {
               callback(ERROR.NOT_UPDATE)
             }
           }
         }
       });
     },
     function (callback) {
       var dataToUpdate = { $set: { 'password': newPassword } };
       var condition = { _id: employerData._id };
       Service.EmployerService.updateEmployer(condition, dataToUpdate, {}, function (err, employer) {
         console.log("customerData-------->>>" + JSON.stringify(employer));
         if (err) {
           callback(err);
         } else {
           if (!employer || employer.length == 0) {
             callback(ERROR.NOT_FOUND);
           }
           else {
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
 
 //Reset password via phonenumber
 var forgetPassword = function (payloadData, callback) {
   var dataFound = null;
   var code;
   var forgotDataEntry;
   async.series([
     function (cb) {
       var query = {
         emailId: payloadData.emailId
       };
       Service.EmployerService.getEmployer(query, {
         _id: 1,
         emailId: 1,
         emailVerified: 1,
         countryCode: 1
       }, {}, function (err, data) {
         if (err) {
           cb(ERROR.PASSWORD_CHANGE_REQUEST_INVALID);
         } else {
           dataFound = data && data[0] || null;
           if (dataFound == null) {
             cb(ERROR.USER_NOT_REGISTERED);
           } else {
             if (dataFound.emailVerified == false) {
               cb(ERROR.PHONE_VERIFICATION);
             } else {
               cb();
             }
 
           }
         }
       });
     },
     function (cb) {
       CodeGenerator.generateUniqueCode(6, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER, function (err, numberObj) {
         if (err) {
           cb(err);
         } else {
           if (!numberObj || numberObj.number == null) {
             cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
           } else {
             code = numberObj.number;
             cb();
           }
         }
       })
     },
     function (cb) {
       var dataToUpdate = {
         code: code
       };
       var query = {
         _id: dataFound._id
       };
       Service.EmployerService.updateEmployer(query, dataToUpdate, {}, function (err, data) {
         if (err) {
           cb(err);
         } else {
           cb();
         }
       });
     },
     function (cb) {
       console.log("code------>>" + code)
       Service.ForgetPasswordService.getForgetPasswordRequest({ customerID: dataFound._id }, {
         _id: 1,
         isChanged: 1
       }, { lean: 1 }, function (err, data) {
         if (err) {
           cb(err);
         } else {
           forgotDataEntry = data && data[0] || null;
           console.log("@@@@@@@@@@@@@@@@@@@@@@@@", forgotDataEntry)
           cb();
         }
       });
 
     },
     function (cb) {
       var data = {
         customerID: dataFound._id,
         requestedAt: Date.now(),
         employerType: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EMPLOYER
       };
       if (forgotDataEntry == null) {
         Service.ForgetPasswordService.createForgetPasswordRequest(data, function (err, data) {
           if (err) {
             cb(err);
           } else {
             console.log("<<<<<<<<<<<<<< created successfully");
             cb();
           }
         });
       } else {
         if (forgotDataEntry.isChanged == true) {
           data.isChanged = false;
         }
 
         Service.ForgetPasswordService.updateForgetPasswordRequest({ _id: forgotDataEntry._id }, data, {}, cb);
       }
     }
   ],
     function (error, result) {
       if (error) {
         return callback(error);
       } else {
         return callback(null, { emailId: payloadData.emailId, OTPCode: code });
       }
     });
 }
 
 //Reset password verification
 var resetPassword = function (payloadData, callbackRoute) {
   console.log("hello")
   var foundData;
   var customerId = null;
   var data;
   async.series([
     function (callback) {
       var query = {
         emailId: payloadData.emailId
       };
       Service.EmployerService.getEmployer(query, {
         _id: 1,
         code: 1,
         emailVerified: 1
       }, { lean: true }, function (err, result) {
         console.log("@@@@@@@@@@", err, result)
         if (err) {
           callback(err);
         } else {
           data = result && result[0] || null;
           if (data == null) {
             callback(ERROR.INCORRECT_ID);
           } else {
             if (payloadData.OTPCode != data.code) {
               callback(ERROR.INVALID_CODE);
             } else {
               if (data.emailVerified == false) {
                 callback(ERROR.NOT_VERFIFIED);
               } else {
                 customerId = data._id;
                 console.log("id-----" + customerId);
                 callback();
               }
             }
           }
         }
       });
     },
     function (callback) {
       var query = { customerID: customerId, isChanged: false };
       Service.ForgetPasswordService.getForgetPasswordRequest(query, { __v: 0 }, {
         limit: 1,
         lean: true
       }, function (err, data) {
         if (err) {
           callback(err);
         } else {
           foundData = data && data[0] || null;
           console.log("foundData------" + JSON.stringify(foundData))
           callback();
         }
       });
     },
     function (callback) {
       if (!UniversalFunctions.isEmpty(foundData)) {
         var minutes = UniversalFunctions.getRange(foundData.requestedAt, UniversalFunctions.getTimestamp(), UniversalFunctions.CONFIG.APP_CONSTANTS.TIME_UNITS.MINUTES);
         if (minutes < 0 || minutes > 24) {
           return callback(ERROR.PASSWORD_CHANGE_REQUEST_EXPIRE);
         } else {
           callback();
         }
       }
       else {
         console.log("-----empty founddata----")
         return callback(ERROR.PASSWORD_CHANGE_REQUEST_INVALID);
       }
     },
     function (callback) {
       var dataToUpdate = { password: UniversalFunctions.CryptData(payloadData.password) };
       console.log(dataToUpdate)
       Service.EmployerService.updateEmployer({ _id: customerId }, dataToUpdate, {}, function (error, result) {
         if (error) {
           callback(error);
         } else {
           if (result.n === 0) {
             callback(ERROR.USER_NOT_FOUND);
           } else {
             console.log("-------update pwd-----")
             callback();
           }
         }
       });
     },
     function (callback) {
       var dataToUpdate = {
         isChanged: true,
         changedAt: UniversalFunctions.getTimestamp()
       };
       console.log("------update forget collection----")
       Service.ForgetPasswordService.updateForgetPasswordRequest({ customerID: customerId }, dataToUpdate, {
         lean: true
       }, callback);
     }
   ], function (error) {
     if (error) {
       return callbackRoute(error);
     } else {
       return callbackRoute(null);
     }
   })
 }
 
 module.exports = {
   createEmployer: createEmployer,
   verifyOTP: verifyOTP,
   loginEmployer: loginEmployer,
   resendOTP: resendOTP,
   getOTP: getOTP,
   accessTokenLogin: accessTokenLogin,
   logoutCustomer: logoutCustomer,
   getProfile: getProfile,
   changePassword: changePassword,
   forgetPassword: forgetPassword,
   resetPassword: resetPassword
 };