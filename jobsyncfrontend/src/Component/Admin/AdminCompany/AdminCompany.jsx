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
              } else if (job.status === 'pending') {
                existingCompany.pendingJobs += 1;
              } else if (job.status === 'rejected') {
                existingCompany.rejectedJobs += 1;
              }
            } else {
              // New company, create entry
              companyMap.set(companyKey, {
                _id: job._id + '_company', // Use job ID as base for company ID
                name: company.name,
                location: company.location || 'Not specified',
                email: company.contactEmail || 'Not provided',
                department: company.department || 'General',
                totalJobs: 1,
                activeJobs: (job.status === 'accepted' || job.status === 'active') ? 1 : 0,
                pendingJobs: job.status === 'pending' ? 1 : 0,
                rejectedJobs: job.status === 'rejected' ? 1 : 0,
                industry: job.category || 'Not specified',
                website: `https://${company.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
                phone: 'Not provided',
                description: `Company posting jobs in ${job.category || 'various'} sector. Department: ${company.department || 'General'}`,
                size: 'Not specified',
                founded: 'Not specified',
                logo: `https://via.placeholder.com/150/0066CC/FFFFFF?text=${company.name.charAt(0)}`,
                status: 'active',
                totalApplications: 0 // This would need to come from applications data
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
        <h1>Companies Overview</h1>
        <p>Companies that have posted jobs through employees - extracted from job submissions</p>
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
                  {/* <span className={`status-badge ${company.status}`}>
                    {company.status}
                  </span> */}
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
                  <span className="job-stat-number">{company.activeJobs || 0}</span>
                  <span className="job-stat-label">Active/Accepted</span>
                </div>
                <div className="job-stat-item">
                  <span className="job-stat-number">{company.pendingJobs || 0}</span>
                  <span className="job-stat-label">Pending</span>
                </div>
                <div className="job-stat-item">
                  <span className="job-stat-number">{company.rejectedJobs || 0}</span>
                  <span className="job-stat-label">Rejected</span>
                </div>
              </div>

              <div className="company-actions">
                <button 
                  className="view-jobs-btn"
                  onClick={() => handleViewJobs(company)}
                >
                  📋 View All Jobs ({company.totalJobs})
                </button>
                
                {/* {company.status === 'active' ? (
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
                )} */}
                
                {/* <button className="edit-btn">✏️ Edit</button>
                <button className="details-btn">👁️ View Details</button> */}
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