import React, { useEffect, useState } from "react";
import axios from 'axios';
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

  return (
    <div className="employee-applicants">
      <h2>Applicants</h2>
      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="applications-list">
          {applications.length === 0 && <p>No applications found.</p>}
          {applications.map(app => (
            <div className="application-card" key={app._id}>
              <div className="app-left">
                <h3>{
                  app.name ||
                  app.applicant?.employeename ||
                  ((app.applicant?.userFirstName || app.applicant?.userLastName) ? `${(app.applicant?.userFirstName || '')} ${(app.applicant?.userLastName || '')}`.trim() : 'Applicant')
                }</h3>
                <p className="app-email">{app.email || app.applicant?.userEmail || app.applicant?.employeeemail}</p>
                <p className="app-job">Applied for: <strong>{app.jobId?.title || 'Unknown'}</strong></p>
                {app.resumePath && (
                  <p><a href={`http://localhost:8000${app.resumePath}`} target="_blank" rel="noreferrer">Download Resume</a></p>
                )}
                <p className="app-message">{app.message}</p>
              </div>
              <div className="app-right">
                <p className="status">Status: <span className={`status-badge status-${app.status}`}>{app.status}</span></p>
                <div className="responses">
                  <h4>Responses</h4>
                  {app.responses && app.responses.length > 0 ? (
                    app.responses.map((r, idx) => (
                      <div key={idx} className="response-item">
                        <small className="response-sender">{r.sender}</small>
                        <p className="response-message">{r.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-responses">No responses yet</p>
                  )}

                  <div className="actions-row">
                    {replyingTo === app._id ? (
                    <div className="reply-box">
                      <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Write your reply..." />
                      <div className="reply-actions">
                        <button onClick={() => handleSendReply(app._id)} className="btn btn-primary">Send</button>
                        <button onClick={handleCancelReply} className="btn btn-secondary">Cancel</button>
                      </div>
                    </div>
                    ) : (
                      <button onClick={() => handleStartReply(app._id)} className="btn btn-primary">Respond</button>
                    )}

                    {!['accepted','rejected'].includes(app.status) && (
                      <div className="status-actions">
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'accepted')}
                          className={`btn accept`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          className={`btn reject`}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeApplicants;
