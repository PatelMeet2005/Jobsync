import React, { useState } from 'react';
import axios from 'axios';
import './AdminJob.css';

const AdminJob = () => {
  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare the data for submission
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        benefits: formData.benefits.split('\n').filter(benefit => benefit.trim()),
        salary: parseFloat(formData.salary) || 0,
        postedBy: 'admin',
        postedDate: new Date().toISOString(),
        status: 'active'
      };

      const response = await axios.post('http://localhost:8000/admin/jobs', jobData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: 'Job posted successfully!' });
        // Reset form
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
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to post job. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="admin-job-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
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
              value={formData.company}
              onChange={handleInputChange}
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
              value={formData.location}
              onChange={handleInputChange}
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
              value={formData.salary}
              onChange={handleInputChange}
              required
              placeholder="e.g. 75000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Job Type *</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
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
              value={formData.experience}
              onChange={handleInputChange}
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
              value={formData.department}
              onChange={handleInputChange}
              placeholder="e.g. Engineering, Marketing, Sales"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
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
              value={formData.applicationDeadline}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="skills">Required Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g. React, Node.js, JavaScript, MongoDB"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
            value={formData.requirements}
            onChange={handleInputChange}
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
            value={formData.benefits}
            onChange={handleInputChange}
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