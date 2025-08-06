import React, { useState, useEffect } from 'react';
import './Companie.css';
import { IoSearch, IoStar, IoStarOutline, IoFilter, IoClose } from 'react-icons/io5';

const Companie = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    companyType: [],
    location: [],
    industry: [],
    size: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState([]);

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

  const filterOptions = {
    companyType: [
      { label: "Corporate", count: 4597 },
      { label: "Foreign MNC", count: 1560 },
      { label: "Startup", count: 695 },
      { label: "Indian MNC", count: 638 }
    ],
    location: [
      { label: "Mumbai", count: 2543 },
      { label: "Bangalore", count: 2234 },
      { label: "Delhi", count: 1876 },
      { label: "Pune", count: 1234 }
    ],
    size: [
      { label: "1-50", count: 1234 },
      { label: "51-200", count: 2345 },
      { label: "201-1000", count: 3456 },
      { label: "1000+", count: 1922 }
    ]
  };

  useEffect(() => {
    setCompanies(companiesData);
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedFilters.companyType.length === 0 || 
                       selectedFilters.companyType.includes(company.type);
    
    const matchesLocation = selectedFilters.location.length === 0 || 
                           selectedFilters.location.includes(company.location);

    return matchesSearch && matchesType && matchesLocation;
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
      companyType: [],
      location: [],
      industry: [],
      size: []
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
      {/* Hero Section */}
      <section className="companies-hero">
        <div className="hero-content">
          <h1>Top companies hiring now</h1>
          <p>Discover your next career opportunity with leading companies</p>
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
            <h4>Company type</h4>
            {filterOptions.companyType.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.companyType.includes(option.label)}
                  onChange={() => handleFilterChange('companyType', option.label)}
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
            <h4>Company Size</h4>
            {filterOptions.size.map((option) => (
              <label key={option.label} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.size.includes(option.label)}
                  onChange={() => handleFilterChange('size', option.label)}
                />
                <span className="checkmark"></span>
                {option.label} employees ({option.count})
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
                  <div 
                    className="company-logo"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.logo}
                  </div>
                  <div className="company-info">
                    <h3>{company.name}</h3>
                    <div className="rating-info">
                      <div className="stars">
                        {renderStars(company.rating)}
                      </div>
                      <span className="rating-text">
                        {company.rating} {company.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>

                <div className="company-details">
                  <div className="detail-tags">
                    <span className="tag industry">{company.industry}</span>
                    <span className="tag founded">Founded: {company.founded}</span>
                    <span className="tag employees">{company.employees}</span>
                  </div>
                  
                  <p className="company-description">{company.description}</p>
                  
                  <div className="company-meta">
                    <span className="location">{company.location}</span>
                    <span className="type">{company.type}</span>
                  </div>
                </div>

                <div className="company-actions">
                  <button className="btn-primary">View Jobs</button>
                  <button className="btn-secondary">Company Profile</button>
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