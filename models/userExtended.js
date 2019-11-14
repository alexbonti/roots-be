var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Config = require('../config');

var userExtended = new Schema({
    userId: { type: Schema.ObjectId, ref: "user" },
    avatar: { type: String, trim: true },
    savedJobs: [{ type: Schema.ObjectId, ref: "opportunity" }],
    resumeURL: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    preferredLocation: { type: String, trim: true },
    skills: [
        { type: String, trim: true },
    ],
    preferredIndustry: [],
    volunteer: [
        {
            volunteerTitle: { type: String, trim: true },
            companyName: { type: String, trim: true },
            startDate: { type: Date },
            endDate: { type: Date },
            description: { type: String, trim: true }
        }
    ],
    workExperience: [
        {
            positionTitle: { type: String, trim: true },
            companyName: { type: String, trim: true },
            startDate: { type: Date },
            endDate: { type: Date },
            description: { type: String, trim: true }
        }
    ],
    education: [
        {
            school: { type: String, trim: true },
            major: { type: String, trim: true },
            degree: { type: String, trim: true },
            startDate: { type: Date },
            endDate: { type: Date },
        }
    ]
});

module.exports = mongoose.model('userExtended', userExtended);