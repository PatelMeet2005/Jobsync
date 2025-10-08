import React from "react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  // Mock data for dashboard
  const stats = {
    totalJobs: 24,
    activeJobs: 8,
    totalApplications: 156,
    pendingReviews: 12
  };

  const recentJobs = [
    { id: 1, title: "Senior React Developer", company: "TechCorp", applicants: 23, status: "Active", postedDate: "2 days ago" },
    { id: 2, title: "Full Stack Engineer", company: "StartupXYZ", applicants: 18, status: "Active", postedDate: "5 days ago" },
    { id: 3, title: "UI/UX Designer", company: "DesignStudio", applicants: 31, status: "Closed", postedDate: "1 week ago" },
    { id: 4, title: "DevOps Engineer", company: "CloudTech", applicants: 15, status: "Active", postedDate: "3 days ago" }
  ];

  const recentActivity = [
    { id: 1, action: "New application received", job: "Senior React Developer", time: "2 hours ago" },
    { id: 2, action: "Job post approved", job: "Full Stack Engineer", time: "4 hours ago" },
    { id: 3, action: "Interview scheduled", job: "UI/UX Designer", time: "1 day ago" },
    { id: 4, action: "Application reviewed", job: "DevOps Engineer", time: "2 days ago" }
  ];

  return (
    <div className="employee-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, John! 👋</h1>
          <p>Here's what's happening with your job postings today</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn primary">+ Post New Job</button>
          <button className="action-btn secondary">View Analytics</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>{stats.totalJobs}</h3>
            <p>Total Jobs Posted</p>
          </div>
          <div className="stat-change positive">+12% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>{stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat-change positive">+3 new</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-change positive">+28% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingReviews}</h3>
            <p>Pending Reviews</p>
          </div>
          <div className="stat-change neutral">Review needed</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Jobs Section */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Job Postings</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="jobs-list">
            {recentJobs.map(job => (
              <div key={job.id} className="job-item">
                <div className="job-main">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <span className="posted-date">{job.postedDate}</span>
                </div>
                <div className="job-stats">
                  <span className="applicants">{job.applicants} applicants</span>
                  <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                </div>
                <div className="job-actions">
                  <button className="btn-sm">View</button>
                  <button className="btn-sm">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-feed">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p><strong>{activity.action}</strong></p>
                  <p className="job-name">{activity.job}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Chart Area */}
      <div className="chart-section">
        <h2>Application Trends</h2>
        <div className="chart-placeholder">
          <div className="chart-bars">
            <div className="bar" style={{height: '60%'}}><span>Mon</span></div>
            <div className="bar" style={{height: '80%'}}><span>Tue</span></div>
            <div className="bar" style={{height: '45%'}}><span>Wed</span></div>
            <div className="bar" style={{height: '90%'}}><span>Thu</span></div>
            <div className="bar" style={{height: '70%'}}><span>Fri</span></div>
            <div className="bar" style={{height: '35%'}}><span>Sat</span></div>
            <div className="bar" style={{height: '25%'}}><span>Sun</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
