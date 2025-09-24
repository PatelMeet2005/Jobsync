import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./JobDetailPage.css";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/getJob/${id}`);
        setJob(response.data.job);
        
        // Check if job is saved (you would implement this logic based on your app)
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(savedJobs.includes(id));
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
              <button className="apply-now-btn" onClick={handleApplyClick}>
                Apply Now
              </button>
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
                <Form className="apply-form">
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
      </div>
    </div>
  );
};

export default JobDetailPage;