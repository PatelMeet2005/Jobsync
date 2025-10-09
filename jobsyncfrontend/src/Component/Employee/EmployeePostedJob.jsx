import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeePostedJob.css";

const EmployeePostedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      pending: { class: 'pending', icon: '⏳', text: 'Pending Review' },
      accepted: { class: 'accepted', icon: '✅', text: 'Accepted' },
      active: { class: 'approved', icon: '🟢', text: 'Active' },
      rejected: { class: 'rejected', icon: '❌', text: 'Rejected' },
      closed: { class: 'closed', icon: '🔒', text: 'Closed' },
      expired: { class: 'expired', icon: '⌛', text: 'Expired' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.pending;
    return (
      <span className={`status ${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
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

  if (loading) {
    return (
      <div className="employee-postedjob">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your posted jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-postedjob">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-postedjob">
      <div className="header-section">
        <h2>📋 My Posted Jobs</h2>
        <p>Manage and track your job postings</p>
        <div className="stats">
          <span className="total-jobs">Total: {jobs.length} jobs</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
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
                  <span className="posted-date">Posted: {formatDate(job.postedDate)}</span>
                  {job.applicationDeadline && (
                    <span className="deadline">Deadline: {formatDate(job.applicationDeadline)}</span>
                  )}
                </div>
              </div>

              <div className="job-details">
                <div className="company-info">
                  <h4>🏢 Company Details</h4>
                  <div className="company-grid">
                    <div className="company-item">
                      <strong>Company:</strong> {job.company?.name || 'Not specified'}
                    </div>
                    <div className="company-item">
                      <strong>Location:</strong> {job.company?.location || 'Not specified'}
                    </div>
                    {job.company?.department && (
                      <div className="company-item">
                        <strong>Department:</strong> {job.company.department}
                      </div>
                    )}
                    <div className="company-item">
                      <strong>Contact:</strong> {job.company?.contactEmail || 'Not specified'}
                    </div>
                  </div>
                </div>

                <div className="job-info">
                  <h4>💼 Job Details</h4>
                  <div className="job-grid">
                    <div className="job-item">
                      <strong>Category:</strong> {job.category || 'Not specified'}
                    </div>
                    <div className="job-item">
                      <strong>Type:</strong> {job.jobType || 'Not specified'}
                    </div>
                    <div className="job-item">
                      <strong>Experience:</strong> {job.experience || 'Not specified'}
                    </div>
                    <div className="job-item">
                      <strong>Work Mode:</strong> {job.workMode || 'Not specified'}
                    </div>
                    <div className="job-item">
                      <strong>Salary:</strong> {job.salary ? formatSalary(job.salary) : 'Not disclosed'}
                    </div>
                  </div>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="skills-section">
                    <h4>🛠️ Required Skills</h4>
                    <div className="skills-list">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="job-actions">
                <button className="btn-secondary">Edit Job</button>
                <button className="btn-danger">Delete Job</button>
                <button className="btn-primary">View Applications</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeePostedJob;
