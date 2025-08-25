
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Job.css';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/getJobs");
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="job-page-container">
      <div className="job-header-section">
        <h1 className="main_heading">Find your dream job with us!</h1>
        <p className="job-header-desc">Browse all available jobs and apply for your next opportunity.</p>
        <div className="job-search-bar">
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            className="search_input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="search_button" onClick={() => {}}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchJobs} className="retry-btn">Retry</button>
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <h2 className="job-title">{job.jobTitle}</h2>
                  <span className="job-company">{job.jobCompany}</span>
                  <span className="job-location">📍 {job.jobLocation}</span>
                  <span className="job-type">{job.jobType}</span>
                  <span className="job-salary">💰 {job.jobSalary}</span>
                </div>
                <div className="job-card-body">
                  <div className="job-description">
                    <strong>Description:</strong>
                    <p>{job.jobDescription}</p>
                  </div>
                  <div className="job-details-grid">
                    <div><strong>Department:</strong> {job.jobDepartment}</div>
                    <div><strong>Experience:</strong> {job.jobExperience}</div>
                    <div><strong>Deadline:</strong> {job.jobApplicationDeadline}</div>
                    <div><strong>Contact Email:</strong> {job.jobContactEmail}</div>
                  </div>
                  <div className="job-skills">
                    <strong>Skills:</strong> {job.jobSkills?.join(", ")}
                  </div>
                  <div className="job-requirements">
                    <strong>Requirements:</strong>
                    <ul>
                      {job.jobRequirements?.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="job-benefits">
                    <strong>Benefits:</strong>
                    <ul>
                      {job.jobBenefits?.map((ben, idx) => (
                        <li key={idx}>{ben}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Job;