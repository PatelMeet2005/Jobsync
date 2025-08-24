import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'

const UserProfile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPhoneNumber: '',
    role: '',
    createdAt: new Date().toISOString().split('T')[0]
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    // Fetch user data from sessionStorage
    const userData = {
      userFirstName: sessionStorage.getItem('userFirstName') || '',
      userLastName: sessionStorage.getItem('userLastName') || '',
      userEmail: sessionStorage.getItem('userEmail') || '',
      userPhoneNumber: sessionStorage.getItem('userPhoneNumber') || '',
      role: sessionStorage.getItem('role') || 'user',
      createdAt: sessionStorage.getItem('createdAt') || new Date().toISOString().split('T')[0]
    }
    
    setUser(userData)
    setEditedUser(userData)
    setIsLoading(false)
  }, [navigate])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // Update sessionStorage with new user data
    sessionStorage.setItem('userFirstName', editedUser.userFirstName)
    sessionStorage.setItem('userLastName', editedUser.userLastName)
    sessionStorage.setItem('userEmail', editedUser.userEmail)
    sessionStorage.setItem('userPhoneNumber', editedUser.userPhoneNumber)
    
    setUser(editedUser)
    setIsEditing(false)
    
    // Show success message (you could add a toast notification here)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setEditedUser({ ...user })
    setIsEditing(false)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check if user data is available
  if (!user.userFirstName && !user.userLastName) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Not Found</h1>
          <p>Unable to load user profile. Please log in again.</p>
          <button className="edit-btn" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-picture-section">
            <div className="profile-picture">
              <div className="profile-avatar">
                {user.userFirstName.charAt(0)}{user.userLastName.charAt(0)}
              </div>
              <div className="profile-picture-overlay">
                <label htmlFor="profile-picture-input" className="upload-btn">
                  <i className="fas fa-camera"></i>
                  Change Photo
                </label>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-actions">
              {!isEditing ? (
                <div className="action-buttons">
                  <button className="edit-btn" onClick={handleEdit}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                {isEditing ? (
                  <div className="name-inputs">
                    <input
                      type="text"
                      name="userFirstName"
                      value={editedUser.userFirstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="userLastName"
                      value={editedUser.userLastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <span className="info-value">
                    {user.userFirstName} {user.userLastName}
                  </span>
                )}
              </div>

              <div className="info-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="userEmail"
                    value={editedUser.userEmail}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                ) : (
                  <span className="info-value">{user.userEmail}</span>
                )}
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="userPhoneNumber"
                    value={editedUser.userPhoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                ) : (
                  <span className="info-value">{user.userPhoneNumber}</span>
                )}
              </div>

              <div className="info-group">
                <label>Account Type</label>
                <span className="info-value role-badge">
                  <i className={`fas fa-${user.role === 'admin' ? 'shield-alt' : 'user'}`}></i>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              <div className="info-group">
                <label>Member Since</label>
                <span className="info-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Jobs Applied</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Saved Jobs</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Profile Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile