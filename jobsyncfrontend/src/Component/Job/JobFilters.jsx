import React, { useState } from "react";
import "./JobFilters.css";

const JobFilters = ({ filters, onFilterChange, onSortChange, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Salary range options based on actual data
  const salaryRanges = [
    { label: "Any", value: "" },
    { label: "$0 - $50K", value: "0-50000" },
    { label: "$50K - $75K", value: "50000-75000" },
    { label: "$75K - $100K", value: "75000-100000" },
    { label: "$100K+", value: "100000+" }
  ];
  
  // Experience level options (Entry, Mid, Senior, Executive)
  const experienceLevels = [
    { label: "Any", value: "" },
    { label: "Entry", value: "Entry" },
    { label: "Mid", value: "Mid" },
    { label: "Senior", value: "Senior" },
    { label: "Executive", value: "Executive" }
  ];
  
  // Work mode options (Remote, Hybrid, Onsite)
  const workModeOptions = [
    { label: "Any", value: "" },
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Onsite", value: "Onsite" }
  ];

  // Job type options (Full-time, Part-time, Contract, etc.)
  const jobTypeOptions = [
    { label: "All Job Types", value: "" },
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" }
  ];

  // Category options
  const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "Technology", value: "Technology" },
    { label: "Engineering", value: "Engineering" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Finance", value: "Finance" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Education", value: "Education" }
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
              Search Keywords
            </h3>
            <input
              type="text"
              name="keywords"
              value={filters.keywords || ""}
              onChange={onFilterChange}
              placeholder="Job title, skills..."
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
              value={filters.location || ""}
              onChange={onFilterChange}
              placeholder="City, state..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-briefcase"></i>
              Job Type
            </h3>
            <select
              name="type"
              value={filters.type || ""}
              onChange={onFilterChange}
              className="filter-input"
            >
              {jobTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-money-bill-wave"></i>
              Salary Range
            </h3>
            <select
              name="salary"
              value={filters.salary || ""}
              onChange={onFilterChange}
              className="filter-input"
            >
              {salaryRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-chart-line"></i>
              Experience Level
            </h3>
            <select
              name="experience"
              value={filters.experience || ""}
              onChange={onFilterChange}
              className="filter-input"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">
              <i className="fas fa-sort"></i>
              Sort By
            </h3>
            <select
              name="sort"
              value={filters.sort || ""}
              onChange={onSortChange}
              className="filter-input"
            >
              <option value="">Newest First</option>
              <option value="date">Date Posted</option>
              <option value="salary-desc">Salary (High to Low)</option>
              <option value="salary-asc">Salary (Low to High)</option>
              <option value="company">Company Name</option>
            </select>
          </div>
        </div>
        
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="active-filters-list">
            {filters.keywords && (
              <span className="active-filter">
                Keywords: {filters.keywords}
                <button 
                  onClick={() => onFilterChange({ target: { name: 'keywords', value: '' } })}
                  aria-label="Remove keywords filter"
                >
                  ×
                </button>
              </span>
            )}
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
            {filters.experience && (
              <span className="active-filter">
                Experience: {filters.experience}
                <button 
                  onClick={() => onFilterChange({ target: { name: 'experience', value: '' } })}
                  aria-label="Remove experience filter"
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