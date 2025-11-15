import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      pendingReviews: 0
    },
    recentJobs: [],
    employeeInfo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Get current user info from localStorage
  const getCurrentUser = () => {
    try {
      const userToken = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      if (userToken && userInfo) {
        return JSON.parse(userInfo);
      }
      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch only MY jobs (posted by current employee)
      const jobsResponse = await axios.get('http://localhost:8000/employee/myjobs', { headers });
      
      // Fetch all applications for the employee's jobs
      let allApplications = [];
      let totalApplications = 0;
      let pendingApplications = 0;
      
      try {
        const appsResponse = await axios.get('http://localhost:8000/applications', { headers });
        if (appsResponse.data && appsResponse.data.success) {
          allApplications = appsResponse.data.applications || [];
          totalApplications = allApplications.length;
          pendingApplications = allApplications.filter(app => 
            app.status === 'pending' || app.status === 'submitted'
          ).length;
        }
      } catch (appError) {
        console.warn('Could not fetch applications:', appError.message);
        // Continue with job data even if applications fail
      }
      
      // jobsResponse from myjobs endpoint returns array directly, not wrapped in success object
      const allJobs = Array.isArray(jobsResponse.data) ? jobsResponse.data : (jobsResponse.data.jobs || []);
      
      // Calculate statistics
      const totalJobs = allJobs.length;
      const activeJobs = allJobs.filter(job => job.status === 'pending').length;
      const acceptedJobs = allJobs.filter(job => job.status === 'accepted').length;
      
      // Create a map of job IDs to application counts
      const jobApplicationCounts = {};
      allApplications.forEach(app => {
        const jobId = app.jobId?._id || app.jobId;
        if (jobId) {
          jobApplicationCounts[jobId] = (jobApplicationCounts[jobId] || 0) + 1;
        }
      });
      
      // Get recent jobs (last 5) with real applicant counts
      const recentJobs = allJobs
        .sort((a, b) => new Date(b.postedDate || b.createdAt) - new Date(a.postedDate || a.createdAt))
        .slice(0, 5)
        .map(job => ({
          id: job._id,
          title: job.title,
          company: job.company?.name || job.company || 'N/A',
          location: job.company?.location || 'N/A',
          type: job.jobType || 'N/A',
          salary: job.salary ? `₹${job.salary}` : 'N/A',
          status: job.status || 'pending',
          postedDate: formatDate(job.postedDate || job.createdAt),
          applicants: jobApplicationCounts[job._id] || 0 // Real applicant count
        }));

      // Generate recent activity based on real applications
      const recentActivity = generateRecentActivity(allApplications.slice(0, 6), allJobs);

      setDashboardData({
        stats: {
          totalJobs,
          activeJobs,
          totalApplications, // Real total applications count
          pendingReviews: pendingApplications // Real pending applications count
        },
        recentJobs,
        recentActivity,
        employeeInfo: currentUser
      });
      
      setError('');
      setLastUpdated(new Date());
      toast.success('Dashboard updated successfully!');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Generate realistic activity feed from real applications
  const generateRecentActivity = (applications, allJobs) => {
    const activities = [];
    
    // Create a job lookup map
    const jobMap = {};
    if (allJobs) {
      allJobs.forEach(job => {
        jobMap[job._id] = job;
      });
    }

    applications.forEach((app) => {
      const jobId = app.jobId?._id || app.jobId;
      const job = jobMap[jobId];
      const jobTitle = app.jobTitle || job?.title || 'Unknown Job';
      const companyName = app.companyName || job?.company?.name || job?.company || app.jobId?.company?.name || 'Unknown Company';
      
      let action = '';
      switch (app.status) {
        case 'pending':
        case 'submitted':
          action = 'New application received for';
          break;
        case 'reviewed':
          action = 'Application reviewed for';
          break;
        case 'shortlisted':
          action = 'Candidate shortlisted for';
          break;
        case 'accepted':
          action = 'Application accepted for';
          break;
        case 'rejected':
          action = 'Application rejected for';
          break;
        default:
          action = 'Application update for';
      }
      
      activities.push({
        id: app._id,
        action,
        job: jobTitle,
        company: companyName,
        applicant: app.userName || app.name || app.email,
        time: formatDate(app.createdAt || app.submittedAt)
      });
    });

    return activities;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'neutral';
    }
  };

  // Calculate percentage change (mock data for now)
  const getStatChange = (current, statType) => {
    const changes = {
      totalJobs: Math.floor(Math.random() * 20) + 5,
      activeJobs: Math.floor(Math.random() * 10) + 2,
      totalApplications: Math.floor(Math.random() * 30) + 10,
      pendingReviews: current > 0 ? 'Review needed' : 'All clear'
    };
    return changes[statType];
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      fetchDashboardData();
    }, 100000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="employee-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-dashboard">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, {dashboardData.employeeInfo?.name || 'Employee'}! 👋</h1>
            <p className="subtitle">Here's what's happening with your job postings today</p>
          </div>
          <div className="header-badges">
            <span className="last-updated">
              <span className="update-icon">🕐</span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="quick-actions">
          <button 
            className="action-btn primary"
            onClick={fetchDashboardData}
          >
            <span className="btn-icon">🔄</span>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">💼</span>
          </div>
          <div className="stat-content">
            <div className="stat-info">
              <h3>{dashboardData.stats.totalJobs}</h3>
              <p>Total Jobs Posted</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-green">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">📋</span>
          </div>
          <div className="stat-content">
            <div className="stat-info">
              <h3>{dashboardData.stats.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-orange">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">⏳</span>
          </div>
          <div className="stat-content">
            <div className="stat-info">
              <h3>{dashboardData.stats.pendingReviews}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Jobs Section */}
        <div className="content-section jobs-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Recent Job Postings</h2>
              <span className="section-count">{dashboardData.recentJobs.length} Jobs</span>
            </div>
          </div>
          <div className="jobs-list">
            {dashboardData.recentJobs.length > 0 ? (
              dashboardData.recentJobs.map(job => (
                <div key={job.id} className="job-item">
                  <div className="job-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <span className={`job-status ${getStatusColor(job.status)}`}>
                        {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                    </div>
                    <div className="job-company-info">
                      <span className="company-name">
                        <span className="icon">🏢</span>
                        {job.company}
                      </span>
                    </div>
                  </div>
                  
                  <div className="job-details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💼</span>
                      <span className="detail-text">{job.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text">{job.salary}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span className="detail-text">{job.postedDate}</span>
                    </div>
                  </div>
                  
                  <div className="job-footer">
                    <div className="applicants-count">
                      <span className="applicants-icon">👥</span>
                      <span className="applicants-text">{job.applicants} Applicants</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <div className="no-data-icon">📭</div>
                <p>No recent job postings found</p>
                <button className="action-btn primary">Post Your First Job</button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="content-section activity-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Recent Activity</h2>
              <span className="activity-pulse"></span>
            </div>
          </div>
          <div className="activity-feed">
            {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-timeline">
                    <div className="activity-dot"></div>
                    <div className="activity-line"></div>
                  </div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-job">{activity.job}</p>
                    {activity.applicant && (
                      <p className="activity-applicant">
                        <span className="icon">👤</span>
                        {activity.applicant}
                      </p>
                    )}
                    <p className="activity-company">
                      <span className="icon">🏢</span>
                      {activity.company}
                    </p>
                    <span className="activity-time">
                      <span className="icon">🕐</span>
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <div className="no-activity-icon">📊</div>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Stats Chart */}
      {/* <div className="chart-section">
        <div className="section-header">
          <h2>Job Status Distribution</h2>
          <span className="chart-legend">
            <span className="legend-item">
              <span className="legend-color pending"></span> Pending
            </span>
            <span className="legend-item">
              <span className="legend-color accepted"></span> Accepted
            </span>
            <span className="legend-item">
              <span className="legend-color applications"></span> Applications
            </span>
          </span>
        </div>
        <div className="chart-container">
          <div className="stats-chart">
            <div className="chart-item">
              <div className="chart-bar pending" style={{height: `${Math.max((dashboardData.stats.activeJobs / dashboardData.stats.totalJobs) * 180, 30)}px`}}>
                <span className="chart-value">{dashboardData.stats.activeJobs}</span>
              </div>
              <span className="chart-label">Pending Jobs</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar accepted" style={{height: `${Math.max(((dashboardData.stats.totalJobs - dashboardData.stats.activeJobs) / dashboardData.stats.totalJobs) * 180, 30)}px`}}>
                <span className="chart-value">{dashboardData.stats.totalJobs - dashboardData.stats.activeJobs}</span>
              </div>
              <span className="chart-label">Accepted Jobs</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar applications" style={{height: `${Math.max(Math.min((dashboardData.stats.totalApplications / 200) * 180, 180), 30)}px`}}>
                <span className="chart-value">{dashboardData.stats.totalApplications}</span>
              </div>
              <span className="chart-label">Total Applications</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Actions Footer */}
      {/* <div className="dashboard-footer">
        <div className="footer-info">
          <div className="footer-stats">
            <div className="footer-stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{lastUpdated.toLocaleTimeString()}</span>
            </div>
            <div className="footer-stat-item">
              <span className="stat-label">Total Jobs</span>
              <span className="stat-value">{dashboardData.stats.totalJobs}</span>
            </div>
            <div className="footer-stat-item">
              <span className="stat-label">System Status</span>
              <span className="stat-value status-online">● Online</span>
            </div>
          </div>
        </div>
        <div className="footer-actions">
          <button className="footer-btn" onClick={fetchDashboardData}>
            <span>🔄</span> Refresh
          </button>
          <button className="footer-btn">
            <span>📊</span> Analytics
          </button>
          <button className="footer-btn">
            <span>⚙️</span> Settings
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default EmployeeDashboard;
