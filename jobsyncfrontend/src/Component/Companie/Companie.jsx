import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Companie.css';
import { IoSearch, IoStar, IoStarOutline, IoFilter, IoClose } from 'react-icons/io5';

const Companie = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    industry: '',
    location: '',
    department: '',
    jobCount: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample company data

  const industries = [
    { name: "Internet", count: "255 Companies" },
    { name: "Manufacturing", count: "1K+ Companies" },
    { name: "Fortune 500", count: "188 Companies" },
    { name: "Product", count: "1.2K+ Companies" },
    { name: "IT Services", count: "3.5K+ Companies" }
  ];

  // Job count range options
  const jobCountOptions = [
    { label: "All", value: "" },
    { label: "0-5 Jobs", value: "0-5" },
    { label: "5-10 Jobs", value: "5-10" },
    { label: "10-15 Jobs", value: "10-15" },
    { label: "15-20 Jobs", value: "15-20" },
    { label: "20+ Jobs", value: "20+" }
  ];

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/employee/fetchjobs');

      console.log('API Response:', response.data); // Debug log

      if (response.data && response.data.success && Array.isArray(response.data.jobs)) {
        // Process jobs to extract unique companies with job counts
        const companyMap = new Map();
        
        response.data.jobs.forEach(job => {
          const company = job.company;
          if (company && company.name) {
            const companyKey = company.name.toLowerCase();
            
            if (companyMap.has(companyKey)) {
              // Company exists, increment job count
              const existingCompany = companyMap.get(companyKey);
              existingCompany.totalJobs += 1;
              
              // Count jobs by status
              if (job.status === 'accepted' || job.status === 'active') {
                existingCompany.activeJobs += 1;
              }
            } else {
              // New company, create entry
              const companyName = company.name;
              companyMap.set(companyKey, {
                id: job._id + '_company', // Use job ID as base for company ID
                name: companyName,
                logo: companyName.charAt(0).toUpperCase(),
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
                reviews: Math.floor(Math.random() * 1000) + 50, // Random reviews
                industry: job.category || 'Technology',
                founded: 'Not specified',
                employees: 'Not specified',
                type: 'Corporate',
                location: company.location || 'Not specified',
                description: job.description?.substring(0, 100) + '...' || `Company in ${job.category || 'Technology'} sector`,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
                totalJobs: 1,
                activeJobs: (job.status === 'accepted' || job.status === 'active') ? 1 : 0,
                department: company.department || 'General',
                email: company.contactEmail || 'Not provided'
              });
            }
          }
        });

        // Convert map to array
        const companiesArray = Array.from(companyMap.values());
        console.log('Processed companies:', companiesArray); // Debug log
        setCompanies(companiesArray);
        setError('');
      } else {
        console.error('Invalid API response structure:', response.data);
        setError('Invalid data format received from API');
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies from jobs:', error);
      setError(error.response?.data?.message || 'Failed to fetch company data');
      setCompanies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
                         company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Name filter
    const matchesName = filters.name === '' || 
                       company.name.toLowerCase().includes(filters.name.toLowerCase());
    
    // Industry filter
    const matchesIndustry = filters.industry === '' || 
                           company.industry.toLowerCase().includes(filters.industry.toLowerCase());
    
    // Location filter
    const matchesLocation = filters.location === '' || 
                           company.location.toLowerCase().includes(filters.location.toLowerCase());

    // Department filter
    const matchesDepartment = filters.department === '' || 
                             company.department.toLowerCase().includes(filters.department.toLowerCase());

    // Job count range filter
    const matchesJobCount = (() => {
      if (filters.jobCount === '') return true;
      const jobCount = company.totalJobs;
      
      if (filters.jobCount === '0-5') return jobCount >= 0 && jobCount <= 5;
      if (filters.jobCount === '5-10') return jobCount > 5 && jobCount <= 10;
      if (filters.jobCount === '10-15') return jobCount > 10 && jobCount <= 15;
      if (filters.jobCount === '15-20') return jobCount > 15 && jobCount <= 20;
      if (filters.jobCount === '20+') return jobCount > 20;
      return true;
    })();

    return matchesSearch && matchesName && matchesIndustry && matchesLocation && matchesDepartment && matchesJobCount;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      name: '',
      industry: '',
      location: '',
      department: '',
      jobCount: ''
    });
    setSearchTerm('');
  };

  const handleViewJobs = (company) => {
    // Navigate to job page with company filter
    navigate(`/job?company=${encodeURIComponent(company.name)}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<IoStar key="half" className="star half" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<IoStarOutline key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <div className="companies-page">
      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchCompanies} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="companies-hero">
        <div className="hero-content">
          <h1>Companies from Job Submissions</h1>
          <p>Discover companies that are actively posting jobs through our platform</p>
        </div>
      </section>

      {/* Industry Categories */}
      <section className="industry-categories">
        <div className="categories-grid">
          {industries.map((industry, index) => (
            <div key={index} className="category-card">
              <h3>{industry.name}</h3>
              <p>{industry.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="companies-container">
        {/* Sidebar Filters */}
        <aside className={`job-filters-sidebar ${showFilters ? 'expanded' : ''}`}>
          <div className="filters-header">
            <h2 className="filters-title">
              <i className="fas fa-filter"></i>
              Filters
            </h2>
            <button 
              className="reset-filters-btn"
              onClick={clearAllFilters}
            >
              Reset All
            </button>
          </div>

          <div className="filters-content">
            <div className="filter-group">
              <h3 className="filter-group-title">
                <i className="fas fa-building"></i>
                Company Name
              </h3>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by company name..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">
                <i className="fas fa-industry"></i>
                Industry
              </h3>
              <input
                type="text"
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                placeholder="e.g., Technology, Finance..."
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
                onChange={handleFilterChange}
                placeholder="e.g., New York, Remote..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">
                <i className="fas fa-briefcase"></i>
                Department
              </h3>
              <input
                type="text"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                placeholder="e.g., Engineering, Sales..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">
                <i className="fas fa-chart-bar"></i>
                Job Count
              </h3>
              <select
                name="jobCount"
                value={filters.jobCount}
                onChange={handleFilterChange}
                className="filter-input"
              >
                {jobCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="active-filters-list">
              {filters.name && (
                <span className="active-filter">
                  Name: {filters.name}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, name: '' }))}
                    aria-label="Remove name filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.industry && (
                <span className="active-filter">
                  Industry: {filters.industry}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, industry: '' }))}
                    aria-label="Remove industry filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="active-filter">
                  Location: {filters.location}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                    aria-label="Remove location filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.department && (
                <span className="active-filter">
                  Department: {filters.department}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, department: '' }))}
                    aria-label="Remove department filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.jobCount && (
                <span className="active-filter">
                  Jobs: {jobCountOptions.find(opt => opt.value === filters.jobCount)?.label}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, jobCount: '' }))}
                    aria-label="Remove job count filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="companies-main">

          {/* Companies Grid */}
          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="company-card">
                {/* Card Header */}
                <div className="company-header">
                  <div className="company-info">
                    <div className="company-name">
                    <h3>{company.name}</h3>
                    </div>
                    <div className="company-email">
                      <i className="fas fa-envelope"></i>
                      <span>{company.email}</span>
                    </div>
                  </div>
                </div>

                {/* Company Meta Info - Industry, Location, Department in one line */}
                <div className="company-meta-badges">
                  <div className="meta-badge">
                    <i className="fas fa-industry"></i>
                    <span>{company.industry}</span>
                  </div>
                  <div className="meta-badge">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{company.location}</span>
                  </div>
                  <div className="meta-badge">
                    <i className="fas fa-building"></i>
                    <span>{company.department}</span>
                  </div>
                </div>

                {/* Job Statistics - Simple Format */}
                <div className="job-stats-simple">
                  <div className="stat-row">
                    <span className="stat-label-simple">Total Jobs:</span>
                    <span className="stat-value-simple">{company.totalJobs || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label-simple">Active Jobs:</span>
                    <span className="stat-value-simple">{company.activeJobs || 0}</span>
                  </div>
                </div>


                {/* Action Button */}
                <div className="company-actions">
                  <button className="btn-view-jobs" onClick={() => handleViewJobs(company)}>
                    <i className="fas fa-arrow-right"></i>
                    View All Jobs
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="no-results">
              <h3>No companies found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && <div className="filter-overlay" onClick={() => setShowFilters(false)}></div>}
    </div>
  );
};

export default Companie;