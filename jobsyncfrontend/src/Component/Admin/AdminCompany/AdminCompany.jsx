import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminCompany.css';

const AdminCompany = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('jobs-desc');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/admin/companies', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        setCompanies(response.data.companies || []);
      } else {
        setError('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError(error.response?.data?.message || 'Failed to fetch companies');
      
      // Fallback to mock data for demonstration
      setCompanies([
        {
          _id: '1',
          name: 'Tech Solutions Inc.',
          industry: 'Technology',
          location: 'New York, NY',
          website: 'https://techsolutions.com',
          email: 'hr@techsolutions.com',
          phone: '+1-555-0101',
          description: 'Leading software development company specializing in enterprise solutions.',
          size: '500-1000',
          founded: 2010,
          logo: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=TS',
          totalJobs: 15,
          activeJobs: 8,
          totalApplications: 234,
          status: 'active'
        },
        {
          _id: '2',
          name: 'Innovation Corp',
          industry: 'Software',
          location: 'San Francisco, CA',
          website: 'https://innovationcorp.com',
          email: 'careers@innovationcorp.com',
          phone: '+1-555-0202',
          description: 'Innovative startup focused on AI and machine learning solutions.',
          size: '100-500',
          founded: 2018,
          logo: 'https://via.placeholder.com/150/FF6600/FFFFFF?text=IC',
          totalJobs: 12,
          activeJobs: 7,
          totalApplications: 156,
          status: 'active'
        },
        {
          _id: '3',
          name: 'Creative Studio',
          industry: 'Design',
          location: 'Los Angeles, CA',
          website: 'https://creativestudio.com',
          email: 'hello@creativestudio.com',
          phone: '+1-555-0303',
          description: 'Award-winning design agency creating beautiful digital experiences.',
          size: '50-100',
          founded: 2015,
          logo: 'https://via.placeholder.com/150/9933CC/FFFFFF?text=CS',
          totalJobs: 8,
          activeJobs: 5,
          totalApplications: 89,
          status: 'active'
        },
        {
          _id: '4',
          name: 'Global Finance Corp',
          industry: 'Finance',
          location: 'Chicago, IL',
          website: 'https://globalfinance.com',
          email: 'jobs@globalfinance.com',
          phone: '+1-555-0404',
          description: 'International financial services company with 50+ years of experience.',
          size: '1000+',
          founded: 1970,
          logo: 'https://via.placeholder.com/150/006600/FFFFFF?text=GF',
          totalJobs: 25,
          activeJobs: 18,
          totalApplications: 445,
          status: 'active'
        },
        {
          _id: '5',
          name: 'HealthTech Solutions',
          industry: 'Healthcare',
          location: 'Boston, MA',
          website: 'https://healthtech.com',
          email: 'hr@healthtech.com',
          phone: '+1-555-0505',
          description: 'Healthcare technology company improving patient outcomes through innovation.',
          size: '200-500',
          founded: 2012,
          logo: 'https://via.placeholder.com/150/CC0000/FFFFFF?text=HT',
          totalJobs: 18,
          activeJobs: 12,
          totalApplications: 298,
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJobs = (company) => {
    // Navigate to job list page with company filter
    navigate(`/adminjoblist?company=${encodeURIComponent(company.name)}`);
  };

  const handleCompanyAction = async (companyId, action) => {
    try {
      const endpoint = action === 'activate' ? 'activate' : 'deactivate';
      const response = await axios.patch(`http://localhost:8000/admin/companies/${companyId}/${endpoint}`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        setCompanies(companies.map(company => 
          company._id === companyId ? { ...company, status: action === 'activate' ? 'active' : 'inactive' } : company
        ));
      }
    } catch (error) {
      console.error(`Error ${action}ing company:`, error);
      alert(`Failed to ${action} company`);
    }
  };

  const filteredAndSortedCompanies = companies
    .filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'jobs-desc':
          return b.totalJobs - a.totalJobs;
        case 'jobs-asc':
          return a.totalJobs - b.totalJobs;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'applications-desc':
          return b.totalApplications - a.totalApplications;
        default:
          return 0;
      }
    });

  const totalStats = companies.reduce((acc, company) => ({
    totalCompanies: acc.totalCompanies + 1,
    totalJobs: acc.totalJobs + company.totalJobs,
    totalActiveJobs: acc.totalActiveJobs + company.activeJobs,
    totalApplications: acc.totalApplications + company.totalApplications
  }), { totalCompanies: 0, totalJobs: 0, totalActiveJobs: 0, totalApplications: 0 });

  if (loading) {
    return (
      <div className="admin-company-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-company-container">
      <div className="admin-company-header">
        <h1>Company Management</h1>
        <p>Manage and monitor all companies on the platform</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCompanies} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="company-stats-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>{totalStats.totalCompanies}</h3>
              <p>Total Companies</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>{totalStats.totalJobs}</h3>
              <p>Total Jobs Posted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{totalStats.totalActiveJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{totalStats.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="company-controls">
        <div className="search-sort-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-section">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select-company"
            >
              <option value="jobs-desc">Most Jobs</option>
              <option value="jobs-asc">Least Jobs</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="applications-desc">Most Applications</option>
            </select>
          </div>
        </div>
      </div>

      <div className="company-list">
        {filteredAndSortedCompanies.length === 0 ? (
          <div className="no-companies">
            <h3>No companies found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredAndSortedCompanies.map(company => (
            <div key={company._id} className="company-card">
              <div className="company-header">
                <div className="company-logo-section">
                  <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
                  <div className="company-basic-info">
                    <h3 className="company-name">{company.name}</h3>
                    <div className="company-meta">
                      <span className="industry">🏭 {company.industry}</span>
                      <span className="location">📍 {company.location}</span>
                      <span className="size">👥 {company.size} employees</span>
                      <span className="founded">📅 Founded {company.founded}</span>
                    </div>
                  </div>
                </div>
                <div className="company-status">
                  <span className={`status-badge ${company.status}`}>
                    {company.status}
                  </span>
                </div>
              </div>

              <div className="company-description">
                <p>{company.description}</p>
              </div>

              <div className="company-contact">
                <div className="contact-item">
                  <span className="contact-label">Website:</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="contact-value">
                    {company.website}
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${company.email}`} className="contact-value">
                    {company.email}
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">{company.phone}</span>
                </div>
              </div>

              <div className="company-job-stats">
                <div className="job-stat-item">
                  <span className="job-stat-number">{company.totalJobs}</span>
                  <span className="job-stat-label">Total Jobs</span>
                </div>
                <div className="job-stat-item">
                  <span className="job-stat-number">{company.activeJobs}</span>
                  <span className="job-stat-label">Active Jobs</span>
                </div>
                <div className="job-stat-item">
                  <span className="job-stat-number">{company.totalApplications}</span>
                  <span className="job-stat-label">Applications</span>
                </div>
              </div>

              <div className="company-actions">
                <button 
                  className="view-jobs-btn"
                  onClick={() => handleViewJobs(company)}
                >
                  📋 View All Jobs ({company.totalJobs})
                </button>
                
                {company.status === 'active' ? (
                  <button 
                    className="deactivate-btn"
                    onClick={() => handleCompanyAction(company._id, 'deactivate')}
                  >
                    ⏸️ Deactivate
                  </button>
                ) : (
                  <button 
                    className="activate-btn"
                    onClick={() => handleCompanyAction(company._id, 'activate')}
                  >
                    ▶️ Activate
                  </button>
                )}
                
                <button className="edit-btn">✏️ Edit</button>
                <button className="details-btn">👁️ View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="refresh-section">
        <button onClick={fetchCompanies} className="refresh-btn">
          🔄 Refresh Companies
        </button>
      </div>
    </div>
  );
};

export default AdminCompany;