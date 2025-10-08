const express = require('express');
const router = express.Router();
const {createJob, fetchJobs, getMyJobs} = require('../Controllers/employeeJobController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/addjob', authMiddleware, createJob);
router.get('/fetchjobs', fetchJobs);
router.get('/myjobs', authMiddleware, getMyJobs);

module.exports = router;
