import React from "react";
import JobCard from "./JobCard";
import "./JobList.css";

const JobList = ({ jobs, loading, empty, onViewDetails, onSaveJob, onApply }) => {
  // Skeleton loader components for better loading state
  const SkeletonLoader = () => (
    <div className="job-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-title">
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line long"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  return (
    <section className="job-list-container" aria-label="Job listings">
      {loading ? (
        <div className="loading-state" aria-live="polite">
          <h2 className="loading-title">Finding your next opportunity</h2>
          <div className="job-list-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        </div>
      ) : empty ? (
        <div className="empty-state" role="status">
          <div className="empty-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>No jobs match your criteria</h3>
          <p>Try adjusting your filters or search terms to find more results.</p>
          <button className="reset-filters-btn">Reset Filters</button>
        </div>
      ) : (
        <>
          <div className="results-header">
            
            
          </div>
          <div className="job-list-grid">
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                onViewDetails={onViewDetails}
                onSaveJob={onSaveJob}
                onApply={onApply}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default JobList;