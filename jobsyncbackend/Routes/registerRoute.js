const express = require("express");
const router = require("Router");
const registerUser = require("../Controllers/registerControllers");

router.post('/register',registerUser);

module.exports = router;