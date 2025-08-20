import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminRequest.css';

const AdminRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when backend is ready
      // const response = await axios.get('http://localhost:8000/admin/job-requests', {
      //   headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      // });
      
      // if (response.data.status === 'success') {
      //   setRequests(response.data.requests || []);
      // }

      // Mock data for demonstration
      setRequests([
        {
          _id: '1',
          jobTitle: 'Senior React Developer',
          company: 'Tech Solutions Inc.',
          employerName: 'David Chen',
          employerEmail: 'david.chen@techsolutions.com',
          jobDescription: 'We are looking for an experienced React developer to join our frontend team. The ideal candidate should have 5+ years of experience in React, Redux, and modern JavaScript frameworks.',
          requirements: ['5+ years React experience', 'Redux knowledge', 'TypeScript', 'RESTful APIs', 'Git/GitHub'],
          salary: '$80,000 - $120,000',
          location: 'New York, NY',
          jobType: 'Full-time',
          experience: 'Senior Level',
          department: 'Engineering',
          applicationDeadline: '2025-09-15',
          contactEmail: 'jobs@techsolutions.com',
          contactPhone: '+1-555-0123',
          submittedDate: '2025-08-01T10:30:00Z',
          status: 'pending',
          priority: 'high',
          companySize: '500-1000',
          benefits: ['Health Insurance', 'Dental Insurance', 'Paid Time Off', '401k']
        },
        {
          _id: '2',
          jobTitle: 'UX/UI Designer',
          company: 'Creative Studio',
          employerName: 'Lisa Rodriguez',
          employerEmail: 'lisa.rodriguez@creativestudio.com',
          jobDescription: 'Join our creative team as a UX/UI Designer. You will be responsible for creating user-centered designs and improving user experience across our digital products.',
          requirements: ['3+ years UX/UI experience', 'Figma/Sketch proficiency', 'User research skills', 'Prototyping', 'Design systems'],
          salary: '$65,000 - $85,000',
          location: 'Remote',
          jobType: 'Full-time',
          experience: 'Mid Level',
          department: 'Design',
          applicationDeadline: '2025-08-25',
          contactEmail: 'careers@creativestudio.com',
          contactPhone: '+1-555-0124',
          submittedDate: '2025-08-02T14:15:00Z',
          status: 'approved',
          priority: 'medium',
          companySize: '50-100',
          benefits: ['Flexible Hours', 'Remote Work', 'Professional Development']
        },
        {
          _id: '3',
          jobTitle: 'Data Scientist',
          company: 'Innovation Corp',
          employerName: 'Robert Kim',
          employerEmail: 'robert.kim@innovationcorp.com',
          jobDescription: 'We are seeking a talented Data Scientist to analyze complex datasets and provide actionable insights to drive business decisions.',
          requirements: ['PhD in Data Science/Statistics', 'Python/R programming', 'Machine Learning', 'SQL', 'Statistical analysis'],
          salary: '$95,000 - $130,000',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          experience: 'Senior Level',
          department: 'Data Analytics',
          applicationDeadline: '2025-09-01',
          contactEmail: 'talent@innovationcorp.com',
          contactPhone: '+1-555-0125',
          submittedDate: '2025-08-03T09:45:00Z',
          status: 'rejected',
          priority: 'high',
          companySize: '1000+',
          benefits: ['Stock Options', 'Health Insurance', 'Gym Membership'],
          rejectionReason: 'Insufficient company verification documents'
        },
        {
          _id: '4',
          jobTitle: 'Marketing Manager',
          company: 'Startup XYZ',
          employerName: 'Emily Davis',
          employerEmail: 'emily.davis@startupxyz.com',
          jobDescription: 'Lead our marketing efforts and develop strategies to increase brand awareness and customer acquisition.',
          requirements: ['5+ years marketing experience', 'Digital marketing expertise', 'Content creation', 'Analytics tools', 'Team leadership'],
          salary: '$70,000 - $90,000',
          location: 'Austin, TX',
          jobType: 'Full-time',
          experience: 'Senior Level',
          department: 'Marketing',
          applicationDeadline: '2025-08-30',
          contactEmail: 'hr@startupxyz.com',
          contactPhone: '+1-555-0126',
          submittedDate: '2025-08-04T11:20:00Z',
          status: 'pending',
          priority: 'medium',
          companySize: '10-50',
          benefits: ['Equity', 'Flexible Schedule', 'Learning Budget']
        }
      ]);

    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load job requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus, response = '') => {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await axios.patch(`http://localhost:8000/admin/job-requests/${requestId}`, 
      //   { status: newStatus, adminResponse: response },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );

      // For now, update locally
      setRequests(requests.map(request => 
        request._id === requestId 
          ? { ...request, status: newStatus, adminResponse: response, reviewedDate: new Date().toISOString() }
          : request
      ));

      setShowModal(false);
      setSelectedRequest(null);
      setResponseMessage('');
      alert(`Request ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request status');
    }
  };

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
    setResponseMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setResponseMessage('');
    setActionType('');
  };

  const submitResponse = () => {
    if (actionType === 'approve') {
      handleStatusUpdate(selectedRequest._id, 'approved', responseMessage);
    } else if (actionType === 'reject') {
      if (!responseMessage.trim()) {
        alert('Please provide a reason for rejection');
        return;
      }
      handleStatusUpdate(selectedRequest._id, 'rejected', responseMessage);
    }
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesFilter = activeFilter === 'all' || request.status === activeFilter;
      const matchesSearch = request.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.employerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedDate) - new Date(a.submittedDate);
        case 'oldest':
          return new Date(a.submittedDate) - new Date(b.submittedDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return <span className={`status-badge ${statusClasses[status] || ''}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return <span className={`priority-badge ${priorityClasses[priority] || ''}`}>{priority}</span>;
  };

  if (loading) {
    return (
      <div className="admin-request-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading job requests...</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="admin-request-container">
      <div className="admin-request-header">
        <h1>Job Request Management</h1>
        <p>Review and manage employee job posting requests</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchRequests} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Status Filter Links */}
      <div className="status-filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Requests ({statusCounts.all})
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({statusCounts.pending})
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveFilter('approved')}
        >
          Approved ({statusCounts.approved})
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveFilter('rejected')}
        >
          Rejected ({statusCounts.rejected})
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="request-controls">
        <div className="search-sort-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by job title, company, or employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-section">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select-request"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Request List */}
      <div className="request-list">
        {filteredAndSortedRequests.length === 0 ? (
          <div className="no-requests">
            <h3>No requests found</h3>
            <p>No job requests match your current filter criteria.</p>
          </div>
        ) : (
          filteredAndSortedRequests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="request-main-info">
                  <h3 className="request-job-title">{request.jobTitle}</h3>
                  <p className="request-company">{request.company}</p>
                  <p className="request-employer">Submitted by: {request.employerName}</p>
                </div>
                <div className="request-badges">
                  {getStatusBadge(request.status)}
                  {getPriorityBadge(request.priority)}
                </div>
              </div>

              <div className="request-details">
                <div className="request-info-grid">
                  <div className="info-item">
                    <span className="label">Location:</span>
                    <span className="value">{request.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Job Type:</span>
                    <span className="value">{request.jobType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Experience:</span>
                    <span className="value">{request.experience}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Department:</span>
                    <span className="value">{request.department}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Salary:</span>
                    <span className="value">{request.salary}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Deadline:</span>
                    <span className="value">{request.applicationDeadline}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Submitted:</span>
                    <span className="value">{formatDate(request.submittedDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Contact:</span>
                    <span className="value">{request.contactEmail}</span>
                  </div>
                </div>

                <div className="request-description">
                  <h4>Job Description:</h4>
                  <p>{request.jobDescription}</p>
                </div>

                <div className="request-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {request.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="request-benefits">
                  <h4>Benefits:</h4>
                  <div className="benefits-tags">
                    {request.benefits.map((benefit, index) => (
                      <span key={index} className="benefit-tag">{benefit}</span>
                    ))}
                  </div>
                </div>

                {request.adminResponse && (
                  <div className="admin-response">
                    <h4>Admin Response:</h4>
                    <p>{request.adminResponse}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                {request.status === 'pending' ? (
                  <>
                    <button 
                      className="approve-btn"
                      onClick={() => openModal(request, 'approve')}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => openModal(request, 'reject')}
                    >
                      ✗ Reject
                    </button>
                  </>
                ) : (
                  <span className="status-text">
                    {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    {request.reviewedDate && ` on ${formatDate(request.reviewedDate)}`}
                  </span>
                )}
                <button className="view-btn">👁️ View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Job Request
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="request-summary">
                <h4>{selectedRequest.jobTitle}</h4>
                <p>{selectedRequest.company}</p>
              </div>

              <div className="response-section">
                <label htmlFor="responseMessage">
                  {actionType === 'approve' ? 'Approval Message (Optional):' : 'Rejection Reason (Required):'}
                </label>
                <textarea
                  id="responseMessage"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={
                    actionType === 'approve' 
                      ? 'Add any additional notes for the employer...'
                      : 'Please provide a clear reason for rejection...'
                  }
                  rows="4"
                  className="response-textarea"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className={actionType === 'approve' ? 'approve-btn' : 'reject-btn'}
                onClick={submitResponse}
              >
                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="refresh-section">
        <button onClick={fetchRequests} className="refresh-btn">
          🔄 Refresh Requests
        </button>
      </div>
    </div>
  );
};

export default AdminRequest;
