var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Config = require('../config');

var userExtended = new Schema({
    userId : { type: Schema.ObjectId, ref: "user" }, 
    savedJobs : [{ type: Schema.ObjectId, ref: "opportunity" }],
    volunteer : [
        {
            volunteerTitle: {type: String, trim: true},
            companyName: {type: String, trim: true},
            startDate : {type: Date},
            endDate : {type: Date},
            description: {type: String, trim: true} 
        }
    ],
    workExperience: [
        {
            positionTitle: {type: String, trim: true},
            companyName: {type: String, trim: true},
            startDate : {type: Date},
            endDate : {type: Date},
            description: {type: String, trim: true}
        }
    ],
    education : [
        {
            school: {type: String, trim: true},
            major: {type: String, trim: true},
            degree: {type: String, trim: true},
            startDate : {type: Date},
            endDate : {type: Date},
        }
    ]
});

module.exports = mongoose.model('userExtended', userExtended);