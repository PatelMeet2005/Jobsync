import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminJobList.css";

const AdminJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/employee/fetchjobs");
      console.log("Fetched jobs:", response.data);
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedJobs = jobs
    .filter((job) => {
      const term = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(term) ||
        job.company.name.toLowerCase().includes(term) ||
        job.company.location.toLowerCase().includes(term) ||
        job.category.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedDate) - new Date(a.postedDate);
        case "oldest":
          return new Date(a.postedDate) - new Date(b.postedDate);
        case "salary-high":
          return b.salary - a.salary;
        case "salary-low":
          return a.salary - b.salary;
        default:
          return 0;
      }
    });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary);

  if (loading) {
    return (
      <div className="admin-job-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-job-list-container">
      <div className="admin-job-list-header">
        <h1>Job Listings</h1>
        <p>Browse and manage all available jobs</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchJobs} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="job-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>
          </div>
        </div>

        <div className="job-stats">
          <div className="stat-item">
            <span className="stat-number">{jobs.length}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {jobs.filter((job) => job.status === "accepted").length}
            </span>
            <span className="stat-label">Accepted</span>
          </div>
        </div>
      </div>

      <div className="job-list">
        {filteredAndSortedJobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or refresh the list.</p>
          </div>
        ) : (
          filteredAndSortedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span className="company">{job.company.name}</span>
                    <span className="location">📍 {job.company.location}</span>
                    <span className="department">{job.company.department}</span>
                  </div>
                </div>
                <span
                  className={`status-badge ${
                    job.status === "accepted" ? "status-active" : "status-closed"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="job-details">
                <div className="job-info-grid">
                  <div className="info-item">
                    <span className="label">Salary:</span>
                    <span className="value">{formatSalary(job.salary)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Job Type:</span>
                    <span className="value">{job.jobType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Experience:</span>
                    <span className="value">{job.experience}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Work Mode:</span>
                    <span className="value">{job.workMode}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Category:</span>
                    <span className="value">{job.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Posted Date:</span>
                    <span className="value">{formatDate(job.postedDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Deadline:</span>
                    <span className="value">
                      {job.applicationDeadline
                        ? formatDate(job.applicationDeadline)
                        : "No deadline"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="job-actions">
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="refresh-section">
        <button onClick={fetchJobs} className="refresh-btn">
          🔄 Refresh Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminJobList;
