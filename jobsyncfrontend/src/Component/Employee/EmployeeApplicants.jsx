import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
  FaUserTie,
  FaEnvelope,
  FaBriefcase,
  FaFileDownload,
  FaCommentDots,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaReply,
  FaPaperPlane,
  FaTimes,
  FaCheck,
  FaBan,
  FaUserCircle,
  FaInbox
} from 'react-icons/fa';
import "./EmployeeApplicants.css";

const EmployeeApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('http://localhost:8000/applications', { headers });
      if (res.data && res.data.success) {
        setApplications(res.data.applications || []);
        setError('');
      } else {
        setError('Failed to load applications');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Error loading applications';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStartReply = (appId) => {
    setReplyingTo(appId);
    setReplyMessage('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyMessage('');
  };

  const handleSendReply = async (appId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(`http://localhost:8000/applications/${appId}/respond`, { message: replyMessage }, { headers });
      if (res.data && res.data.success) {
        // update local application
        setApplications(prev => prev.map(a => a._id === appId ? res.data.application : a));
        setReplyingTo(null);
        setReplyMessage('');
      } else {
        alert('Failed to send reply');
      }
    } catch (err) {
      console.error('Reply error', err);
      alert('Error sending reply');
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(`http://localhost:8000/applications/${appId}/respond`, { message: '', status: newStatus }, { headers });
      if (res.data && res.data.success) {
        setApplications(prev => prev.map(a => a._id === appId ? res.data.application : a));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Status update error', err);
      alert('Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <span className="status-badge status-pending">
            <FaHourglassHalf />
            <span>Pending</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="status-badge status-reviewed">
            <FaEye />
            <span>Reviewed</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="status-badge status-accepted">
            <FaCheckCircle />
            <span>Accepted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="status-badge status-rejected">
            <FaTimesCircle />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="status-badge status-pending">
            <FaHourglassHalf />
            <span>{status || 'Pending'}</span>
          </span>
        );
    }
  };

  return (
    <div className="employee-applicants">
      <div className="header-section">
        <div className="header-icon">
          <FaUsers />
        </div>
        <h2>Job Applicants</h2>
        <p>Manage and respond to candidate applications</p>
        {applications.length > 0 && (
          <div className="stats">
            <span className="stat-badge">
              <FaUserTie />
              <span>{applications.length} Total Applicant{applications.length !== 1 ? 's' : ''}</span>
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner-icon" />
          <p>Loading applications...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error Loading Applications</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaInbox />
              </div>
              <h3>No Applications Yet</h3>
              <p>Applications from candidates will appear here once they start applying to your job postings.</p>
            </div>
          ) : (
            applications.map(app => (
              <div className="application-card" key={app._id}>
                <div className="app-left">
                  <div className="applicant-header">
                    <div className="applicant-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="applicant-info">
                      <h3>{
                        app.name ||
                        app.applicant?.employeename ||
                        ((app.applicant?.userFirstName || app.applicant?.userLastName) ? `${(app.applicant?.userFirstName || '')} ${(app.applicant?.userLastName || '')}`.trim() : 'Applicant')
                      }</h3>
                      <p className="app-email">
                        <FaEnvelope />
                        <span>{app.email || app.applicant?.userEmail || app.applicant?.employeeemail}</span>
                      </p>
                    </div>
                  </div>

                  <div className="app-details">
                    <div className="detail-item">
                      <FaBriefcase />
                      <span className="detail-label">Applied for:</span>
                      <span className="detail-value">{app.jobId?.title || 'Unknown Position'}</span>
                    </div>

                    {app.resumePath && (
                      <div className="resume-download">
                        <a href={`http://localhost:8000${app.resumePath}`} target="_blank" rel="noreferrer" className="download-link">
                          <FaFileDownload />
                          <span>Download Resume</span>
                        </a>
                      </div>
                    )}

                    {app.message && (
                      <div className="applicant-message">
                        <div className="message-header">
                          <FaCommentDots />
                          <span>Cover Letter</span>
                        </div>
                        <p>{app.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="app-right">
                  <div className="status-section">
                    <span className="status-label">Status:</span>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="responses">
                    <h4>
                      <FaReply />
                      <span>Responses</span>
                    </h4>
                    <div className="responses-content">
                      {app.responses && app.responses.length > 0 ? (
                        app.responses.map((r, idx) => (
                          <div key={idx} className="response-item">
                            <div className="response-header">
                              <FaUserCircle className="response-avatar" />
                              <small className="response-sender">{r.sender}</small>
                            </div>
                            <p className="response-message">{r.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-responses">
                          <FaInbox />
                          <span>No responses yet</span>
                        </p>
                      )}
                    </div>

                    <div className="actions-row">
                      {replyingTo === app._id ? (
                        <div className="reply-box">
                          <textarea 
                            value={replyMessage} 
                            onChange={e => setReplyMessage(e.target.value)} 
                            placeholder="Write your reply to the applicant..."
                            rows="4"
                          />
                          <div className="reply-actions">
                            <button onClick={() => handleSendReply(app._id)} className="btn btn-primary">
                              <FaPaperPlane />
                              <span>Send</span>
                            </button>
                            <button onClick={handleCancelReply} className="btn btn-secondary">
                              <FaTimes />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => handleStartReply(app._id)} className="btn btn-reply">
                          <FaReply />
                          <span>Reply</span>
                        </button>
                      )}

                      {!['accepted','rejected'].includes(app.status) && (
                        <div className="status-actions">
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                            className="btn btn-accept"
                          >
                            <FaCheck />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                            className="btn btn-reject"
                          >
                            <FaBan />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeApplicants;
