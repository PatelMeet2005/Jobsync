const express = require('express');
const router = express.Router();
const {loginUser,logoutUser} = require('../Controllers/loginControllers');


router.post('/login',loginUser);

router.post('/logout', logoutUser);

module.exports = router;