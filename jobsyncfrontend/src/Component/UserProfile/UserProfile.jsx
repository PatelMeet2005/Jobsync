import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [profilePic, setProfilePic] = useState(sessionStorage.getItem('profilePic') || null)
  const [resume, setResume] = useState(sessionStorage.getItem('resume') || null)
  const [uploadMsg, setUploadMsg] = useState("")
  const [activeTab, setActiveTab] = useState('profile')
  const [about, setAbout] = useState(sessionStorage.getItem('about') || '')

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
    if (profilePic) sessionStorage.setItem('profilePic', profilePic)
    if (resume) sessionStorage.setItem('resume', resume)
    sessionStorage.setItem('about', about)
    setUser(editedUser)
    setIsEditing(false)
    setUploadMsg("")
    toast.success('Profile updated successfully!')
  }
  // Profile picture upload/preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setUploadMsg('Profile picture updated!');
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file.name);
      setUploadMsg('Resume uploaded!');
      toast.success('Resume uploaded!');
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user })
    setIsEditing(false)
    toast.info('Edit cancelled.')
  }

  const handleLogout = () => {
    sessionStorage.clear()
    toast.info('Logged out!')
    setTimeout(() => navigate('/'), 800)
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
        {/* Skeleton loader for profile */}
        <div className="profile-skeleton">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line" style={{width:'60%'}}></div>
          <div className="skeleton-line" style={{width:'40%'}}></div>
          <div className="skeleton-line" style={{width:'80%'}}></div>
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
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="profile-pro-container">
      <div className="profile-pro-sidebar">
        <div className="profile-picture-section">
          <div className="profile-picture">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">
                {user.userFirstName.charAt(0)}{user.userLastName.charAt(0)}
              </div>
            )}
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
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
        </div>
        <div className="sidebar-user-info">
          <h2>{user.userFirstName} {user.userLastName}</h2>
          <div className="sidebar-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          <div className="sidebar-email">{user.userEmail}</div>
        </div>
        <div className="sidebar-actions">
          {!isEditing ? (
            <button className="edit-btn" onClick={handleEdit}><i className="fas fa-edit"></i> Edit Profile</button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}><i className="fas fa-save"></i> Save</button>
              <button className="cancel-btn" onClick={handleCancel}><i className="fas fa-times"></i> Cancel</button>
            </>
          )}
          <button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
        <div className="profile-upload-section">
          <label htmlFor="resume-upload" className="upload-btn">
            <i className="fas fa-file-upload"></i> Upload Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleResumeChange}
          />
          {resume && <span className="resume-filename">{resume}</span>}
        </div>
        {uploadMsg && <div className="upload-msg">{uploadMsg}</div>}
      </div>
      <div className="profile-pro-main">
        <div className="profile-pro-tabs">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About Me</button>
          <button className={activeTab === 'resume' ? 'active' : ''} onClick={() => setActiveTab('resume')}>Resume</button>
          <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Jobs</button>
        </div>
        <div className="profile-pro-tab-content">
          {activeTab === 'profile' && (
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                {isEditing ? (
                  <div className="name-inputs">
                    <input type="text" name="userFirstName" value={editedUser.userFirstName} onChange={handleInputChange} placeholder="First Name" />
                    <input type="text" name="userLastName" value={editedUser.userLastName} onChange={handleInputChange} placeholder="Last Name" />
                  </div>
                ) : (
                  <span className="info-value">{user.userFirstName} {user.userLastName}</span>
                )}
              </div>
              <div className="info-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input type="email" name="userEmail" value={editedUser.userEmail} onChange={handleInputChange} placeholder="Email Address" />
                ) : (
                  <span className="info-value">{user.userEmail}</span>
                )}
              </div>
              <div className="info-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input type="tel" name="userPhoneNumber" value={editedUser.userPhoneNumber} onChange={handleInputChange} placeholder="Phone Number" />
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
          )}
          {activeTab === 'about' && (
            <div className="about-section">
              <label>About Me</label>
              {isEditing ? (
                <textarea
                  className="about-textarea"
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Write something about yourself..."
                  rows={6}
                />
              ) : (
                <div className="about-content">{about || <span className="about-placeholder">No bio added yet.</span>}</div>
              )}
            </div>
          )}
          {activeTab === 'resume' && (
            <div className="resume-section">
              <label>Resume</label>
              {resume ? (
                <div className="resume-content">
                  <i className="fas fa-file-alt"></i> {resume}
                </div>
              ) : (
                <span className="about-placeholder">No resume uploaded yet.</span>
              )}
            </div>
          )}
          {activeTab === 'jobs' && (
            <div className="jobs-section">
              <div className="profile-stats">
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
                  <div className="stat-content"><h3>0</h3><p>Jobs Applied</p></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-heart"></i></div>
                  <div className="stat-content"><h3>0</h3><p>Saved Jobs</p></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-eye"></i></div>
                  <div className="stat-content"><h3>0</h3><p>Profile Views</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      </>
  )
}

export default UserProfile