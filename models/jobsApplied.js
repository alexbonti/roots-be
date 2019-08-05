var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB Schema for jobsApplied
var jobsApplied = new Schema({
  candidateId: { type: Schema.ObjectId, ref: "user" },  
  jobId: { type: Schema.ObjectId, ref: "opportunity" },
  appliedDate: { type: Date, default: Date.now },
  withdrawDate: {type: Date, default : Date.now},
  applicationStatus: { type: String, trim: true, required: true },
  active: {type : Boolean, default: true}
});

//Create a composite key of candidateId and jobId
jobsApplied.index({candidateId:1, jobId:1} ,{unique : true}); 
module.exports = mongoose.model('jobsApplied', jobsApplied);