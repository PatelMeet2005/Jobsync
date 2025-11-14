const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Job reference and cached details
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeJob', required: true },
  jobTitle: { type: String }, // cached job title for easy access
  companyName: { type: String }, // cached company name for easy access
  
  // Applicant basic info (always captured)
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String },
  resumePath: { type: String },
  
  // Applicant reference (if registered user)
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Register' },
  applicantId: { type: String }, // cached user ID string for easy filtering
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Register' }, // alias for applicant
  userName: { type: String }, // cached user full name
  
  // Response and status tracking
  responses: [
    {
      sender: { type: String, enum: ['employee', 'applicant'], required: true },
      message: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
applicationSchema.index({ applicantId: 1, email: 1, jobId: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);