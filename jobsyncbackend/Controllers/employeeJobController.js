const Job = require("../Models/employeeJobModel");

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    const jobData = req.body;

    // Create a new job with user ID from JWT
    const job = new Job({
      ...jobData,
      postedBy: req.user.id, // Extract from JWT token
    });
    await job.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully and pending admin approval",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/jobs
const fetchJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/jobs/my
const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id; // or req.user.email
    const jobs = await Job.find({ postedBy: userId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createJob, fetchJobs, getMyJobs };
