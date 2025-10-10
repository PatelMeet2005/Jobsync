const EmployeeRegister = require("../Models/employeeModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const registerEmployee = async (req, res) => {
    try {
        const { employeename, employeeemail, employeepassword } = req.body;

        const existingEmployee = await EmployeeRegister.findOne({ employeeemail });

        if (existingEmployee) {
            return res.status(400).json({status : "error" , message : "Email already exist..."});
        }

        const hashedPassword = await bcrypt.hash(employeepassword, 10);
        const newEmployee = new EmployeeRegister({
            employeename,
            employeeemail,
            employeepassword: hashedPassword
        });
        await newEmployee.save();

        const token = jwt.sign({ id: newEmployee._id, role: newEmployee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ 
            message: "Employee registered successfully",
            token,
            employeename: newEmployee.employeename,
            employeeemail: newEmployee.employeeemail,
            role: newEmployee.role
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error",
            error: error.message
        });
    }
};

const loginEmployee = async (req, res) => {
    try {
        const { employeeemail, employeepassword } = req.body;
        const employee = await EmployeeRegister.findOne({ employeeemail });
        if (!employee) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(employeepassword, employee.employeepassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ 
            message: "Login successful", 
            token,
            employeename: employee.employeename,
            employeeemail: employee.employeeemail,
            role: employee.role 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeRegister.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await EmployeeRegister.findByIdAndDelete(id);
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerEmployee,
    loginEmployee,
    getAllEmployees,
    deleteEmployee
};
