const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createApplication, getApplicationsForEmployee, respondToApplication } = require('../Controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Setup multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('resume'), createApplication);

// Employee routes
router.get('/', authMiddleware, getApplicationsForEmployee);
// Applicant route - fetch applications submitted by the authenticated applicant
router.get('/mine', authMiddleware, (req, res, next) => {
  // delegate to controller
  return require('../Controllers/applicationController').getApplicationsForApplicant(req, res, next);
});
// Public endpoint to allow clients to fetch applications by applicant id or email without full auth.
router.get('/public', (req, res, next) => {
  return require('../Controllers/applicationController').getApplicationsPublic(req, res, next);
});
router.post('/:id/respond', authMiddleware, respondToApplication);

module.exports = router;