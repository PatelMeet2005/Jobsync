import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { 
  FaBriefcase, 
  FaBuilding, 
  FaRocket, 
  FaTrash, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaEdit,
  FaDollarSign,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaLayerGroup
} from "react-icons/fa";
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
            text: "Job posted successfully! It will be reviewed by admin.",
          });
          resetForm();
        }
      } catch (err) {
        console.error('Error posting job:', err);
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to post job. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="employee-addjob-container">
      <div className="employee-addjob-header">
        <div className="header-icon">
          <FaEdit />
        </div>
        <h1>Post a New Job</h1>
        <p>Fill out both Job Details and Company Details to post your job listing</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <FaCheckCircle className="message-icon" /> : <FaExclamationCircle className="message-icon" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="employee-addjob-form">
        {/* Job Section */}
        <div className="form-section job-section">
          <h2 className="section-title">
            <FaBriefcase />
            <span>Job Details</span>
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Job Title</label>
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
              <label>Category</label>
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
              <label>Job Type</label>
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
              <label>Work Mode</label>
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
              <label>Experience Level</label>
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
              <label>Salary (₹)</label>
              <input
                type="number"
                name="jobSalary"
                value={formik.values.jobSalary}
                onChange={formik.handleChange}
                placeholder="e.g. 700000"
              />
            </div>

            <div className="form-group full-width">
              <label>Required Skills</label>
              <input
                type="text"
                name="jobSkills"
                value={formik.values.jobSkills}
                onChange={formik.handleChange}
                placeholder="e.g. React, Node.js, MongoDB (comma separated)"
              />
            </div>

            <div className="form-group full-width">
              <label>Job Description</label>
              <textarea
                name="jobDescription"
                value={formik.values.jobDescription}
                onChange={formik.handleChange}
                rows="5"
                placeholder="Provide a detailed description of the job role and responsibilities..."
                required
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label>Requirements</label>
              <textarea
                name="jobRequirements"
                value={formik.values.jobRequirements}
                onChange={formik.handleChange}
                rows="4"
                placeholder="Enter each requirement on a new line"
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label>Benefits</label>
              <textarea
                name="jobBenefits"
                value={formik.values.jobBenefits}
                onChange={formik.handleChange}
                rows="3"
                placeholder="Enter each benefit on a new line"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="form-section company-section">
          <h2 className="section-title">
            <FaBuilding />
            <span>Company Details</span>
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                placeholder="e.g. Tech Solutions Inc."
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="companyLocation"
                value={formik.values.companyLocation}
                onChange={formik.handleChange}
                placeholder="e.g. Mumbai, India"
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
                placeholder="e.g. Engineering"
              />
            </div>

            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="companyContactEmail"
                value={formik.values.companyContactEmail}
                onChange={formik.handleChange}
                placeholder="e.g. hr@company.com"
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
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <FaClock className="btn-icon spinning" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <FaRocket className="btn-icon" />
                <span>Post Job</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="clear-btn"
            onClick={formik.handleReset}
            disabled={loading}
          >
            <FaTrash className="btn-icon" />
            <span>Clear Form</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAddJob;
