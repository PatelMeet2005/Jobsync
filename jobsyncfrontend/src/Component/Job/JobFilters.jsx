import React, { useState } from "react";
import "./JobFilters.css";

const JobFilters = ({ filters, onFilterChange, onSortChange, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Salary range options
  const salaryRanges = [
    { label: "Any", value: "" },
    { label: "$0 - $50K", value: "0-50" },
    { label: "$50K - $100K", value: "50-100" },
    { label: "$100K - $150K", value: "100-150" },
    { label: "$150K+", value: "150+" }
  ];
  
  // Experience level options
  const experienceLevels = [
    { label: "Any", value: "" },
    { label: "Entry Level", value: "entry" },
    { label: "Mid Level", value: "mid" },
    { label: "Senior Level", value: "senior" },
    { label: "Executive", value: "executive" }
  ];
  
  // Remote work options
  const remoteOptions = [
    { label: "Any", value: "" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "On-Site", value: "onsite" }
  ];

  return (
    <>
      <button 
        className="filters-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="job-filters-sidebar"
      >
        <i className={`fas ${isExpanded ? 'fa-times' : 'fa-filter'}`}></i>
        {isExpanded ? 'Close Filters' : 'Show Filters'}
      </button>
      
      <aside 
        id="job-filters-sidebar" 
        className={`job-filters-sidebar ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="filters-header">
          <h2 className="filters-title">
            <i className="fas fa-filter"></i>
            Filters
          </h2>
          <button 
            className="reset-filters-btn"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            Reset All
          </button>
        </div>
        
        <div className="filters-content">
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-search"></i>
              Keywords
            </h3>
            <input
              type="text"
              name="keywords"
              value={filters.keywords}
              onChange={onFilterChange}
              placeholder="Job title, skills, etc."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-map-marker-alt"></i>
              Location
            </h3>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={onFilterChange}
              placeholder="City, state, or remote"
              className="filter-input"
            />
            <div className="remote-options">
              {remoteOptions.map(option => (
                <label key={option.value} className="filter-option">
                  <input
                    type="radio"
                    name="remote"
                    value={option.value}
                    checked={filters.remote === option.value}
                    onChange={onFilterChange}
                  />
                  <span className="checkmark"></span>
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-briefcase"></i>
              Job Type
            </h3>
            <select
              name="type"
              value={filters.type}
              onChange={onFilterChange}
              className="filter-input"
            >
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-money-bill-wave"></i>
              Salary Range
            </h3>
            <div className="salary-options">
              {salaryRanges.map(range => (
                <label key={range.value} className="filter-option">
                  <input
                    type="radio"
                    name="salary"
                    value={range.value}
                    checked={filters.salary === range.value}
                    onChange={onFilterChange}
                  />
                  <span className="checkmark"></span>
                  {range.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-chart-line"></i>
              Experience Level
            </h3>
            <div className="experience-options">
              {experienceLevels.map(level => (
                <label key={level.value} className="filter-option">
                  <input
                    type="radio"
                    name="experience"
                    value={level.value}
                    checked={filters.experience === level.value}
                    onChange={onFilterChange}
                  />
                  <span className="checkmark"></span>
                  {level.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-sort"></i>
              Sort By
            </h3>
            <select
              name="sort"
              value={filters.sort}
              onChange={onSortChange}
              className="filter-input"
            >
              <option value="">Relevance</option>
              <option value="date">Date Posted (Newest)</option>
              <option value="salary-desc">Salary (High to Low)</option>
              <option value="salary-asc">Salary (Low to High)</option>
              <option value="company">Company Name</option>
            </select>
          </div>
        </div>
        
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="active-filters-list">
            {filters.location && (
              <span className="active-filter">
                Location: {filters.location}
                <button 
                  onClick={() => onFilterChange({ target: { name: 'location', value: '' } })}
                  aria-label="Remove location filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="active-filter">
                Type: {filters.type}
                <button 
                  onClick={() => onFilterChange({ target: { name: 'type', value: '' } })}
                  aria-label="Remove job type filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.salary && (
              <span className="active-filter">
                Salary: {salaryRanges.find(r => r.value === filters.salary)?.label}
                <button 
                  onClick={() => onFilterChange({ target: { name: 'salary', value: '' } })}
                  aria-label="Remove salary filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default JobFilters;