import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import { useTokenValidation } from '../../utils/tokenValidation'
import SessionWarningBanner from '../SessionWarningBanner/SessionWarningBanner'

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
  const [applications, setApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [appsError, setAppsError] = useState(null)
  const [showWarningBanner, setShowWarningBanner] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  // Validate token on mount
  const tokenValidation = useTokenValidation()

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

  // Show warning banner if token validation fails
  useEffect(() => {
    if (tokenValidation.needsRelogin) {
      setShowWarningBanner(true)
    }
  }, [tokenValidation])

  useEffect(() => {
    // Fetch user's applications when Jobs tab becomes active - using new cached fields
    let intervalId = null
    const fetchUserApplications = async (isPollingCall = false) => {
      try {
        if (isPollingCall) {
          setIsPolling(true)
        } else {
          setAppsLoading(true)
        }
        setAppsError(null)
        const token = sessionStorage.getItem('token') || localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')
        let userId = sessionStorage.getItem('userId') || sessionStorage.getItem('_id') || localStorage.getItem('userId') || localStorage.getItem('_id')
        
        // Extract user ID from JWT token if not in storage
        try {
          const rawToken = token || sessionStorage.getItem('token') || localStorage.getItem('token')
          if (rawToken) {
            const parts = rawToken.split('.')
            if (parts.length === 3) {
              const payload = JSON.parse(window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
              userId = userId || payload.id || payload._id || payload.userId || payload.uid || payload.sub
            }
          }
        } catch (err) {
          console.warn('Could not decode token to extract user id', err)
        }

        // Build query params with user identifiers
        const params = {}
        if (userId) params.applicant = userId
        else if (userEmail) params.email = userEmail

        const res = await axios.get('http://localhost:8000/applications/public', { headers, params })
        if (res.data && res.data.success && Array.isArray(res.data.applications)) {
          const allApps = res.data.applications || []
          console.log(`Fetched ${allApps.length} total applications from server`);
          
          // Filter applications to only those belonging to current user
          // Now using cached applicantId field for faster filtering
          const myApps = allApps.filter(a => {
            // Check using new cached applicantId string field (fast)
            if (userId && a.applicantId && String(a.applicantId) === String(userId)) return true
            
            // Fallback to populated applicant object (slower, for backward compatibility)
            const applicantId = a.applicant && (typeof a.applicant === 'string' ? a.applicant : (a.applicant._id || a.applicant.id || a.applicant))
            if (userId && applicantId && String(applicantId) === String(userId)) return true
            
            // Check by email
            if (userEmail && a.email === userEmail) return true
            
            return false
          })

          // Merge with locally cached applied applications as fallback for offline scenarios
          // IMPORTANT: Server data ALWAYS takes precedence over cached data
          try {
            const cached = JSON.parse(sessionStorage.getItem('appliedApplications') || '[]') || [];
            const serverAppIds = new Set(allApps.map(sa => sa._id).filter(Boolean));

            // Remove cached entries that are now on server (server has the latest data)
            const filteredCached = cached.filter(c => !serverAppIds.has(c._id));
            
            // Update cache to only keep apps not yet on server
            try { 
              sessionStorage.setItem('appliedApplications', JSON.stringify(filteredCached)); 
            } catch(e) {
              console.warn('Could not update cached applications', e)
            }

            // Server apps come FIRST (they have latest status and responses)
            // Only add cached apps that don't exist on server yet
            const merged = [...myApps]; // Start with server data (priority)
            filteredCached.forEach(c => {
              if (!merged.some(a => a._id === c._id)) {
                merged.push(c); // Add cached apps that server doesn't have yet
              }
            });
            
            console.log(`Loaded ${myApps.length} applications from server, ${filteredCached.length} from cache`);
            setApplications(merged);
          } catch (err) {
            console.warn('Error merging cached applications', err)
            setApplications(myApps); // Fallback to server data only
          }
        } else {
          setAppsError('Could not load applications')
        }
      } catch (err) {
        console.error('Error loading user applications', err)
        setAppsError(err.response?.data?.message || err.message || 'Error loading applications')
      } finally {
        setAppsLoading(false)
        setIsPolling(false)
      }
    }

    if (activeTab === 'jobs') {
      fetchUserApplications(false) // Initial load
      // Poll every 8 seconds for real-time updates
      intervalId = setInterval(() => {
        console.log('🔄 Polling for application updates...');
        fetchUserApplications(true); // Polling call
      }, 8000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [activeTab])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
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
      </div>
    )
  }

  if (!user.userFirstName && !user.userLastName) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Not Found</h1>
          <p>Unable to load user profile. Please log in again.</p>
          <button className="edit-btn" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i> Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Show warning banner if token needs refresh */}
      {showWarningBanner && tokenValidation.needsRelogin && (
        <SessionWarningBanner 
          message={tokenValidation.message} 
          onClose={() => setShowWarningBanner(false)}
        />
      )}
      
      <div className="profile-pro-container">
        <div className="profile-pro-sidebar">
          <div className="profile-picture-section">
            <div className="profile-picture">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar">
                  {user.userFirstName.charAt(0)}
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
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <i className="fas fa-user"></i> Profile
            </button>
            <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
              <i className="fas fa-info-circle"></i> About Me
            </button>
            <button className={activeTab === 'resume' ? 'active' : ''} onClick={() => setActiveTab('resume')}>
              <i className="fas fa-file-alt"></i> Resume
            </button>
            <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>
              <i className="fas fa-briefcase"></i> Jobs Applied
            </button>
          </div>
          
          <div className="profile-pro-tab-content">
            {activeTab === 'profile' && (
              <div className="profile-info">
                <h3 className="section-title"><i className="fas fa-user-circle"></i> Personal Information</h3>
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
                <h3 className="section-title"><i className="fas fa-pencil-alt"></i> About Me</h3>
                {isEditing ? (
                  <textarea
                    className="about-textarea"
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    placeholder="Write something about yourself..."
                    rows={8}
                  />
                ) : (
                  <div className="about-content">{about || <span className="about-placeholder">No bio added yet. Click Edit Profile to add one.</span>}</div>
                )}
              </div>
            )}
            
            {activeTab === 'resume' && (
              <div className="resume-section">
                <h3 className="section-title"><i className="fas fa-file-pdf"></i> Resume</h3>
                {resume ? (
                  <div className="resume-content">
                    <div className="resume-file-card">
                      <i className="fas fa-file-alt"></i>
                      <div className="resume-file-info">
                        <h4>{resume}</h4>
                        <p>Uploaded resume document</p>
                      </div>
                      <button className="download-btn"><i className="fas fa-download"></i> Download</button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-file-upload"></i>
                    <p>No resume uploaded yet.</p>
                    <label htmlFor="resume-upload-main" className="upload-main-btn">
                      <i className="fas fa-cloud-upload-alt"></i> Upload Resume
                    </label>
                    <input
                      id="resume-upload-main"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handleResumeChange}
                    />
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'jobs' && (
              <div className="jobs-section">
                <div className="section-header">
                  <h3 className="section-title"><i className="fas fa-briefcase"></i> Job Applications</h3>
                  {isPolling && (
                    <div className="polling-indicator" title="Checking for updates...">
                      <i className="fas fa-sync fa-spin"></i>
                      <span>Updating...</span>
                    </div>
                  )}
                </div>
                <div className="profile-stats">
                  <div className="stat-card">
                    <div className="stat-icon"><i className="fas fa-paper-plane"></i></div>
                    <div className="stat-content">
                      <h3>{applications.length}</h3>
                      <p>Total Applied</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon accepted"><i className="fas fa-check-circle"></i></div>
                    <div className="stat-content">
                      <h3>{applications.filter(a => a.status === 'accepted').length}</h3>
                      <p>Accepted</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon pending"><i className="fas fa-clock"></i></div>
                    <div className="stat-content">
                      <h3>{applications.filter(a => a.status === 'pending' || a.status === 'reviewed').length}</h3>
                      <p>Pending</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon rejected"><i className="fas fa-times-circle"></i></div>
                    <div className="stat-content">
                      <h3>{applications.filter(a => a.status === 'rejected').length}</h3>
                      <p>Rejected</p>
                    </div>
                  </div>
                </div>
                
                <div className="applications-list">
                  {appsLoading ? (
                    <div className="loading-small"><i className="fas fa-spinner fa-spin"></i> Loading applications...</div>
                  ) : appsError ? (
                    <div className="error-state"><i className="fas fa-exclamation-circle"></i> {appsError}</div>
                  ) : applications.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-inbox"></i>
                      <p>You haven't applied to any jobs yet.</p>
                      <button className="browse-jobs-btn" onClick={() => navigate('/')}>
                        <i className="fas fa-search"></i> Browse Jobs
                      </button>
                    </div>
                  ) : (
                    applications.map(app => {
                      // Use new cached fields first (faster, no population needed)
                      const jobTitle = app.jobTitle || app.jobId?.title || (typeof app.jobId === 'string' ? 'Job Details' : 'Unknown Job')
                      const jobCompany = app.companyName || app.jobId?.company || ''
                      const jobIdValue = app.jobId?._id || (typeof app.jobId === 'string' ? app.jobId : null)
                      
                      // Debug: Log application data to see status and responses
                      if (app._id) {
                        console.log(`Application ${app._id}: status="${app.status}", responses:`, app.responses?.length || 0);
                      }
                      
                      return (
                        <div className="application-card" key={app._id}>
                          <div className="app-header">
                            <div className="app-title-section">
                              <h4 className="app-job-title">{jobTitle}</h4>
                              {jobCompany && <p className="app-company"><i className="fas fa-building"></i> {jobCompany}</p>}
                              <p className="app-date"><i className="fas fa-calendar"></i> Applied on {formatDate(app.createdAt)}</p>
                            </div>
                            <div className="app-status-section">
                              <span className={`status-badge status-${app.status}`}>
                                <i className={`fas fa-${app.status === 'accepted' ? 'check-circle' : app.status === 'rejected' ? 'times-circle' : 'clock'}`}></i>
                                {app.status}
                              </span>
                            </div>
                          </div>
                          
                          {app.responses && app.responses.length > 0 && (
                            <div className="app-responses">
                              <h5><i className="fas fa-comments"></i> Employer Responses:</h5>
                              {app.responses.map((r, i) => (
                                <div className="response-item" key={i}>
                                  <div className="response-header">
                                    <strong>{r.sender || 'Employer'}</strong>
                                    <span className="response-date">{r.createdAt ? formatDate(r.createdAt) : ''}</span>
                                  </div>
                                  <p className="response-message">{r.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="app-actions">
                            {app.status === 'rejected' && (
                              <button className="reapply-btn" onClick={() => {
                                if (jobIdValue) navigate(`/jobs/${jobIdValue}`);
                                else toast.info('Original job id not available to reapply.')
                              }}>
                                <i className="fas fa-redo"></i> Apply Again
                              </button>
                            )}
                            <button className="view-job-btn" onClick={() => {
                              if (jobIdValue) navigate(`/jobs/${jobIdValue}`);
                              else toast.info('Job details not available.')
                            }}>
                              <i className="fas fa-eye"></i> View Job
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
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