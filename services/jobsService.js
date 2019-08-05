'use strict';

var Models = require('../models');

//Insert opportunity in DB
var applyJob = function (objToSave, callback) {
    new Models.JobsApplied(objToSave).save(callback)
};

//Get jobs applied from DB
var getJobs = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.JobsApplied.find(criteria, projection, options, callback);
};

//Update jobs applied in DB
var updateJobs = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.JobsApplied.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Get populated data from documents by reference
var getPopulatedJobs = function(
    criteria,
    projection,
    populate,
    sortOptions,
    setOptions,
    callback
  ) {
    console.log("dao........", criteria, projection, populate);
    Models.JobsApplied.find(criteria)
      .select(projection)
      .populate(populate)
      .sort(sortOptions)
      .exec(function(err, result) {
        callback(err, result);
      });
  };

module.exports = {
    applyJob: applyJob,
    getJobs: getJobs,
    updateJobs: updateJobs,
    getPopulatedJobs:getPopulatedJobs
};