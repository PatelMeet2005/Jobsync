import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./EmployeeAddJob.css";

const EmployeeAddJob = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      jobCategory: "",
      jobSalary: "",
      jobType: "Full-time",
      jobExperience: "",
      jobDescription: "",
      jobRequirements: "",
      jobBenefits: "",
      jobSkills: "",
      jobWorkMode: "On-site",
      jobApplicationDeadline: "",
      companyName: "",
      companyLocation: "",
      companyDepartment: "",
      companyContactEmail: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const jobData = {
          title: values.jobTitle,
          category: values.jobCategory,
          salary: parseFloat(values.jobSalary) || 0,
          jobType: values.jobType,
          experience: values.jobExperience,
          description: values.jobDescription,
          requirements: values.jobRequirements.split("\n").filter(Boolean),
          benefits: values.jobBenefits.split("\n").filter(Boolean),
          skills: values.jobSkills.split(",").map((s) => s.trim()).filter(Boolean),
          workMode: values.jobWorkMode,
          applicationDeadline: values.jobApplicationDeadline,
          company: {
            name: values.companyName,
            location: values.companyLocation,
            department: values.companyDepartment,
            contactEmail: values.companyContactEmail,
          },
        };

        // Get JWT token from localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Make API call to backend
        const response = await axios.post(
          'http://localhost:8000/employee/addjob',
          jobData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "✅ Job posted successfully! It will be reviewed by admin.",
          });
          resetForm();
        }
      } catch (err) {
        console.error('Error posting job:', err);
        setMessage({
          type: "error",
          text: err.response?.data?.message || "❌ Failed to post job. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="employee-addjob-container">
      <div className="employee-addjob-header">
        <h1>📝 Post a New Job</h1>
        <p>Fill out both Job Details and Company Details to post your job.</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="employee-addjob-form">
        {/* Job Section */}
        <div className="form-section job-section">
          <h2 className="section-title">💼 Job Details</h2>

          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formik.values.jobTitle}
              onChange={formik.handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="jobCategory"
              value={formik.values.jobCategory}
              onChange={formik.handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Job Type *</label>
            <select
              name="jobType"
              value={formik.values.jobType}
              onChange={formik.handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label>Work Mode *</label>
            <select
              name="jobWorkMode"
              value={formik.values.jobWorkMode}
              onChange={formik.handleChange}
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Experience *</label>
            <select
              name="jobExperience"
              value={formik.values.jobExperience}
              onChange={formik.handleChange}
              required
            >
              <option value="">Select experience level</option>
              <option value="Entry">Entry (0–2 yrs)</option>
              <option value="Mid">Mid (2–5 yrs)</option>
              <option value="Senior">Senior (5+ yrs)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Salary (USD)</label>
            <input
              type="number"
              name="jobSalary"
              value={formik.values.jobSalary}
              onChange={formik.handleChange}
              placeholder="e.g. 70000"
            />
          </div>

          <div className="form-group full-width">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              name="jobSkills"
              value={formik.values.jobSkills}
              onChange={formik.handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="jobDescription"
              value={formik.values.jobDescription}
              onChange={formik.handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Requirements (one per line)</label>
            <textarea
              name="jobRequirements"
              value={formik.values.jobRequirements}
              onChange={formik.handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Benefits (one per line)</label>
            <textarea
              name="jobBenefits"
              value={formik.values.jobBenefits}
              onChange={formik.handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Company Section */}
        <div className="form-section company-section">
          <h2 className="section-title">🏢 Company Details</h2>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="companyLocation"
              value={formik.values.companyLocation}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="companyDepartment"
              value={formik.values.companyDepartment}
              onChange={formik.handleChange}
            />
          </div>

          <div className="form-group">
            <label>Contact Email *</label>
            <input
              type="email"
              name="companyContactEmail"
              value={formik.values.companyContactEmail}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="jobApplicationDeadline"
              value={formik.values.jobApplicationDeadline}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Posting..." : "🚀 Post Job"}
          </button>
          <button
            type="button"
            className="clear-btn"
            onClick={formik.handleReset}
            disabled={loading}
          >
            🗑️ Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAddJob;
