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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      // You can implement these API endpoints in your backend
      
      // For now, using mock data
      setTimeout(() => {
        setStats({
          totalUsers: 150,
          totalEmployees: 45,
          totalJobs: 89,
          totalRequests: 234,
          pendingRequests: 56,
          acceptedRequests: 145,
          rejectedRequests: 33
        });
        setLoading(false);
      }, 1000);

      // Uncomment and modify these when you have actual API endpoints
      /*
      const [usersRes, employeesRes, jobsRes, requestsRes] = await Promise.all([
        axios.get('http://localhost:8000/admin/users/count'),
        axios.get('http://localhost:8000/admin/employees/count'),
        axios.get('http://localhost:8000/admin/jobs/count'),
        axios.get('http://localhost:8000/admin/requests/stats')
      ]);

      setStats({
        totalUsers: usersRes.data.count,
        totalEmployees: employeesRes.data.count,
        totalJobs: jobsRes.data.count,
        totalRequests: requestsRes.data.total,
        pendingRequests: requestsRes.data.pending,
        acceptedRequests: requestsRes.data.accepted,
        rejectedRequests: requestsRes.data.rejected
      });
      setLoading(false);
      */
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
      <h1>Admin Dashboard</h1>
      
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