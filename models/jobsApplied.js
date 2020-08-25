var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require("../config");

const JOB_STATUS = config.APP_CONSTANTS.JOB_APPLICATION.JOB_STATUS;

//DB Schema for jobsApplied
var jobsApplied = new Schema({
  candidateId: { type: Schema.ObjectId, ref: "user" },
  jobId: { type: Schema.ObjectId, ref: "opportunity" },
  appliedDate: { type: Date, default: Date.now() },
  withdrawDate: { type: Date, default: Date.now() },
  applicationStatus: {
    type: String, trim: true, required: true,
    enum: [
      JOB_STATUS.ACCEPTED,
      JOB_STATUS.VIEWED,
      JOB_STATUS.APPLIED,
      JOB_STATUS.DENIED,
      JOB_STATUS.PROCESSING,
      JOB_STATUS.WITHDRAWED
    ], default: JOB_STATUS.APPLIED
  },
  coverLetter: { type: String, trim: true },
  criteriaSelection: { type: String, trim: true },
  active: { type: Boolean, default: true }
});

//Create a composite key of candidateId and jobId
jobsApplied.index({ candidateId: 1, jobId: 1 }, { unique: true });
module.exports = mongoose.model('jobsApplied', jobsApplied);