import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
  FaDollarSign,
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaLock,
  FaEdit,
  FaTrash,
  FaEye,
  FaClipboardList,
  FaTools,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import "./EmployeePostedJob.css";

const EmployeePostedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch jobs posted by the logged-in employee
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          setError("Please login to view your posted jobs");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/employee/myjobs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || "Failed to fetch your posted jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'pending', icon: <FaHourglassHalf />, text: 'Pending Review' },
      accepted: { class: 'accepted', icon: <FaCheckCircle />, text: 'Accepted' },
      active: { class: 'approved', icon: <FaCheckCircle />, text: 'Active' },
      rejected: { class: 'rejected', icon: <FaTimesCircle />, text: 'Rejected' },
      closed: { class: 'closed', icon: <FaLock />, text: 'Closed' },
      expired: { class: 'expired', icon: <FaClock />, text: 'Expired' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span className={`status ${statusInfo.class}`}>
        {statusInfo.icon}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title || '',
      category: job.category || '',
      jobType: job.jobType || '',
      experience: job.experience || '',
      workMode: job.workMode || '',
      salary: job.salary || '',
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
      skills: job.skills ? job.skills.join(', ') : '',
      companyName: job.company?.name || '',
      companyLocation: job.company?.location || '',
      companyDepartment: job.company?.department || '',
      companyContactEmail: job.company?.contactEmail || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingJob(null);
    setEditFormData({});
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Session expired. Please login again.');
        // Optionally redirect to login
        // window.location.href = '/login';
        return;
      }

      const updatedJobData = {
        title: editFormData.title,
        category: editFormData.category,
        jobType: editFormData.jobType,
        experience: editFormData.experience,
        workMode: editFormData.workMode,
        salary: editFormData.salary ? parseFloat(editFormData.salary) : null,
        applicationDeadline: editFormData.applicationDeadline || null,
        skills: editFormData.skills ? editFormData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        company: {
          name: editFormData.companyName,
          location: editFormData.companyLocation,
          department: editFormData.companyDepartment,
          contactEmail: editFormData.companyContactEmail
        }
      };

      console.log('Sending update request for job:', editingJob._id);
      console.log('Token:', token.substring(0, 20) + '...');

      const response = await axios.put(
        `http://localhost:8000/employee/jobs/${editingJob._id}`,
        updatedJobData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update the jobs list with the edited job
        setJobs(prevJobs => prevJobs.map(job => 
          job._id === editingJob._id ? response.data : job
        ));
        alert('Job updated successfully!');
        handleCloseEdit();
      }
    } catch (err) {
      console.error('Error updating job:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        alert('Session expired or invalid token. Please login again.');
        // Optionally redirect to login
        // localStorage.removeItem('token');
        // sessionStorage.removeItem('token');
        // window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || 'Failed to update job. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="employee-postedjob">
        <div className="loading-container">
          <FaSpinner className="spinner-icon" />
          <p>Loading your posted jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-postedjob">
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-postedjob">
      <div className="header-section">
        <div className="header-icon">
          <FaClipboardList />
        </div>
        <h2>My Posted Jobs</h2>
        <p>Manage and track your job postings</p>
        <div className="stats">
          <div className="stat-badge">
            <FaBriefcase />
            <span>Total: {jobs.length} jobs</span>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaClipboardList />
          </div>
          <h3>No Jobs Posted Yet</h3>
          <p>You haven't posted any jobs yet. Start by creating your first job posting!</p>
        </div>
      ) : (
        <div className="jobs-container">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3>{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="job-meta">
                  <span className="posted-date">
                    <FaCalendarAlt />
                    <span>Posted: {formatDate(job.postedDate)}</span>
                  </span>
                  {job.applicationDeadline && (
                    <span className="deadline">
                      <FaClock />
                      <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="job-details">
                <div className="company-info">
                  <h4>
                    <FaBuilding />
                    <span>Company Details</span>
                  </h4>
                  <div className="company-grid">
                    <div className="company-item">
                      <strong>Company:</strong>
                      <span>{job.company?.name || 'Not specified'}</span>
                    </div>
                    <div className="company-item">
                      <strong>
                        <FaMapMarkerAlt /> Location:
                      </strong>
                      <span>{job.company?.location || 'Not specified'}</span>
                    </div>
                    {job.company?.department && (
                      <div className="company-item">
                        <strong>Department:</strong>
                        <span>{job.company.department}</span>
                      </div>
                    )}
                    <div className="company-item">
                      <strong>
                        <FaEnvelope /> Contact:
                      </strong>
                      <span>{job.company?.contactEmail || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="job-info">
                  <h4>
                    <FaBriefcase />
                    <span>Job Details</span>
                  </h4>
                  <div className="job-grid">
                    <div className="job-item">
                      <strong>
                        <FaLayerGroup /> Category:
                      </strong>
                      <span>{job.category || 'Not specified'}</span>
                    </div>
                    <div className="job-item">
                      <strong>Type:</strong>
                      <span>{job.jobType || 'Not specified'}</span>
                    </div>
                    <div className="job-item">
                      <strong>Experience:</strong>
                      <span>{job.experience || 'Not specified'}</span>
                    </div>
                    <div className="job-item">
                      <strong>Work Mode:</strong>
                      <span>{job.workMode || 'Not specified'}</span>
                    </div>
                    <div className="job-item">
                      <strong>
                        <FaDollarSign /> Salary:
                      </strong>
                      <span>{job.salary ? formatSalary(job.salary) : 'Not disclosed'}</span>
                    </div>
                  </div>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="skills-section">
                    <h4>
                      <FaTools />
                      <span>Required Skills</span>
                    </h4>
                    <div className="skills-list">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="job-actions">
                <button className="btn-secondary" onClick={() => handleEdit(job)}>
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button className="btn-danger">
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditModalOpen && (
        <div className="edit-modal-overlay" onClick={handleCloseEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaEdit />
                <span>Edit Job Posting</span>
              </h2>
              <button className="close-btn" onClick={handleCloseEdit}>
                ×
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="edit-form">
              <div className="form-section">
                <h3>
                  <FaBriefcase />
                  <span>Job Information</span>
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={editFormData.category || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="IT">IT</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Operations">Operations</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Job Type *</label>
                    <select
                      name="jobType"
                      value={editFormData.jobType || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Experience Level *</label>
                    <select
                      name="experience"
                      value={editFormData.experience || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Work Mode *</label>
                    <select
                      name="workMode"
                      value={editFormData.workMode || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Work Mode</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Salary (USD)</label>
                    <input
                      type="number"
                      name="salary"
                      value={editFormData.salary || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 80000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Application Deadline</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={editFormData.applicationDeadline || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Required Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={editFormData.skills || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <FaBuilding />
                  <span>Company Information</span>
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={editFormData.companyName || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Tech Corp Inc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="companyLocation"
                      value={editFormData.companyLocation || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., New York, USA"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="companyDepartment"
                      value={editFormData.companyDepartment || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email *</label>
                    <input
                      type="email"
                      name="companyContactEmail"
                      value={editFormData.companyContactEmail || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., hr@company.com"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  <FaCheckCircle />
                  <span>Save Changes</span>
                </button>
                <button type="button" className="btn-secondary" onClick={handleCloseEdit}>
                  <FaTimesCircle />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePostedJob;
