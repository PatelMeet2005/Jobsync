const express = require('express');
const router = express.Router();
const loginUser = require('../Controllers/loginControllers');

router.post('/login',loginUser);

module.exports = router;