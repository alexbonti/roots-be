'use strict';

var Models = require('../models');

//Insert opportunity in DB
var createOpportunityDraft = function (objToSave, callback) {
    new Models.OpportunityDraft(objToSave).save(callback)
};

//Get opportunity from DB
var getOpportunityDraft = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.OpportunityDraft.find(criteria, projection, options, callback);
};

//Update opportunity in DB
var updateOpportunityDraft = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.OpportunityDraft.findOneAndUpdate(criteria, dataToSet, options, callback);
};

module.exports = {
    createOpportunityDraft: createOpportunityDraft,
    getOpportunityDraft : getOpportunityDraft,
    updateOpportunityDraft : updateOpportunityDraft
};