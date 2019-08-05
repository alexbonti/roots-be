'use strict';

var Models = require('../models');

//Insert opportunity in DB
var createOpportunity = function (objToSave, callback) {
    new Models.Opportunities(objToSave).save(callback)
};

//Get opportunity from DB
var getOpportunity = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Opportunities.find(criteria, projection, options, callback);
};

//Update opportunity in DB
var updateOpportunity = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Opportunities.findOneAndUpdate(criteria, dataToSet, options, callback);
};

module.exports = {
    createOpportunity: createOpportunity,
    getOpportunity : getOpportunity,
    updateOpportunity : updateOpportunity
};