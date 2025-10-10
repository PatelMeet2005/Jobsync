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
    const jobs = await Job.find().populate('postedBy', 'employeename employeeemail');
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update job status (Accept / Reject)
const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body; // expect "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });

    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({
      success: true,
      message: `Job ${status} successfully`,
      job,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status", error: err.message });
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

module.exports = { createJob, fetchJobs, getMyJobs, updateJobStatus };
