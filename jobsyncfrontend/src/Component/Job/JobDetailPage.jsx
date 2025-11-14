import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./JobDetailPage.css";
import { useTokenValidation } from "../../utils/tokenValidation";
import SessionWarningBanner from "../SessionWarningBanner/SessionWarningBanner";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [appliedApplication, setAppliedApplication] = useState(null);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  
  // Validate token on mount
  const tokenValidation = useTokenValidation();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/employee/job/${id}`);
        const payload = response.data;

        if (!payload || payload.success === false || !payload.job) {
          setError("Job not found or could not be loaded");
          setLoading(false);
          return;
        }

        const j = payload.job;

        // Map backend fields to the frontend-friendly keys used across the UI
        const mapped = {
          _id: j._id,
          jobTitle: j.title || '',
          jobCompany: j.company?.name || '',
          jobLocation: j.company?.location || '',
          jobDepartment: j.company?.department || '',
          jobContactEmail: j.company?.contactEmail || '',
          jobType: j.jobType || j.jobType || '',
          jobSalary: j.salary ? (typeof j.salary === 'number' ? `₹${j.salary}` : j.salary) : '',
          jobExperience: j.experience || '',
          jobDescription: j.description || '',
          jobRequirements: j.requirements || [],
          jobBenefits: j.benefits || [],
          jobSkills: j.skills || [],
          jobStatus: j.status || '',
          postedBy: j.postedBy || null,
          postedDate: j.postedDate || j.postedDate,
          jobApplicationDeadline: j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString() : ''
        };

        setJob(mapped);
        
        // Check if job is saved (you would implement this logic based on your app)
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs.includes(id));
        // after loading job, check if current user has already applied
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (token) {
            const headers = { Authorization: `Bearer ${token}` };
            const appRes = await axios.get(`http://localhost:8000/applications/mine?jobId=${id}`, { headers });
            if (appRes.data && appRes.data.success && Array.isArray(appRes.data.applications) && appRes.data.applications.length > 0) {
              // pick the most recent application for this job
              setAppliedApplication(appRes.data.applications[0]);
            }
          }
        } catch (err) {
          // swallow - not critical, we'll allow apply for guests
          console.warn('Could not check existing application', err?.response?.data || err.message || err);
        }
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Show warning banner if token validation fails
  useEffect(() => {
    if (tokenValidation.needsRelogin) {
      setShowWarningBanner(true);
    }
  }, [tokenValidation]);

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (isSaved) {
      const updatedJobs = savedJobs.filter(jobId => jobId !== id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    } else {
      savedJobs.push(id);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    }
    setIsSaved(!isSaved);
  };

  const handleApplyClick = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      alert("You must login first!");
      navigate("/login");
    } else {
      setShowApplyForm(true);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    resume: Yup.mixed().required("Resume is required"),
    message: Yup.string().max(500, "Message must be under 500 characters"),
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <h3>{error}</h3>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="not-found-container">
        <i className="fas fa-search"></i>
        <h3>Job not found</h3>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/jobs")} className="back-button">
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      {/* Show warning banner if token needs refresh */}
      {showWarningBanner && tokenValidation.needsRelogin && (
        <SessionWarningBanner 
          message={tokenValidation.message} 
          onClose={() => setShowWarningBanner(false)}
        />
      )}
      
      <button onClick={() => navigate(-1)} className="back-button">
        <i className="fas fa-arrow-left"></i> Back to Jobs
      </button>
      
      <div className="job-details-container">
        {/* LEFT SIDE - JOB DETAILS */}
        <div className="job-details-content">
          <header className="job-details-header">
            <div className="company-info">
              <div className="company-logo">
                {job.jobCompany ? job.jobCompany.charAt(0).toUpperCase() : 'J'}
              </div>
              <div>
                <h1>{job.jobTitle}</h1>
                <p className="company-name">{job.jobCompany}</p>
                <p className="job-location">
                  <i className="fas fa-map-marker-alt"></i> {job.jobLocation}
                </p>
              </div>
            </div>
            
            <div className="job-actions">
              <button 
                className={`save-job-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveJob}
                aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
              >
                <i className={`fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                {isSaved ? 'Saved' : 'Save'}
              </button>
              {appliedApplication && appliedApplication.status && appliedApplication.status !== 'rejected' ? (
                <button className="apply-now-btn disabled" disabled>Already Applied</button>
              ) : (
                <button className="apply-now-btn" onClick={handleApplyClick}>
                  Apply Now
                </button>
              )}
            </div>
          </header>

          <div className="job-meta-grid">
            <div className="meta-item">
              <i className="fas fa-clock"></i>
              <div>
                <span className="meta-label">Job Type</span>
                <span className="meta-value">{job.jobType}</span>
              </div>
            </div>
            <div className="meta-item">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <span className="meta-label">Salary</span>
                <span className="meta-value">{job.jobSalary}</span>
              </div>
            </div>
            <div className="meta-item">
              <i className="fas fa-building"></i>
              <div>
                <span className="meta-label">Department</span>
                <span className="meta-value">{job.jobDepartment}</span>
              </div>
            </div>
            <div className="meta-item">
              <i className="fas fa-chart-line"></i>
              <div>
                <span className="meta-label">Experience</span>
                <span className="meta-value">{job.jobExperience}</span>
              </div>
            </div>
            <div className="meta-item">
              <i className="fas fa-calendar-day"></i>
              <div>
                <span className="meta-label">Deadline</span>
                <span className="meta-value">{job.jobApplicationDeadline}</span>
              </div>
            </div>
            <div className="meta-item">
              <i className="fas fa-envelope"></i>
              <div>
                <span className="meta-label">Contact</span>
                <span className="meta-value">{job.jobContactEmail}</span>
              </div>
            </div>
          </div>

          <div className="job-details-body">
            <section className="detail-section">
              <h3>
                <i className="fas fa-file-alt"></i> Job Description
              </h3>
              <p>{job.jobDescription}</p>
            </section>

            <section className="detail-section">
              <h3>
                <i className="fas fa-tools"></i> Required Skills
              </h3>
              <div className="skills-container">
                {job.jobSkills && job.jobSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h3>
                <i className="fas fa-list-check"></i> Requirements
              </h3>
              <ul className="requirements-list">
                {job.jobRequirements && job.jobRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>

            <section className="detail-section">
              <h3>
                <i className="fas fa-gift"></i> Benefits
              </h3>
              <ul className="benefits-list">
                {job.jobBenefits && job.jobBenefits.map((ben, idx) => (
                  <li key={idx}>{ben}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* RIGHT SIDE - APPLICATION FORM */}
        {showApplyForm && (
          <div className="apply-form-container">
            <div className="form-header">
              <h3>Apply for this Position</h3>
              <button 
                className="close-form-btn"
                onClick={() => setShowApplyForm(false)}
                aria-label="Close application form"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <Formik
              initialValues={{ 
                name: sessionStorage.getItem("userName") || "", 
                email: sessionStorage.getItem("userEmail") || "", 
                resume: null, 
                message: "" 
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setTimeout(() => {
                  console.log("Application submitted:", values);
                  alert("Application submitted successfully!");
                  setSubmitting(false);
                  resetForm();
                  setShowApplyForm(false);
                }, 400);
              }}
            >
              {({ setFieldValue, isSubmitting }) => (
                  <Form className="apply-form" onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const formData = new FormData(form);
                    // append jobId
                    formData.append('jobId', job._id);

                    try {
                      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                      const headers = { 'Content-Type': 'multipart/form-data' };
                      if (token) headers.Authorization = `Bearer ${token}`;

                      const res = await axios.post('http://localhost:8000/applications', formData, {
                        headers
                      });
                      if (res.data && res.data.success) {
                            console.log('Application response:', res.data.application);
                            const app = res.data.application;
                            
                            // Check if applicant was linked successfully
                            const hasApplicantId = app && (app.applicant || app.applicantId);
                            
                            if (!hasApplicantId) {
                              alert('⚠️ Application submitted, but applicant was not linked on server.\n\n' +
                                    'This means:\n' +
                                    '• Your application was saved but may not show in your profile\n' +
                                    '• You need to LOGOUT and LOGIN again to refresh your session\n' +
                                    '• Then reapply for this job\n\n' +
                                    'This happens when your login session is outdated.');
                              
                              // Don't cache applications without applicant ID
                              console.warn('Skipping cache for application without applicant ID');
                              form.reset();
                              setShowApplyForm(false);
                              return;
                            }
                            
                            // Success case - applicant was linked properly
                            alert('✅ Application submitted successfully!');
                            form.reset();
                            setShowApplyForm(false);
                            
                            // Mark as applied so button hides
                            setAppliedApplication(app);
                            
                            // Cache the application locally for immediate display in profile
                            try {
                              const jobIdKey = app.jobId && (app.jobId._id || app.jobId);
                              const cachedRaw = JSON.parse(sessionStorage.getItem('appliedApplications') || '[]');
                              const toStore = {
                                _id: app._id,
                                jobId: {
                                  _id: jobIdKey,
                                  // Use cached fields from backend first, fallback to populated jobId
                                  title: app.jobTitle || (app.jobId && (app.jobId.title || app.jobId.jobTitle)) || job.jobTitle || '',
                                  company: app.companyName || (app.jobId && (app.jobId.company && (app.jobId.company.name || app.jobId.company))) || job.jobCompany || ''
                                },
                                jobTitle: app.jobTitle || job.jobTitle || '',
                                jobCompany: app.companyName || job.jobCompany || '',
                                status: app.status || 'pending',
                                createdAt: app.createdAt || new Date().toISOString(),
                                responses: app.responses || [],
                                email: app.email || '',
                                userName: app.userName || app.name || '',
                                applicantId: app.applicantId || (app.applicant && (app.applicant._id || app.applicant)) || '',
                                applicant: app.applicant || app.applicantId
                              };
                              
                              // Replace existing or add new
                              const existingIdx = cachedRaw.findIndex(a => (a._id && a._id === toStore._id) || (a.jobId && a.jobId._id && String(a.jobId._id) === String(toStore.jobId._id)));
                              if (existingIdx >= 0) cachedRaw[existingIdx] = toStore;
                              else cachedRaw.push(toStore);
                              
                              sessionStorage.setItem('appliedApplications', JSON.stringify(cachedRaw));
                              console.log('Application cached successfully:', toStore._id);
                            } catch (err) {
                              console.warn('Could not cache applied application', err);
                            }
                      } else {
                        alert('Failed to submit application');
                      }
                    } catch (err) {
                      console.error('Application submission error', err);
                      alert('Error submitting application. Please try again later.');
                    }
                  }}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <Field 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="Your full name" 
                    />
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <Field 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="your.email@example.com" 
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resume">Upload Resume *</label>
                    <div className="file-input-container">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={(event) => setFieldValue("resume", event.currentTarget.files[0])}
                          accept=".pdf,.doc,.docx"
                        />
                      <label htmlFor="resume" className="file-input-label">
                        <i className="fas fa-upload"></i> Choose File
                      </label>
                      <span className="file-input-text">PDF, DOC or DOCX (Max 5MB)</span>
                    </div>
                    <ErrorMessage name="resume" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Cover Letter (Optional)</label>
                    <Field 
                      as="textarea" 
                      id="message" 
                      name="message" 
                      rows={5} 
                      placeholder="Tell us why you're a good fit for this position..." 
                    />
                    <ErrorMessage name="message" component="div" className="error-message" />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-apply-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Application
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
        {/* Show badge or apply button based on whether user already applied for this job */}
        {!showApplyForm && (
          <div className="apply-control">
            {appliedApplication && appliedApplication.status && appliedApplication.status !== 'rejected' ? (
              <button className="already-applied-btn" disabled>Already Applied</button>
            ) : (
              // show the main Apply Now button in header; this duplicate ensures users without token or with rejected status can apply
              null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;