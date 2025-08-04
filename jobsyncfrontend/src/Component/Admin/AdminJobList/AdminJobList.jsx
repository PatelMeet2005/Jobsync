import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminJobList.css';

const AdminJobList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Check for company filter from URL params
    const urlParams = new URLSearchParams(location.search);
    const companyParam = urlParams.get('company');
    if (companyParam) {
      setFilterCompany(companyParam);
      setSearchTerm(companyParam); // Also set search term to show the company
    }
    fetchJobs();
  }, [location.search]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when backend is ready
      // const response = await axios.get('http://localhost:8000/admin/jobs', {
      //   headers: {
      //     'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // });

      // if (response.data.status === 'success') {
      //   setJobs(response.data.jobs || []);
      // } else {
      //   setError('Failed to fetch jobs');
      // }
      
      // Using mock data for demonstration
      setJobs([
        {
          _id: '1',
          title: 'Senior Frontend Developer',
          company: 'Tech Solutions Inc.',
          location: 'New York, NY',
          salary: 75000,
          jobType: 'Full-time',
          experience: 'Senior Level',
          postedDate: '2025-07-15T10:30:00Z',
          applicationDeadline: '2025-09-15',
          status: 'active',
          applicants: 12,
          department: 'Engineering'
        },
        {
          _id: '2',
          title: 'Product Manager',
          company: 'Innovation Corp',
          location: 'San Francisco, CA',
          salary: 90000,
          jobType: 'Full-time',
          experience: 'Mid Level',
          postedDate: '2025-07-20T14:20:00Z',
          applicationDeadline: '2025-08-20',
          status: 'active',
          applicants: 8,
          department: 'Product'
        },
        {
          _id: '3',
          title: 'UX Designer',
          company: 'Creative Studio',
          location: 'Remote',
          salary: 65000,
          jobType: 'Full-time',
          experience: 'Mid Level',
          postedDate: '2025-07-25T09:15:00Z',
          applicationDeadline: '2025-08-25',
          status: 'paused',
          applicants: 15,
          department: 'Design'
        },
        {
          _id: '4',
          title: 'Backend Developer',
          company: 'Tech Solutions Inc.',
          location: 'Austin, TX',
          salary: 80000,
          jobType: 'Full-time',
          experience: 'Mid Level',
          postedDate: '2025-07-28T11:00:00Z',
          applicationDeadline: '2025-08-28',
          status: 'active',
          applicants: 6,
          department: 'Engineering'
        },
        {
          _id: '5',
          title: 'Marketing Manager',
          company: 'Innovation Corp',
          location: 'Los Angeles, CA',
          salary: 70000,
          jobType: 'Full-time',
          experience: 'Senior Level',
          postedDate: '2025-07-30T09:30:00Z',
          applicationDeadline: '2025-08-30',
          status: 'active',
          applicants: 10,
          department: 'Marketing'
        }
      ]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await axios.patch(`http://localhost:8000/admin/jobs/${jobId}/status`, 
      //   { status: newStatus },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );

      // if (response.data.status === 'success') {
      //   setJobs(jobs.map(job => 
      //     job._id === jobId ? { ...job, status: newStatus } : job
      //   ));
      // }
      
      // For now, update locally
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        // TODO: Uncomment when backend is ready
        // const response = await axios.delete(`http://localhost:8000/admin/jobs/${jobId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        //   }
        // });

        // if (response.data.status === 'success') {
        //   setJobs(jobs.filter(job => job._id !== jobId));
        // }
        
        // For now, delete locally
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const clearCompanyFilter = () => {
    setFilterCompany('');
    setSearchTerm('');
    navigate('/admin/jobs');
  };

  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
      const matchesCompany = !filterCompany || job.company.toLowerCase() === filterCompany.toLowerCase();
      return matchesSearch && matchesFilter && matchesCompany;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'oldest':
          return new Date(a.postedDate) - new Date(b.postedDate);
        case 'salary-high':
          return b.salary - a.salary;
        case 'salary-low':
          return a.salary - b.salary;
        case 'applicants':
          return (b.applicants || 0) - (a.applicants || 0);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      paused: 'status-paused',
      closed: 'status-closed',
      draft: 'status-draft'
    };
    return <span className={`status-badge ${statusClasses[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-job-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-job-list-container">
      <div className="admin-job-list-header">
        <h1>Job Management</h1>
        <p>Manage and monitor all job postings on the platform</p>
      </div>

      {filterCompany && (
        <div className="company-filter-badge">
          <span>Showing jobs from: {filterCompany}</span>
          <button onClick={clearCompanyFilter} className="clear-filter">×</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchJobs} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="job-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>
        </div>

        <div className="job-stats">
          <div className="stat-item">
            <span className="stat-number">{jobs.length}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{jobs.filter(j => j.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)}</span>
            <span className="stat-label">Total Applicants</span>
          </div>
        </div>
      </div>

      <div className="job-list">
        {filteredAndSortedJobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or add a new job.</p>
          </div>
        ) : (
          filteredAndSortedJobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span className="company">{job.company}</span>
                    <span className="location">📍 {job.location}</span>
                    <span className="department">{job.department}</span>
                  </div>
                </div>
                <div className="job-status-section">
                  {getStatusBadge(job.status)}
                </div>
              </div>

              <div className="job-details">
                <div className="job-info-grid">
                  <div className="info-item">
                    <span className="label">Salary:</span>
                    <span className="value">{formatSalary(job.salary)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Type:</span>
                    <span className="value">{job.jobType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Experience:</span>
                    <span className="value">{job.experience}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Applicants:</span>
                    <span className="value">{job.applicants || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Posted:</span>
                    <span className="value">{formatDate(job.postedDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Deadline:</span>
                    <span className="value">{job.applicationDeadline ? formatDate(job.applicationDeadline) : 'No deadline'}</span>
                  </div>
                </div>
              </div>

              <div className="job-actions">
                <select
                  value={job.status}
                  onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
                  className="status-select"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>

                <button className="view-btn">👁️ View</button>
                <button className="edit-btn">✏️ Edit</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteJob(job._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="refresh-section">
        <button onClick={fetchJobs} className="refresh-btn">
          🔄 Refresh Jobs
        </button>
      </div>
    </div>
  );
};

export default AdminJobList;