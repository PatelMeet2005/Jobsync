import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    totalJobs: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardStats();
    
    // Set up real-time updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardStats();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real data from backend APIs
      const [usersRes, employeesRes, jobsRes] = await Promise.all([
        axios.get('http://localhost:8000/user/getallusers'),
        axios.get('http://localhost:8000/employee/all'),
        axios.get('http://localhost:8000/employee/fetchjobs')
      ]);

      // Process jobs data to get status breakdown
      const jobs = jobsRes.data?.jobs || [];
      const totalJobs = jobs.length;
      const pendingJobs = jobs.filter(job => job.status?.toLowerCase() === 'pending').length;
      const acceptedJobs = jobs.filter(job => job.status?.toLowerCase() === 'accepted').length;
      const rejectedJobs = jobs.filter(job => job.status?.toLowerCase() === 'rejected').length;

      // Get users and employees data (APIs return arrays directly)
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const employees = Array.isArray(employeesRes.data) ? employeesRes.data : [];

      setStats({
        totalUsers: users.length,
        totalEmployees: employees.length,
        totalJobs: totalJobs,
        totalRequests: totalJobs, // Using total jobs as requests
        pendingRequests: pendingJobs,
        acceptedRequests: acceptedJobs,
        rejectedRequests: rejectedJobs
      });
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="last-updated">
          <span className="update-indicator">🔄</span>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button onClick={fetchDashboardStats} className="refresh-btn" title="Refresh now">
            ↻
          </button>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stats-grid">
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card employees">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>{stats.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
          </div>

          <div className="stat-card jobs">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>{stats.totalJobs}</h3>
              <p>Total Jobs</p>
            </div>
          </div>

          <div className="stat-card requests">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>
        </div>

        <div className="requests-breakdown">
          <h2>Request Status Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-card pending">
              <div className="breakdown-icon">⏳</div>
              <div className="breakdown-info">
                <h3>{stats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>

            <div className="breakdown-card accepted">
              <div className="breakdown-icon">✅</div>
              <div className="breakdown-info">
                <h3>{stats.acceptedRequests}</h3>
                <p>Accepted Requests</p>
              </div>
            </div>

            <div className="breakdown-card rejected">
              <div className="breakdown-icon">❌</div>
              <div className="breakdown-info">
                <h3>{stats.rejectedRequests}</h3>
                <p>Rejected Requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-content">
          <h2>Welcome to JobSync Admin Panel</h2>
          <p>
            Monitor and manage all aspects of the job portal from this central dashboard. 
            Use the statistics above to get a quick overview of platform activity.
          </p>
          <p>
            Navigate through the sidebar to access specific management sections for detailed operations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard