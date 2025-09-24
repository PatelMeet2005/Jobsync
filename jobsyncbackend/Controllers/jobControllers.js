const Job = require('../Models/jobModel');

const addJob = async (req, res) => {
    const {
        jobTitle,
        jobCompany,
        jobLocation,
        jobSalary,
        jobType,
        jobExperience,
        jobDescription,
        jobRequirements,
        jobBenefits,
        jobContactEmail,
        jobApplicationDeadline,
        jobDepartment,
        jobSkills
    } = req.body;

    try {
        const newJob = new Job({
            jobTitle,
            jobCompany,
            jobLocation,
            jobSalary,
            jobType,
            jobExperience,
            jobDescription,
            jobRequirements,
            jobBenefits,
            jobContactEmail,
            jobApplicationDeadline,
            jobDepartment,
            jobSkills
        });

        await newJob.save();
        res.status(201).json({ message: 'Job added successfully', job: newJob });
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).json({ message: 'Error adding job', error });
    }
}

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

//get job by specific id
const getJobById = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ job });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job', error });
    }
}

const deleteJob = async (req,res) => {
    const { jobId } = req.params;

    try {
        await Job.findByIdAndDelete(jobId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job', error });
    }
}

module.exports = { addJob, getJobs, deleteJob, getJobById };
