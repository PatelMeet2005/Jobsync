import React, { useState } from 'react';
import axios from 'axios';
import './AdminJob.css';
import { useFormik } from 'formik';

const AdminJob = () => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // const [formData, setFormData] = useState({
  //   title: '',
  //   company: '',
  //   location: '',
  //   salary: '',
  //   jobType: 'Full-time',
  //   experience: '',
  //   description: '',
  //   requirements: '',
  //   benefits: '',
  //   contactEmail: '',
  //   applicationDeadline: '',
  //   department: '',
  //   skills: ''
  // });

  

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage({ type: '', text: '' });

  //   try {
  //     // Prepare the data for submission
  //     const jobData = {
  //       ...formData,
  //       skills: formData.skills.split(',').map(skill => skill.trim()),
  //       requirements: formData.requirements.split('\n').filter(req => req.trim()),
  //       benefits: formData.benefits.split('\n').filter(benefit => benefit.trim()),
  //       salary: parseFloat(formData.salary) || 0,
  //       postedBy: 'admin',
  //       postedDate: new Date().toISOString(),
  //       status: 'active'
  //     };

  //     const response = await axios.post('http://localhost:8000/admin/jobs', jobData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  //       }
  //     });

  //     if (response.data.status === 'success') {
  //       setMessage({ type: 'success', text: 'Job posted successfully!' });
  //       // Reset form
  //       setFormData({
  //         title: '',
  //         company: '',
  //         location: '',
  //         salary: '',
  //         jobType: 'Full-time',
  //         experience: '',
  //         description: '',
  //         requirements: '',
  //         benefits: '',
  //         contactEmail: '',
  //         applicationDeadline: '',
  //         department: '',
  //         skills: ''
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error posting job:', error);
  //     setMessage({ 
  //       type: 'error', 
  //       text: error.response?.data?.message || 'Failed to post job. Please try again.' 
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formik = useFormik({
    initialValues:{
      title: '',
      company: '',
      location: '',
      salary: '',
      jobType: 'Full-time',
      experience: '',
      description: '',
      requirements: '',
      benefits: '',
      contactEmail: '',
      applicationDeadline: '',
      department: '',
      skills: ''
    },

    onSubmit: async (values , { setSubmitting }) => {
      await saveJobData(values);
      setSubmitting(false);
      // console.log('Form values:', values);
    }
  });

  const saveJobData = async (values) => {
    const data = {
      jobTitle: values.title,
      jobCompany: values.company,
      jobLocation: values.location,
      jobSalary: values.salary,
      jobType: values.jobType,
      jobExperience: values.experience,
      jobDescription: values.description,
      jobRequirements: values.requirements,
      jobBenefits: values.benefits,
      jobContactEmail: values.contactEmail,
      jobApplicationDeadline: values.applicationDeadline,
      jobDepartment: values.department,
      jobSkills: values.skills
    }

    console.log("sending job data:", data);

    try {
      const response = await axios.post("http://localhost:8000/admin/jobs", data);
      console.log("Job data saved successfully:", response.data);
      formik.resetForm();

    } catch (error) {
      console.error("Error saving job data:", error);
    }

  }

  return (
    <div className="admin-job-container">
      <div className="admin-job-header">
        <h1>Add New Job</h1>
        <p>Post a new job opportunity to the JobSync platform</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="admin-job-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
              required
              placeholder="e.g. Tech Solutions Inc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              required
              placeholder="e.g. New York, NY or Remote"
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary (Annual) *</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              required
              placeholder="e.g. 75000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Job Type *</label>
            <select
              id="jobType"
              name="jobType"
              value={formik.values.jobType}
              onChange={formik.handleChange}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience Level *</label>
            <select
              id="experience"
              name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange}
              required
            >
              <option value="">Select experience level</option>
              <option value="Entry Level">Entry Level (0-2 years)</option>
              <option value="Mid Level">Mid Level (2-5 years)</option>
              <option value="Senior Level">Senior Level (5-8 years)</option>
              <option value="Lead Level">Lead Level (8+ years)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              placeholder="e.g. Engineering, Marketing, Sales"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formik.values.contactEmail}
              onChange={formik.handleChange}
              required
              placeholder="e.g. hr@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicationDeadline">Application Deadline</label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formik.values.applicationDeadline}
              onChange={formik.handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="skills">Required Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formik.values.skills}
              onChange={formik.handleChange}
              placeholder="e.g. React, Node.js, JavaScript, MongoDB"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            required
            rows="6"
            placeholder="Provide a detailed description of the job role, responsibilities, and what the candidate will be doing..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements (one per line)</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formik.values.requirements}
            onChange={formik.handleChange}
            rows="5"
            placeholder="Bachelor's degree in Computer Science
3+ years of React experience
Strong problem-solving skills
Experience with REST APIs"
          />
        </div>

        <div className="form-group">
          <label htmlFor="benefits">Benefits & Perks (one per line)</label>
          <textarea
            id="benefits"
            name="benefits"
            value={formik.values.benefits}
            onChange={formik.handleChange}
            rows="4"
            placeholder="Health insurance
401(k) matching
Flexible work hours
Remote work options"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => {
              setFormData({
                title: '',
                company: '',
                location: '',
                salary: '',
                jobType: 'Full-time',
                experience: '',
                description: '',
                requirements: '',
                benefits: '',
                contactEmail: '',
                applicationDeadline: '',
                department: '',
                skills: ''
              });
              setMessage({ type: '', text: '' });
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminJob;