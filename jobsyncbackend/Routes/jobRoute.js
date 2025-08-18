const express = require('express');
const router = express.Router();
const { addJob } = require('../Controllers/jobControllers');

router.post('/jobs', addJob);

module.exports = router;
