const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    jobCompany: { type: String, required: true },
    jobLocation: { type: String, required: true },
    jobSalary: { type: Number, required: true },
    jobType: { type: String, required: true },
    jobExperience: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobRequirements: { type: [String], required: true },
    jobBenefits: { type: [String], required: true },
    jobContactEmail: { type: String, required: true },
    jobApplicationDeadline: { type: Date, required: true },
    jobDepartment: { type: String, required: true },
    jobSkills: { type: [String], required: true }
},{
    timestamps: true
});

module.exports = mongoose.model('Job', JobSchema, 'Job');
