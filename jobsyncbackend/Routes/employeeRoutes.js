const express = require("express");
const router = express.Router();
const { registerEmployee, loginEmployee, getAllEmployees, deleteEmployee } = require("../Controllers/employeeController");

router.post('/register', registerEmployee);
router.post('/login', loginEmployee);  
router.get('/all', getAllEmployees); 
router.delete('/delete/:id', deleteEmployee);

module.exports = router;