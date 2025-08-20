const express = require('express');
const router = express.Router();
const { addJob, getJobs, deleteJob } = require('../Controllers/jobControllers');

router.post('/addJob', addJob);
router.get('/getJobs', getJobs);
router.delete('/deleteJob/:jobId', deleteJob);

module.exports = router;
