import React, { useState } from "react";
import "./JobHeader.css";

const JobHeader = ({ searchTerm, onSearchChange, onSearchSubmit, onQuickFilter, companyFilter, onClearCompanyFilter }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Quick filter options
  const quickFilters = [
    { label: "Remote", value: "remote" },
    { label: "Full-time", value: "full-time" },
    { label: "Tech", value: "tech" },
    { label: "Marketing", value: "marketing" },
    { label: "Entry Level", value: "entry-level" }
  ];

  return (
    <header className="job-header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="main-heading">
            Find Your <span className="highlight">Dream Job</span> with Jobsync
          </h1>
          <p className="subtitle">
            Discover opportunities from top companies and apply with ease. 
            Your next career move starts here.
          </p>
          
          {/* {companyFilter && (
            <div className="company-filter-badge">
              <span className="filter-text">
                🏢 Showing jobs from: <strong>{companyFilter}</strong>
              </span>
              <button 
                onClick={onClearCompanyFilter} 
                className="clear-company-filter-btn"
                aria-label="Clear company filter"
              >
                ✕ Clear Filter
              </button>
            </div>
          )} */}
        </div>
        
        <form 
          className={`search-container ${isSearchFocused ? 'focused' : ''}`}
          role="search" 
          aria-label="Job search" 
          onSubmit={onSearchSubmit}
        >
         
          
          {/* <div className="quick-filters">
            <span className="quick-filters-label">Quick filters:</span>
            <div className="filter-buttons">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  type="button"
                  className="filter-button"
                  onClick={() => onQuickFilter(filter.value)}
                  aria-label={`Filter by ${filter.label}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div> */}
        </form>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">100+</span>
            <span className="stat-label">Jobs Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Companies</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </div>
      
      <div className="header-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>
    </header>
  );
};

export default JobHeader;