import React, { useState, useEffect } from "react";
import axios from "axios";
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
      
      // Fetch all jobs
      const jobsResponse = await axios.get('http://localhost:8000/employee/fetchjobs');
      
      if (jobsResponse.data.success) {
        const allJobs = jobsResponse.data.jobs;
        
        // Calculate statistics
        const totalJobs = allJobs.length;
        const activeJobs = allJobs.filter(job => job.jobStatus === 'pending').length;
        const acceptedJobs = allJobs.filter(job => job.jobStatus === 'accepted').length;
        const pendingJobs = allJobs.filter(job => job.jobStatus === 'pending').length;
        
        // Get recent jobs (last 5)
        const recentJobs = allJobs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(job => ({
            id: job._id,
            title: job.jobTitle,
            company: job.jobCompany,
            location: job.jobLocation,
            type: job.jobType,
            salary: job.jobSalary,
            status: job.jobStatus,
            postedDate: formatDate(job.createdAt),
            applicants: Math.floor(Math.random() * 50) + 1 // Mock applicant count
          }));

        // Generate recent activity based on jobs
        const recentActivity = generateRecentActivity(allJobs.slice(0, 4));

        setDashboardData({
          stats: {
            totalJobs,
            activeJobs,
            totalApplications: acceptedJobs + Math.floor(Math.random() * 100), // Mock total applications
            pendingReviews: pendingJobs
          },
          recentJobs,
          recentActivity,
          employeeInfo: currentUser
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
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

  // Generate realistic activity feed
  const generateRecentActivity = (jobs) => {
    const activities = [];
    const actionTypes = [
      "New application received for",
      "Job post approved:",
      "Interview scheduled for",
      "Application reviewed for",
      "Job post updated:",
      "Candidate shortlisted for"
    ];

    jobs.forEach((job, index) => {
      activities.push({
        id: job._id,
        action: actionTypes[index % actionTypes.length],
        job: job.jobTitle,
        company: job.jobCompany,
        time: formatDate(job.createdAt)
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
          <h1>Welcome back, {dashboardData.employeeInfo?.name || 'Employee'}! 👋</h1>
          <p>Here's what's happening with your job postings today</p>
        </div>
        <div className="quick-actions">
          <button 
            className="action-btn primary"
            onClick={() => window.location.href = '/employee/addjob'}
          >
            + Post New Job
          </button>
          <button 
            className="action-btn secondary"
            onClick={fetchDashboardData}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>{dashboardData.stats.totalJobs}</h3>
            <p>Total Jobs Posted</p>
          </div>
          <div className="stat-change positive">
            +{getStatChange(dashboardData.stats.totalJobs, 'totalJobs')}% this month
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>{dashboardData.stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat-change positive">
            +{getStatChange(dashboardData.stats.activeJobs, 'activeJobs')} new
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{dashboardData.stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-change positive">
            +{getStatChange(dashboardData.stats.totalApplications, 'totalApplications')}% this week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{dashboardData.stats.pendingReviews}</h3>
            <p>Pending Reviews</p>
          </div>
          <div className="stat-change neutral">
            {getStatChange(dashboardData.stats.pendingReviews, 'pendingReviews')}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Jobs Section */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Job Postings ({dashboardData.recentJobs.length})</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="jobs-list">
            {dashboardData.recentJobs.length > 0 ? (
              dashboardData.recentJobs.map(job => (
                <div key={job.id} className="job-item">
                  <div className="job-main">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <p className="job-details">
                      📍 {job.location} • 💼 {job.type} • 💰 {job.salary}
                    </p>
                    <span className="posted-date">{job.postedDate}</span>
                  </div>
                  <div className="job-stats">
                    <span className="applicants">{job.applicants} applicants</span>
                    <span className={`status ${getStatusColor(job.status)}`}>
                      {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                    </span>
                  </div>
                  <div className="job-actions">
                    <button className="btn-sm">View</button>
                    <button className="btn-sm">Edit</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No recent job postings found</p>
                <button className="action-btn primary">Post Your First Job</button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-feed">
            {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p><strong>{activity.action}</strong></p>
                    <p className="job-name">{activity.job}</p>
                    <p className="company-name">{activity.company}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Stats Chart */}
      <div className="chart-section">
        <h2>Job Status Distribution</h2>
        <div className="chart-placeholder">
          <div className="stats-chart">
            <div className="chart-item">
              <div className="chart-bar pending" style={{height: `${(dashboardData.stats.activeJobs / dashboardData.stats.totalJobs) * 100 || 0}%`}}>
                <span className="chart-label">Pending</span>
                <span className="chart-value">{dashboardData.stats.activeJobs}</span>
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-bar accepted" style={{height: `${((dashboardData.stats.totalJobs - dashboardData.stats.activeJobs) / dashboardData.stats.totalJobs) * 100 || 0}%`}}>
                <span className="chart-label">Accepted</span>
                <span className="chart-value">{dashboardData.stats.totalJobs - dashboardData.stats.activeJobs}</span>
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-bar applications" style={{height: `${Math.min((dashboardData.stats.totalApplications / 200) * 100, 100)}%`}}>
                <span className="chart-label">Applications</span>
                <span className="chart-value">{dashboardData.stats.totalApplications}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="dashboard-footer">
        <div className="footer-stats">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <p>Total jobs in system: {dashboardData.stats.totalJobs}</p>
        </div>
        <div className="footer-actions">
          <button className="footer-btn" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
          <button className="footer-btn">
            📊 Full Analytics
          </button>
          <button className="footer-btn">
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
