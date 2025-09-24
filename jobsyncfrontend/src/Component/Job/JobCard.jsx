import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

const JobCard = ({ job, onSaveJob, onQuickApply }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = (e) => {
    // Prevent navigation if clicking on save button or quick apply
    if (e.target.closest('.save-job-btn') || e.target.closest('.quick-apply-btn')) {
      return;
    }
    navigate(`/jobdetails/${job._id}`);
  };

  const handleSaveJob = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSaveJob) {
      onSaveJob(job._id, !isSaved);
    }
  };

  const handleQuickApply = (e) => {
    e.stopPropagation();
    if (onQuickApply) {
      onQuickApply(job._id);
    }
  };

  // Format date (if job has a posted date)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <article 
      className={`job-card ${isHovered ? 'hovered' : ''}`} 
      tabIndex={0} 
      aria-label={`Job: ${job.jobTitle} at ${job.jobCompany}`}
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="job-card-header">
        <div className="company-info">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={`${job.jobCompany} logo`} className="job-company-logo" />
          ) : (
            <div className="company-logo-placeholder">
              {job.jobCompany ? job.jobCompany.charAt(0).toUpperCase() : 'J'}
            </div>
          )}
          <div className="company-details">
            <h2 className="job-title">{job.jobTitle}</h2>
            <span className="job-company">{job.jobCompany}</span>
          </div>
        </div>
        
        <button 
          className={`save-job-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveJob}
          aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
        >
          <i className={`fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
        </button>
      </div>

      <div className="job-card-body">
        <div className="job-meta">
          <div className="meta-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{job.jobLocation}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>{job.jobType}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-money-bill-wave"></i>
            <span>{job.jobSalary}</span>
          </div>
        </div>

        {job.jobSkills && job.jobSkills.length > 0 && (
          <div className="job-skills">
            {job.jobSkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {job.jobSkills.length > 3 && (
              <span className="skill-tag-more">+{job.jobSkills.length - 3} more</span>
            )}
          </div>
        )}

        {job.jobDescription && (
          <p className="job-description">
            {job.jobDescription.length > 120 
              ? `${job.jobDescription.substring(0, 120)}...` 
              : job.jobDescription
            }
          </p>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-posted-date">
          {job.postedDate && (
            <>
              <i className="fas fa-calendar-alt"></i>
              Posted {formatDate(job.postedDate)}
            </>
          )}
        </div>
        
        <div className="job-actions">
          <button 
            className="quick-apply-btn"
            onClick={handleQuickApply}
            aria-label={`Quick apply for ${job.jobTitle}`}
          >
            <i className="fas fa-bolt"></i>
            Quick Apply
          </button>
          <button 
            className="details-btn"
            onClick={handleViewDetails}
            aria-label={`View details for ${job.jobTitle}`}
          >
            View Details
          </button>
        </div>
      </div>

      {isHovered && (
        <div className="job-card-hover-effect"></div>
      )}
    </article>
  );
};

export default JobCard;