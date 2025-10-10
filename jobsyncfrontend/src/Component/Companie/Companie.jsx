import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Companie.css';
import { IoSearch, IoStar, IoStarOutline, IoFilter, IoClose } from 'react-icons/io5';

const Companie = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    industry: [],
    location: [],
    department: [],
    jobCount: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample company data
  const companiesData = [
    {
      id: 1,
      name: "Supreme Petrochem",
      logo: "S",
      rating: 4.1,
      reviews: 117,
      industry: "Chemicals",
      founded: 1993,
      employees: "201-500 emp.",
      type: "Corporate",
      location: "Mumbai",
      description: "Leading petrochemical company in India",
      color: "#e74c3c"
    },
    {
      id: 2,
      name: "Beehyv",
      logo: "🐝",
      rating: 2.4,
      reviews: 56,
      industry: "IT Services & Consulting",
      founded: 2010,
      employees: "51-200 emp.",
      type: "Corporate",
      location: "Bangalore",
      description: "Digital transformation and technology solutions",
      color: "#3498db"
    },
    {
      id: 3,
      name: "Mindteck",
      logo: "M",
      rating: 3.1,
      reviews: 272,
      industry: "IT Services & Consulting",
      founded: 1991,
      employees: "1001-5000 emp.",
      type: "Indian MNC",
      location: "Kolkata",
      description: "Global technology consulting and services",
      color: "#2ecc71"
    },
    {
      id: 4,
      name: "Nipro India Corporation",
      logo: "N",
      rating: 3.3,
      reviews: 168,
      industry: "Medical Services / Hospital",
      founded: 1985,
      employees: "501-1000 emp.",
      type: "Foreign MNC",
      location: "Delhi",
      description: "Medical devices and healthcare solutions",
      color: "#9b59b6"
    },
    {
      id: 5,
      name: "TCS",
      logo: "T",
      rating: 4.2,
      reviews: 45000,
      industry: "IT Services & Consulting",
      founded: 1968,
      employees: "500000+ emp.",
      type: "Indian MNC",
      location: "Mumbai",
      description: "India's largest IT services company",
      color: "#34495e"
    },
    {
      id: 6,
      name: "Infosys",
      logo: "I",
      rating: 4.0,
      reviews: 25000,
      industry: "IT Services & Consulting",
      founded: 1981,
      employees: "250000+ emp.",
      type: "Indian MNC",
      location: "Bangalore",
      description: "Global leader in next-generation digital services",
      color: "#e67e22"
    }
  ];

  const industries = [
    { name: "MNCs", count: "2.2K+ Companies" },
    { name: "Internet", count: "255 Companies" },
    { name: "Manufacturing", count: "1K+ Companies" },
    { name: "Fortune 500", count: "188 Companies" },
    { name: "Product", count: "1.2K+ Companies" },
    { name: "IT Services", count: "3.5K+ Companies" }
  ];

  // Generate dynamic filter options based on actual company data
  const generateFilterOptions = () => {
    const locations = [...new Set(companies.map(c => c.location).filter(Boolean))];
    const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];
    const departments = [...new Set(companies.map(c => c.department).filter(Boolean))];
    
    return {
      industry: industries.map(industry => ({
        label: industry,
        count: companies.filter(c => c.industry === industry).length
      })),
      location: locations.map(location => ({
        label: location,
        count: companies.filter(c => c.location === location).length
      })),
      department: departments.map(department => ({
        label: department,
        count: companies.filter(c => c.department === department).length
      })),
      jobCount: [
        { label: "1 Job", count: companies.filter(c => c.totalJobs === 1).length },
        { label: "2-5 Jobs", count: companies.filter(c => c.totalJobs >= 2 && c.totalJobs <= 5).length },
        { label: "6-10 Jobs", count: companies.filter(c => c.totalJobs >= 6 && c.totalJobs <= 10).length },
        { label: "10+ Jobs", count: companies.filter(c => c.totalJobs > 10).length }
      ]
    };
  };

  const filterOptions = generateFilterOptions();

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
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedFilters.industry.length === 0 || 
                           selectedFilters.industry.includes(company.industry);
    
    const matchesLocation = selectedFilters.location.length === 0 || 
                           selectedFilters.location.includes(company.location);

    const matchesDepartment = selectedFilters.department.length === 0 || 
                             selectedFilters.department.includes(company.department);

    const matchesJobCount = selectedFilters.jobCount.length === 0 || 
                           selectedFilters.jobCount.some(filter => {
                             if (filter === "1 Job") return company.totalJobs === 1;
                             if (filter === "2-5 Jobs") return company.totalJobs >= 2 && company.totalJobs <= 5;
                             if (filter === "6-10 Jobs") return company.totalJobs >= 6 && company.totalJobs <= 10;
                             if (filter === "10+ Jobs") return company.totalJobs > 10;
                             return false;
                           });

    return matchesSearch && matchesIndustry && matchesLocation && matchesDepartment && matchesJobCount;
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      industry: [],
      location: [],
      department: [],
      jobCount: []
    });
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
        <aside className={`filters-sidebar ${showFilters ? 'mobile-open' : ''}`}>
          <div className="filters-header">
            <h3>All Filters</h3>
            <button 
              className="close-filters mobile-only"
              onClick={() => setShowFilters(false)}
            >
              <IoClose />
            </button>
          </div>

          <div className="filter-section">
            <h4>Industry</h4>
            {filterOptions.industry.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.industry.includes(option.label)}
                  onChange={() => handleFilterChange('industry', option.label)}
                />
                <span className="checkmark"></span>
                {option.label} ({option.count})
              </label>
            ))}
          </div>

          <div className="filter-section">
          <h4>Location</h4>
          
            {filterOptions.location.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.location.includes(option.label)}
                  onChange={() => handleFilterChange('location', option.label)}
                />
                <span className="checkmark"></span>
                {option.label} ({option.count})
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Department</h4>
            {filterOptions.department.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.department.includes(option.label)}
                  onChange={() => handleFilterChange('department', option.label)}
                />
                <span className="checkmark"></span>
                {option.label} ({option.count})
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Job Count</h4>
            {filterOptions.jobCount.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.jobCount.includes(option.label)}
                  onChange={() => handleFilterChange('jobCount', option.label)}
                />
                <span className="checkmark"></span>
                {option.label} ({option.count})
              </label>
            ))}
          </div>

          <button className="clear-filters" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="companies-main">
          {/* Search and Filter Controls */}
          <div className="search-controls">
            <div className="search-bar">
              <IoSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search companies by name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className="filter-toggle mobile-only"
              onClick={() => setShowFilters(true)}
            >
              <IoFilter /> Filters
            </button>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>Showing {filteredCompanies.length} companies</p>
          </div>

          {/* Companies Grid */}
          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-header">
                  {/* <div 
                    className="company-logo"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.logo}
                  </div> */}
                  <div className="company-info">
                    <h3>{company.name}</h3>
                    {/* <div className="rating-info">
                      <div className="stars">
                        {renderStars(company.rating)}
                      </div>
                      <span className="rating-text">
                        {company.rating} {company.reviews} reviews
                      </span>
                    </div> */}
                  </div>
                </div>

                <div className="company-details">
                  <div className="detail-tags">
                    <span className="tag industry">{company.industry}</span>
                    {/* <span className="tag founded">Founded: {company.founded}</span>
                    <span className="tag employees">{company.employees}</span> */}
                  </div>
                  
                  
                  
                  <div className="company-meta">
                    <span className="location">{company.location}</span>
                    <span className="type">{company.type}</span>
                  </div>

                  {/* Job Statistics */}
                  <div className="job-stats-company">
                    <div className="job-stat">
                      <span className="stat-number">{company.totalJobs || 0}</span>
                      <span className="stat-label">Total Jobs</span>
                    </div>
                    <div className="job-stat">
                      <span className="stat-number">{company.activeJobs || 0}</span>
                      <span className="stat-label">Active Jobs</span>
                    </div>
                    {company.department && (
                      <div className="job-stat">
                        <span className="stat-label">Department:</span>
                        <span className="stat-value">{company.department}</span>
                      </div>
                    )}
                  </div>

                  <p className="company-description">{company.description}</p>
                </div>

                <div className="company-actions">
                  <button className="btn-primary"><a href="/">View Jobs</a></button>
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