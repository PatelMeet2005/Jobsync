const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeename: { type: String, required: true },
  employeeemail: { type: String, required: true, unique: true },
  employeepassword: { type: String, required: true },
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
}, {
  timestamps: true
});

module.exports = mongoose.model("Employee", employeeSchema, "Employee");