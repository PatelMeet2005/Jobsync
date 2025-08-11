import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminUser.css";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'employees'
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchUsersAndEmployees();
  }, []);

const fetchUsersAndEmployees = async () => {
  try {
    setLoading(true);
    const response = await axios.get("http://localhost:8000/user/getallusers", {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 304) {
      console.log("Data not modified — using existing state");
      setLoading(false);
      return;
    }

    if (Array.isArray(response.data)) {
      // Map API fields to UI fields
      const formattedUsers = response.data.map((u) => ({
        _id: u._id,
        name: `${u.userFirstName} ${u.userLastName}`,
        email: u.userEmail,
        phone: u.userPhoneNumber,
        registeredDate: u.createdAt,
        lastLogin: u.updatedAt,
        profileCompleted: 80, // example default value
        skills: [], // example default value
        userType: u.role === "user" ? "jobseeker" : "employee",
      }));

      setUsers(formattedUsers);
      console.log("Fetched users:", formattedUsers);
    } else {
      console.error("Unexpected response format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};



  const handleDeleteUser = async (userId, userType) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      try {
        // TODO: Uncomment when backend is ready
        const endpoint = userType === 'jobseeker' ? 'user' : 'employee';
      const response = await axios.delete(`http://localhost:8000/${endpoint}/deleteuser/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setUsers(users.filter(user => user._id !== userId));
      console.log(`User ${userId} deleted`);

      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const filterAndSortData = (data) => {
    return data
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.company &&
            item.company.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.registeredDate) - new Date(a.registeredDate);
          case "oldest":
            return new Date(a.registeredDate) - new Date(b.registeredDate);
          case "name":
            return a.name.localeCompare(b.name);
          case "lastLogin":
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          default:
            return 0;
        }
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const currentData =
    activeTab === "users"
      ? filterAndSortData(users)
      : filterAndSortData(employees);

  return (
    <div className="admin-user-container">
      <div className="admin-user-header">
        <h1>User Management</h1>
        <p>Manage job seekers and employers on the platform</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsersAndEmployees} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="user-tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "employees" ? "active" : ""}`}
          onClick={() => setActiveTab("employees")}
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
              placeholder={`Search ${
                activeTab === "users" ? "Users" : "Employers"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">

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

      </div>

      {/* User List */}
      <div className="user-list">
        {currentData.length === 0 ? (
          <div className="no-users">
            <h3>
              No {activeTab === "users" ? "job seekers" : "employers"} found
            </h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          currentData.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <div className="user-main-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                  {activeTab === "employees" && user.company && (
                    <p className="user-company">
                      {user.company} - {user.position}
                    </p>
                  )}
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
                    <span className="value">
                      {formatDate(user.registeredDate)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Last Login:</span>
                    <span className="value">{formatDate(user.lastLogin)}</span>
                  </div>
                  {/* <div className="info-item">
                    <span className="label">Profile:</span>
                    <span className="value">
                      {user.profileCompleted}% Complete
                    </span>
                  </div> */}

                  {activeTab === "users" ? (
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
                        <span className="value">
                          {user.skills?.join(", ") || "Not specified"}
                        </span>
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


              </div>

              <div className="user-actions">

                <button className="view-btn"> View Profile</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id, user.userType)}
                >
                   Delete
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
