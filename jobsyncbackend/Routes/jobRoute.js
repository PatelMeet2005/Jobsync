const express = require('express');
const router = express.Router();
const { addJob, getJobs, deleteJob, getJobById } = require('../Controllers/jobControllers');

router.post('/addJob', addJob);
router.get('/getJobs', getJobs);
router.delete('/deleteJob/:jobId', deleteJob);
router.get('/getJob/:jobId', getJobById);

module.exports = router;
