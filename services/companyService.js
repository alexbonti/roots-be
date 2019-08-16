'use strict';

 var Models = require('../models');
 
 //Insert company in DB
 var createCompany = function (objToSave, callback) {
     new Models.Company(objToSave).save(callback)
 };
 
 //Get Company from DB
 var getCompany = function (criteria, projection, options, callback) {
     options.lean = true;
     Models.Company.find(criteria, projection, options, callback);
 };
 
 //Update Company in DB
 var updateCompany = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Company.findOneAndUpdate(criteria, dataToSet, options, callback);
};

module.exports = {
    updateCompany: updateCompany,
    createCompany: createCompany,
    getCompany: getCompany
};