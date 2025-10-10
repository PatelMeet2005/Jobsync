const express = require('express');
const router = express.Router();
const {createJob, fetchJobs, getMyJobs, updateJobStatus} = require('../Controllers/employeeJobController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/addjob', authMiddleware, createJob);
router.get('/fetchjobs', fetchJobs);
router.get('/myjobs', authMiddleware, getMyJobs);
router.put("/job/:jobId/status", updateJobStatus);

module.exports = router;
