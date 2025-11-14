const Application = require('../Models/applicationModel');
const path = require('path');
const jwt = require('jsonwebtoken');
const EmployeeJob = require('../Models/employeeJobModel');
// ensure user models are registered
require('../Models/register');
require('../Models/employeeModel');

// POST /applications
const createApplication = async (req, res) => {
  try {
    const { jobId, name, email, message } = req.body;
    const resumeFile = req.file; // using multer

    if (!jobId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const resumePath = resumeFile ? `/uploads/${resumeFile.filename}` : undefined;

    // Try to extract applicant id from Authorization header if present
    let applicantId = undefined;
    let userName = name; // default to provided name
    try {
      const authHeader = req.header('Authorization') || req.header('authorization');
      console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
      const token = authHeader ? authHeader.replace('Bearer ', '') : null;
      if (token) {
        console.log('Token extracted, attempting to verify...');
        console.log('JWT_SECRET configured:', process.env.JWT_SECRET ? 'Yes' : 'No');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Token decoded successfully:', decoded);
        applicantId = decoded.id || decoded._id || decoded.userId || decoded.uid || undefined;
        console.log('Extracted applicant ID:', applicantId);
      } else {
        console.warn('No token provided in Authorization header');
      }
    } catch (err) {
      // invalid token: ignore and process as guest
      console.error('Error verifying token:', err.message);
      console.error('Token verification failed - proceeding as guest');
    }

    // Fetch job details to cache job title and company name
    let jobTitle = '';
    let companyName = '';
    try {
      const job = await EmployeeJob.findById(jobId).select('title company');
      if (job) {
        jobTitle = job.title || '';
        companyName = job.company?.name || job.company || '';
      }
    } catch (err) {
      console.warn('Could not fetch job details for caching', err.message);
    }

    if (!applicantId) {
      console.warn(`⚠️  WARNING: No applicant id extracted for application (jobId=${jobId}, email=${email}). Saving as guest.`);
      console.warn(`   This application will NOT be visible in user profile after logout/login!`);
      console.warn(`   User must be logged in with valid token to link application to their account.`);
    } else {
      console.log(`✅ Applicant ID extracted successfully: ${applicantId}`);
    }

    // Create application with all cached fields
    const application = new Application({ 
      jobId, 
      name, 
      email, 
      message, 
      resumePath, 
      applicant: applicantId,
      applicantId: applicantId ? String(applicantId) : undefined,
      userId: applicantId,
      userName: userName,
      jobTitle: jobTitle,
      companyName: companyName
    });
    
    await application.save();

    // Populate the saved application before sending response
    await application.populate([
      { path: 'jobId', select: 'title company postedBy' },
      { path: 'applicant', select: 'userFirstName userLastName userEmail' }
    ]);

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Error creating application', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// GET /applications - list applications for jobs posted by the authenticated employee
const getApplicationsForEmployee = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // find jobs posted by this employee
    const jobs = await EmployeeJob.find({ postedBy: userId }).select('_id title company');
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title company postedBy')
      // applicant might be from Register (user) or Employee model; populate common fields
      .populate('applicant', 'userFirstName userLastName userEmail employeename employeeemail')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error('Error fetching applications for employee', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// GET /applications/mine - list applications for the authenticated applicant
const getApplicationsForApplicant = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const jobId = req.query.jobId;
    const filter = { applicant: userId };
    if (jobId) filter.jobId = jobId;

    const applications = await Application.find(filter).populate('jobId', 'title postedBy');

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error('Error fetching applications for applicant', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Public endpoint: GET /applications/public?applicant=<id>&email=<email>
// Returns applications matching applicant id or email. This endpoint is intentionally
// limited and requires at least one query parameter to avoid leaking all applications.
const getApplicationsPublic = async (req, res) => {
  try {
    const { applicant, email } = req.query;
    console.log(`📥 Fetching applications - applicant: ${applicant}, email: ${email}`);
    
    if (!applicant && !email) {
      return res.status(400).json({ success: false, message: 'Missing query parameter: applicant or email required' });
    }

    const filter = {};
    // Support both applicant ObjectId and applicantId string for flexible querying
    if (applicant) {
      filter.$or = [
        { applicant: applicant },
        { applicantId: applicant }
      ];
    }
    if (email) {
      if (filter.$or) {
        filter.$or.push({ email });
      } else {
        filter.$or = [{ email }];
      }
    }

    console.log(`🔍 Query filter:`, JSON.stringify(filter));

    const applications = await Application.find(filter)
      .populate('jobId', 'title company postedBy')
      .populate('applicant', 'userFirstName userLastName userEmail employeename employeeemail')
      .sort({ createdAt: -1 }); // newest first

    console.log(`📊 Found ${applications.length} applications`);
    
    return res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error('Error in public applications endpoint', err.stack || err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// POST /applications/:id/respond - employee responds to an application
const respondToApplication = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const appId = req.params.id;
    const { message, status } = req.body;

    const application = await Application.findById(appId).populate('jobId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // ensure the employee owns the job
    if (!application.jobId || String(application.jobId.postedBy) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // If application already has a final status (accepted/rejected), prevent changing it
    const finalStates = ['accepted', 'rejected'];
    if (application.status && finalStates.includes(application.status)) {
      // If a client tries to change the status after final decision, block it
      if (status && status !== application.status) {
        return res.status(400).json({ success: false, message: `Application already ${application.status}. Status cannot be changed.` });
      }
    }

    // append response (always allowed)
    application.responses = application.responses || [];
    if (message && message.trim().length > 0) {
      application.responses.push({ sender: 'employee', message: message || '' });
    }

    // allow setting status only if not final yet
    if (status && ['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      if (!finalStates.includes(application.status)) {
        application.status = status;
      } else {
        // If it's already final and the same status is sent, ignore; different was handled above
      }
    }

    await application.save();

    res.status(200).json({ success: true, message: 'Response added', application });
  } catch (err) {
    console.error('Error responding to application', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

module.exports = { createApplication, getApplicationsForEmployee, getApplicationsForApplicant, getApplicationsPublic, respondToApplication };