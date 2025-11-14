const express = require('express');
const router = express.Router();
const {createJob, fetchJobs, getMyJobs, updateJobStatus, getJobById, updateJob} = require('../Controllers/employeeJobController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/addjob', authMiddleware, createJob);
router.get('/fetchjobs', fetchJobs);
router.get('/myjobs', authMiddleware, getMyJobs);
router.get('/job/:jobId', getJobById);
router.put("/job/:jobId/status", updateJobStatus);
router.put('/jobs/:jobId', authMiddleware, updateJob);

module.exports = router;
