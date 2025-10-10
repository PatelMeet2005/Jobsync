import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminRequest.css";

const AdminJobRequests = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // New state for active tab

  // Fetch all jobs from admin API
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/employee/fetchjobs");
      setJobs(res.data.jobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  // Update job status (accept or reject)
  const updateJobStatus = async (jobId, status) => {
    try {
      const res = await axios.put(`http://localhost:8000/employee/job/${jobId}/status`, { status });
      alert(res.data.message);

      // Update UI instantly
      setJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, status } : job))
      );

      // Optionally switch to the appropriate tab after status update
      if (status === "accepted" || status === "rejected") {
        setTimeout(() => {
          setActiveTab(status);
        }, 1000); // Switch tab after 1 second to show the updated status
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on active tab
  const filteredJobs = jobs.filter(job => job.status === activeTab);

  // Get counts for each status
  const getStatusCount = (status) => {
    return jobs.filter(job => job.status === status).length;
  };

  if (loading) {
    return <div className="admin-job-loading">Loading job requests...</div>;
  }

  return (
    <div className="admin-job-container">
      <h1 className="admin-job-title">Job Requests</h1>

      {/* Tab Navigation */}
      <div className="request-tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({getStatusCount("pending")})
        </button>
        <button
          className={`tab-btn ${activeTab === "accepted" ? "active" : ""}`}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted ({getStatusCount("accepted")})
        </button>
        <button
          className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({getStatusCount("rejected")})
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="no-jobs">No {activeTab} job requests found.</p>
      ) : (
        <div className="admin-job-list">
          {filteredJobs.map((job) => (
            <div key={job._id} className="admin-job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <span className={`status-badge ${job.status}`}>{job.status}</span>
              </div>

              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <p><strong>Experience:</strong> {job.experience}</p>
              <p><strong>Salary:</strong> ${job.salary}</p>
              <p><strong>Work Mode:</strong> {job.workMode}</p>
              <p><strong>Company:</strong> {job.company?.name}</p>
              <p><strong>Location:</strong> {job.company?.location}</p>
              <p><strong>Posted By:</strong> {job.postedBy?.employeename || "Unknown"}</p>

              <div className="job-actions">
                {activeTab === "pending" ? (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => updateJobStatus(job._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => updateJobStatus(job._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="status-msg">
                    {activeTab === "accepted" ? "✅" : "❌"} Job {job.status}.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobRequests;
