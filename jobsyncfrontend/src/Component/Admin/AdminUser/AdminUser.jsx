import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUser.css';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'employees'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchUsersAndEmployees();
  }, []);

  const fetchUsersAndEmployees = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when backend is ready
      // const [usersResponse, employeesResponse] = await Promise.all([
      //   axios.get('http://localhost:8000/admin/users', {
      //     headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      //   }),
      //   axios.get('http://localhost:8000/admin/employees', {
      //     headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      //   })
      // ]);

      // if (usersResponse.data.status === 'success') {
      //   setUsers(usersResponse.data.users || []);
      // }
      // if (employeesResponse.data.status === 'success') {
      //   setEmployees(employeesResponse.data.employees || []);
      // }

      // Mock data for demonstration
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          location: 'New York, NY',
          registeredDate: '2025-06-15T10:30:00Z',
          status: 'active',
          profileCompleted: 85,
          appliedJobs: 12,
          savedJobs: 8,
          userType: 'jobseeker',
          lastLogin: '2025-08-03T14:20:00Z',
          skills: ['JavaScript', 'React', 'Node.js']
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1-555-0124',
          location: 'San Francisco, CA',
          registeredDate: '2025-06-20T09:15:00Z',
          status: 'active',
          profileCompleted: 92,
          appliedJobs: 18,
          savedJobs: 15,
          userType: 'jobseeker',
          lastLogin: '2025-08-04T11:45:00Z',
          skills: ['Python', 'Django', 'PostgreSQL']
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          phone: '+1-555-0125',
          location: 'Austin, TX',
          registeredDate: '2025-07-01T16:45:00Z',
          status: 'inactive',
          profileCompleted: 45,
          appliedJobs: 3,
          savedJobs: 12,
          userType: 'jobseeker',
          lastLogin: '2025-07-15T09:30:00Z',
          skills: ['Java', 'Spring Boot']
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@email.com',
          phone: '+1-555-0126',
          location: 'Seattle, WA',
          registeredDate: '2025-07-10T12:00:00Z',
          status: 'active',
          profileCompleted: 78,
          appliedJobs: 7,
          savedJobs: 20,
          userType: 'jobseeker',
          lastLogin: '2025-08-04T08:15:00Z',
          skills: ['UX Design', 'Figma', 'Adobe XD']
        }
      ]);

      setEmployees([
        {
          _id: 'e1',
          name: 'David Chen',
          email: 'david.chen@techsolutions.com',
          phone: '+1-555-0201',
          company: 'Tech Solutions Inc.',
          position: 'HR Manager',
          department: 'Human Resources',
          registeredDate: '2025-05-10T14:20:00Z',
          status: 'active',
          profileCompleted: 95,
          postedJobs: 15,
          activeJobs: 8,
          userType: 'employer',
          lastLogin: '2025-08-04T13:30:00Z',
          companySize: '500-1000'
        },
        {
          _id: 'e2',
          name: 'Lisa Rodriguez',
          email: 'lisa.rodriguez@innovationcorp.com',
          phone: '+1-555-0202',
          company: 'Innovation Corp',
          position: 'Talent Acquisition Specialist',
          department: 'Recruitment',
          registeredDate: '2025-05-25T11:15:00Z',
          status: 'active',
          profileCompleted: 88,
          postedJobs: 22,
          activeJobs: 12,
          userType: 'employer',
          lastLogin: '2025-08-04T10:45:00Z',
          companySize: '1000+'
        },
        {
          _id: 'e3',
          name: 'Robert Kim',
          email: 'robert.kim@creativestudio.com',
          phone: '+1-555-0203',
          company: 'Creative Studio',
          position: 'Creative Director',
          department: 'Design',
          registeredDate: '2025-06-05T09:30:00Z',
          status: 'pending',
          profileCompleted: 67,
          postedJobs: 5,
          activeJobs: 3,
          userType: 'employer',
          lastLogin: '2025-08-02T16:20:00Z',
          companySize: '50-100'
        },
        {
          _id: 'e4',
          name: 'Emily Davis',
          email: 'emily.davis@startupxyz.com',
          phone: '+1-555-0204',
          company: 'Startup XYZ',
          position: 'Founder & CEO',
          department: 'Executive',
          registeredDate: '2025-06-18T15:45:00Z',
          status: 'active',
          profileCompleted: 82,
          postedJobs: 8,
          activeJobs: 5,
          userType: 'employer',
          lastLogin: '2025-08-04T12:10:00Z',
          companySize: '10-50'
        }
      ]);

    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus, userType) => {
    try {
      // TODO: Uncomment when backend is ready
      // const endpoint = userType === 'jobseeker' ? 'users' : 'employees';
      // const response = await axios.patch(`http://localhost:8000/admin/${endpoint}/${userId}/status`, 
      //   { status: newStatus },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );

      // For now, update locally
      if (userType === 'jobseeker') {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        setEmployees(employees.map(employee => 
          employee._id === userId ? { ...employee, status: newStatus } : employee
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // TODO: Uncomment when backend is ready
        // const endpoint = userType === 'jobseeker' ? 'users' : 'employees';
        // const response = await axios.delete(`http://localhost:8000/admin/${endpoint}/${userId}`, {
        //   headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        // });

        // For now, delete locally
        if (userType === 'jobseeker') {
          setUsers(users.filter(user => user._id !== userId));
        } else {
          setEmployees(employees.filter(employee => employee._id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const filterAndSortData = (data) => {
    return data
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.registeredDate) - new Date(a.registeredDate);
          case 'oldest':
            return new Date(a.registeredDate) - new Date(b.registeredDate);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'lastLogin':
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          default:
            return 0;
        }
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      pending: 'status-pending',
      suspended: 'status-suspended'
    };
    return <span className={`status-badge ${statusClasses[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-user-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'users' ? filterAndSortData(users) : filterAndSortData(employees);

  return (
    <div className="admin-user-container">
      <div className="admin-user-header">
        <h1>User Management</h1>
        <p>Manage job seekers and employers on the platform</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsersAndEmployees} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="user-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Job Seekers ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employers ({employees.length})
        </button>
      </div>

      {/* Controls */}
      <div className="user-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'users' ? 'job seekers' : 'employers'}...`}
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
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="lastLogin">Last Login</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{currentData.length}</span>
            <span className="stat-label">Total {activeTab === 'users' ? 'Users' : 'Employers'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{currentData.filter(item => item.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{currentData.filter(item => item.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="user-list">
        {currentData.length === 0 ? (
          <div className="no-users">
            <h3>No {activeTab === 'users' ? 'job seekers' : 'employers'} found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          currentData.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <div className="user-main-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                  {activeTab === 'employees' && user.company && (
                    <p className="user-company">{user.company} - {user.position}</p>
                  )}
                </div>
                <div className="user-status-section">
                  {getStatusBadge(user.status)}
                </div>
              </div>

              <div className="user-details">
                <div className="user-info-grid">
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{user.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Registered:</span>
                    <span className="value">{formatDate(user.registeredDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Last Login:</span>
                    <span className="value">{formatDate(user.lastLogin)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Profile:</span>
                    <span className="value">{user.profileCompleted}% Complete</span>
                  </div>

                  {activeTab === 'users' ? (
                    <>
                      <div className="info-item">
                        <span className="label">Location:</span>
                        <span className="value">{user.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Applied Jobs:</span>
                        <span className="value">{user.appliedJobs}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Saved Jobs:</span>
                        <span className="value">{user.savedJobs}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Skills:</span>
                        <span className="value">{user.skills?.join(', ') || 'Not specified'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-item">
                        <span className="label">Department:</span>
                        <span className="value">{user.department}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Posted Jobs:</span>
                        <span className="value">{user.postedJobs}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Active Jobs:</span>
                        <span className="value">{user.activeJobs}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Company Size:</span>
                        <span className="value">{user.companySize}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="user-progress">
                  <div className="progress-label">Profile Completion</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${user.profileCompleted}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{user.profileCompleted}%</span>
                </div>
              </div>

              <div className="user-actions">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusUpdate(user._id, e.target.value, user.userType)}
                  className="status-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button className="view-btn">👁️ View Profile</button>
                <button className="edit-btn">✏️ Edit</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id, user.userType)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="refresh-section">
        <button onClick={fetchUsersAndEmployees} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AdminUser;
