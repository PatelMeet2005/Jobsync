import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUpload, FaFileAlt, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaTools, FaTimes, FaSpinner } from 'react-icons/fa';
import './ResumeJobMatch.css';

const ResumeJobMatch = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  // Load saved data from localStorage on component mount
  React.useEffect(() => {
    const savedResults = localStorage.getItem('resumeJobMatchResults');
    const savedResumeName = localStorage.getItem('resumeFileName');
    const savedResumeSize = localStorage.getItem('resumeFileSize');
    
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
    
    if (savedResumeName && savedResumeSize) {
      // Create a mock file object for display purposes
      const mockFile = {
        name: savedResumeName,
        size: parseInt(savedResumeSize)
      };
      setResume(mockFile);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResume(file);
        // Save resume info to localStorage
        localStorage.setItem('resumeFileName', file.name);
        localStorage.setItem('resumeFileSize', file.size.toString());
        toast.success(`Resume "${file.name}" selected`);
      } else {
        toast.error('Please upload a PDF or Word document');
      }
    }
  };

  const removeResume = () => {
    setResume(null);
    setResults(null);
    // Clear localStorage
    localStorage.removeItem('resumeJobMatchResults');
    localStorage.removeItem('resumeFileName');
    localStorage.removeItem('resumeFileSize');
  };

  const analyzeResume = async () => {
    if (!resume) {
      toast.error('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    try {
      // In a real implementation, you would send the resume to a backend service
      // that uses NLP/AI to extract skills, location, etc.
      // For now, we'll simulate the analysis and fetch matching jobs

      // Simulate resume parsing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fetch all jobs from backend
      const jobsResponse = await axios.get('http://localhost:8000/employee/fetchjobs');
      const allJobs = jobsResponse.data?.jobs || [];

      // Filter only accepted jobs
      const acceptedJobs = allJobs.filter(job => job.status?.toLowerCase() === 'accepted');

      // Simulate extracted data from resume (in real app, this would come from AI/NLP service)
      // For demo purposes, we'll use sample data
      const extractedData = {
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        location: 'Remote',
        experience: '2-3 years'
      };

      // Match jobs based on skills and location
      const matchedJobs = acceptedJobs.map(job => {
        let matchScore = 0;
        const matchReasons = [];

        // Check skill matches
        const jobSkills = job.skills || [];
        const skillMatches = extractedData.skills.filter(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        
        if (skillMatches.length > 0) {
          matchScore += skillMatches.length * 20;
          matchReasons.push(`${skillMatches.length} skill match${skillMatches.length > 1 ? 'es' : ''}`);
        }

        // Check location match
        const jobLocation = job.location || (job.company && job.company.location) || '';
        if (jobLocation.toLowerCase().includes(extractedData.location.toLowerCase()) ||
            extractedData.location.toLowerCase().includes(jobLocation.toLowerCase()) ||
            jobLocation.toLowerCase() === 'remote' ||
            extractedData.location.toLowerCase() === 'remote') {
          matchScore += 30;
          matchReasons.push('Location match');
        }

        // Cap match score at 100
        matchScore = Math.min(matchScore, 100);

        return {
          ...job,
          matchScore,
          matchReasons,
          matchedSkills: skillMatches
        };
      }).filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      // Extract unique companies
      const companies = {};
      matchedJobs.forEach(job => {
        const companyName = (job.company && job.company.name) || job.jobCompany || 'Unknown';
        const companyLocation = (job.company && job.company.location) || job.location || job.jobLocation || 'Remote';
        
        if (!companies[companyName]) {
          companies[companyName] = {
            name: companyName,
            location: companyLocation,
            jobCount: 0,
            totalMatchScore: 0
          };
        }
        companies[companyName].jobCount++;
        companies[companyName].totalMatchScore += job.matchScore;
      });

      const topCompanies = Object.values(companies)
        .map(company => ({
          ...company,
          avgMatchScore: Math.round(company.totalMatchScore / company.jobCount)
        }))
        .sort((a, b) => b.avgMatchScore - a.avgMatchScore)
        .slice(0, 10);

      setResults({
        extractedData,
        matchedJobs: matchedJobs.slice(0, 20), // Top 20 jobs
        topCompanies
      });

      // Save results to localStorage
      localStorage.setItem('resumeJobMatchResults', JSON.stringify({
        extractedData,
        matchedJobs: matchedJobs.slice(0, 20),
        topCompanies
      }));

      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const goToJob = (job) => {
    const companyName = (job.company && job.company.name) || job.jobCompany || '';
    navigate(`/job?company=${encodeURIComponent(companyName)}`);
  };

  const goToCompany = (companyName) => {
    navigate(`/job?company=${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="resume-job-match">
      <div className="resume-match-container">
        <div className="resume-match-header">
          <h1>
            <FaBriefcase className="header-icon" />
            Smart Job Matching
          </h1>
          <p>Upload your resume and find the best job matches based on your skills and location</p>
        </div>

        <div className="upload-section">
          <div className="upload-box">
            {!resume ? (
              <>
                <FaUpload className="upload-icon" />
                <h3>Upload Your Resume</h3>
                <p>Support for PDF and Word documents</p>
                <label className="upload-btn">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    hidden
                  />
                  Choose File
                </label>
              </>
            ) : (
              <div className="file-uploaded">
                <FaFileAlt className="file-icon" />
                <div className="file-info">
                  <h4>{resume.name}</h4>
                  <p>{(resume.size / 1024).toFixed(2)} KB</p>
                </div>
                <button className="remove-file-btn" onClick={removeResume}>
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {resume && !results && (
            <button 
              className="analyze-btn"
              onClick={analyzeResume}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <FaSpinner className="spinner" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FaTools />
                  Analyze & Find Jobs
                </>
              )}
            </button>
          )}
        </div>

        {results && (
          <div className="results-section">
            <div className="extracted-info">
              <h2>Extracted Information</h2>
              <div className="info-cards">
                <div className="info-card">
                  <FaTools className="info-icon" />
                  <h3>Skills Found</h3>
                  <div className="skill-tags">
                    {results.extractedData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="info-card">
                  <FaMapMarkerAlt className="info-icon" />
                  <h3>Location</h3>
                  <p>{results.extractedData.location}</p>
                </div>
              </div>
            </div>

            <div className="matched-jobs-section">
              <h2>
                <FaBriefcase />
                Matched Jobs ({results.matchedJobs.length})
              </h2>
              <div className="jobs-grid">
                {results.matchedJobs.map((job, index) => (
                  <div key={job._id || index} className="job-match-card">
                    <div className="match-score">
                      <div className="score-circle" style={{ 
                        background: `conic-gradient(#28a745 ${job.matchScore * 3.6}deg, #e9ecef 0deg)` 
                      }}>
                        <span>{job.matchScore}%</span>
                      </div>
                    </div>
                    <h3>{job.title || job.jobTitle}</h3>
                    <p className="company-name">
                      <FaBuilding />
                      {(job.company && job.company.name) || job.jobCompany || 'Unknown'}
                    </p>
                    <p className="job-location">
                      <FaMapMarkerAlt />
                      {job.location || (job.company && job.company.location) || job.jobLocation || 'Remote'}
                    </p>
                    <div className="match-reasons">
                      {job.matchReasons.map((reason, idx) => (
                        <span key={idx} className="match-reason">{reason}</span>
                      ))}
                    </div>
                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                      <div className="matched-skills">
                        <strong>Matched Skills:</strong>
                        <div className="skill-tags">
                          {job.matchedSkills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button className="go-to-job-btn" onClick={() => goToJob(job)}>
                      <FaBriefcase />
                      View Job
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="companies-section">
              <h2>
                <FaBuilding />
                Top Matching Companies ({results.topCompanies.length})
              </h2>
              <div className="companies-grid">
                {results.topCompanies.map((company, index) => (
                  <div key={index} className="company-match-card">
                    <div className="company-header">
                      <FaBuilding className="company-icon" />
                      <div className="company-info">
                        <h3>{company.name}</h3>
                        <p className="company-location">
                          <FaMapMarkerAlt />
                          {company.location}
                        </p>
                      </div>
                    </div>
                    <div className="company-stats">
                      <div className="stat">
                        <span className="stat-value">{company.jobCount}</span>
                        <span className="stat-label">Open Positions</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{company.avgMatchScore}%</span>
                        <span className="stat-label">Avg Match</span>
                      </div>
                    </div>
                    <button className="go-to-company-btn" onClick={() => goToCompany(company.name)}>
                      <FaBuilding />
                      View All Jobs
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="analyze-new-btn" onClick={removeResume}>
              Upload New Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeJobMatch;
