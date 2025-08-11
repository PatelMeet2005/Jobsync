const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getAllUsers, deleteUser } = require("../Controllers/authControllers");

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/getallusers', getAllUsers);
router.delete('/deleteuser/:id', deleteUser);


module.exports = router;