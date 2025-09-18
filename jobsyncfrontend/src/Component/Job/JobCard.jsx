

import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";


const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/jobdetails/${job._id}`);
  };
  return (
    <article className="job-card" tabIndex={0} aria-label={`Job: ${job.jobTitle} at ${job.jobCompany}`}>
      <header className="job-card-header">
        {job.companyLogo && (
          <img src={job.companyLogo} alt={`${job.jobCompany} logo`} className="job-company-logo" />
        )}
        <div>
          <h2 className="job-title">{job.jobTitle}</h2>
          <span className="job-company">{job.jobCompany}</span>
        </div>
        <span className="job-location">📍 {job.jobLocation}</span>
        <span className="job-type">{job.jobType}</span>
        <span className="job-salary">💰 {job.jobSalary}</span>
      </header>
      <footer className="job-card-footer">
        <button className="details-btn" onClick={handleViewDetails} tabIndex={0} aria-label={`View details for ${job.jobTitle}`}>View Details</button>
      </footer>
    </article>
  );
};

export default JobCard;
