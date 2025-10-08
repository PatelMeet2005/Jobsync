const mongoose = require('mongoose');

const employeeJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  salary: { type: Number, default: 0 },
  jobType: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  skills: [String],
  workMode: { type: String, default: 'On-site' },
  applicationDeadline: { type: Date },
  company: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    department: String,
    contactEmail: { type: String, required: true },
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('EmployeeJob', employeeJobSchema, 'EmployeeJob');
