const express = require("express");
const router = express.Router();
const registerUser = require("../Controllers/registerControllers.js");

router.post('/register',registerUser);

module.exports = router;