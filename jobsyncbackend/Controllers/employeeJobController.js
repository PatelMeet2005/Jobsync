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

//get job by id
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('postedBy', 'employeename employeeemail');
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /employee/jobs/:jobId - Update job details
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const userId = req.user.id;
    const updateData = req.body;

    console.log('Updating job:', jobId);
    console.log('User ID:', userId);
    console.log('Update data:', updateData);

    // Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    console.log('Job found, posted by:', job.postedBy.toString());

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this job" });
    }

    // Update the job with new data
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...updateData },
      { new: true, runValidators: true }
    ).populate('postedBy', 'employeename employeeemail');

    console.log('Job updated successfully');
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createJob, fetchJobs, getMyJobs, updateJobStatus, getJobById, updateJob };
