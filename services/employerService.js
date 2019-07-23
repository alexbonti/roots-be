 'use strict';

 var Models = require('../models');
 
 
 var updateEmployer = function (criteria, dataToSet, options, callback) {
     options.lean = true;
     options.new = true;
     Models.Employer.findOneAndUpdate(criteria, dataToSet, options, callback);
 };
 //Insert Employer in DB
 var createEmployer = function (objToSave, callback) {
     new Models.Employer(objToSave).save(callback)
 };
 //Delete Employer in DB
 var deleteEmployer = function (criteria, callback) {
     Models.Employer.findOneAndRemove(criteria, callback);
 };
 
 //Get Employers from DB
 var getEmployer = function (criteria, projection, options, callback) {
     options.lean = true;
     Models.Employer.find(criteria, projection, options, callback);
 };
 
 var getEmployerPromise = function (criteria, projection, options) {
     options.lean = true;
     return new Promise((resolve, reject) => {
         Models.Employer.find(criteria, projection, options, function (err, data) {
             if (err) reject(err)
             else resolve(data)
         });
 
     })
 };
 
 var getAllGeneratedCodes = function (callback) {
     var criteria = {
         OTPCode: { $ne: null }
     };
     var projection = {
         OTPCode: 1
     };
     var options = {
         lean: true
     };
     Models.Employer.find(criteria, projection, options, function (err, dataAry) {
         if (err) {
             callback(err)
         } else {
             var generatedCodes = [];
             if (dataAry && dataAry.length > 0) {
                 dataAry.forEach(function (obj) {
                     generatedCodes.push(obj.OTPCode.toString())
                 });
             }
             callback(null, generatedCodes);
         }
     })
 };
 
 module.exports = {
     updateEmployer: updateEmployer,
     createEmployer: createEmployer,
     deleteEmployer: deleteEmployer,
     getEmployer: getEmployer,
     getAllGeneratedCodes: getAllGeneratedCodes,
     getEmployerPromise: getEmployerPromise
 };