const express = require('express');
const router = express.Router();
const {createJob, fetchJobs} = require('../Controllers/employeeJobController');

// Routes
router.post('/addjob', createJob);
router.get('/fetchjobs', fetchJobs);

module.exports = router;
