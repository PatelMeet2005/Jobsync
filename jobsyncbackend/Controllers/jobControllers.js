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

module.exports = { addJob };
