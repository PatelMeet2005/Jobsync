import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import JobHeader from "./JobHeader";
import JobFilters from "./JobFilters";
import JobList from "./JobList";
import Pagination from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Job.css";

const JobPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ 
    keywords: "",
    location: "", 
    workMode: "",
    type: "",
    category: "",
    salary: "",
    experience: "",
    sort: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const jobListRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", resume: null, cover: "" });
  const [savedJobs, setSavedJobs] = useState(new Set());

  // API
  useEffect(() => {
    fetchJobs();
    // Load saved jobs from localStorage
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(new Set(saved));
    
    // Get company from URL query parameter and set it in filters.keywords
    const companyFromUrl = searchParams.get('company');
    if (companyFromUrl) {
      setFilters(prev => ({ ...prev, keywords: companyFromUrl }));
    }
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Fetch jobs from employee API (new source)
      const response = await axios.get("http://localhost:8000/employee/fetchjobs");
      // API returns { success: true, jobs: [...] }
      const apiJobs = response.data?.jobs || [];

      // Map backend job schema to frontend expected fields
      const mapped = apiJobs.map(j => ({
        _id: j._id || j.id,
        jobTitle: j.title || j.jobTitle || '',
        jobCompany: (j.company && j.company.name) || j.jobCompany || (j.companyName) || 'Unknown',
        jobLocation: (j.company && j.company.location) || j.location || j.jobLocation || 'Remote',
        jobType: j.jobType || j.type || 'Full-time',
        jobSalary: j.salary ? (typeof j.salary === 'number' ? `$${j.salary.toLocaleString()}` : j.salary) : (j.jobSalary || 'Not disclosed'),
        salary: j.salary || 0,
        jobSkills: j.skills || j.requirements || j.jobSkills || [],
        createdAt: j.postedDate || j.createdAt || j.postedAt,
        jobDescription: j.description || j.jobDescription || j.requirements?.join(', ') || '',
        postedDate: j.postedDate || j.createdAt || j.postedAt,
        jobStatus: j.status || j.jobStatus || 'pending',
        description: j.description || '',
        postedBy: j.postedBy || null,
        category: j.category || '',
        experience: j.experience || '',
        workMode: j.workMode || ''
      }));

      setJobs(mapped);
      setError("");
    } catch (err) {
      setError("Failed to load jobs. Please try again later.");
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Filtering & Sorting
  const filteredJobs = jobs.filter(job => {
    // Status filter - only show accepted jobs
    const matchesStatus = job.jobStatus?.toLowerCase() === 'accepted';
    
    // Search term filter
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobSkills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Keywords filter (from filters.keywords)
    const matchesKeywords = filters.keywords ? 
      (job.jobTitle?.toLowerCase().includes(filters.keywords.toLowerCase()) ||
       job.jobCompany?.toLowerCase().includes(filters.keywords.toLowerCase()) ||
       job.jobLocation?.toLowerCase().includes(filters.keywords.toLowerCase()) ||
       job.jobSkills?.some(skill => skill.toLowerCase().includes(filters.keywords.toLowerCase()))) : true;
    
    // Location filter
    const matchesLocation = filters.location ? 
      job.jobLocation?.toLowerCase().includes(filters.location.toLowerCase()) : true;
    
    // Work mode filter
    const matchesWorkMode = filters.workMode ? 
      job.workMode?.toLowerCase() === filters.workMode.toLowerCase() : true;
    
    // Job type filter
    const matchesType = filters.type ? 
      job.jobType?.toLowerCase() === filters.type.toLowerCase() : true;
    
    // Category filter
    const matchesCategory = filters.category ? 
      job.category?.toLowerCase() === filters.category.toLowerCase() : true;
    
    // Experience filter
    const matchesExperience = filters.experience ? 
      job.experience?.toLowerCase() === filters.experience.toLowerCase() : true;
    
    // Salary range filter
    const matchesSalary = filters.salary ? (() => {
      const jobSalary = job.salary || 0;
      if (filters.salary === "0-50000") return jobSalary >= 0 && jobSalary <= 50000;
      if (filters.salary === "50000-75000") return jobSalary > 50000 && jobSalary <= 75000;
      if (filters.salary === "75000-100000") return jobSalary > 75000 && jobSalary <= 100000;
      if (filters.salary === "100000+") return jobSalary > 100000;
      return true;
    })() : true;
    
    return matchesStatus && matchesSearch && matchesKeywords && matchesLocation && matchesWorkMode && 
           matchesType && matchesCategory && matchesExperience && matchesSalary;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (filters.sort === "date") {
      return new Date(b.createdAt || b.postedDate) - new Date(a.createdAt || a.postedDate);
    }
    if (filters.sort === "salary-desc") {
      return (parseInt(b.jobSalary?.replace(/\D/g, '') || 0) - parseInt(a.jobSalary?.replace(/\D/g, '') || 0));
    }
    if (filters.sort === "salary-asc") {
      return (parseInt(a.jobSalary?.replace(/\D/g, '') || 0) - parseInt(b.jobSalary?.replace(/\D/g, '') || 0));
    }
    if (filters.sort === "company") {
      return (a.jobCompany || '').localeCompare(b.jobCompany || '');
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  // Handlers
  const handleSearchChange = e => setSearchTerm(e.target.value);
  
  const handleSearchSubmit = e => {
    e.preventDefault();
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const handleSortChange = e => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const handleResetFilters = () => {
    setFilters({ 
      keywords: "",
      location: "", 
      workMode: "",
      type: "",
      category: "",
      salary: "",
      experience: "",
      sort: "" 
    });
    setSearchTerm("");
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const handleClearCompanyFilter = () => {
    setFilters(prev => ({ ...prev, keywords: "" }));
    setSearchParams({}); // Clear URL parameters
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const handleQuickFilter = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
    scrollToJobList();
  };
  
  const scrollToJobList = () => {
    setTimeout(() => {
      if (jobListRef.current) {
        jobListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };
  
  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      scrollToJobList();
    }
  };
  
  const handleViewDetails = job => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedJob(null);
  };
  
  const handleApply = job => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      toast.info("Please login to apply for jobs");
      return;
    }
    
    setSelectedJob(job);
    setShowApplyModal(true);
    setForm({ 
      name: sessionStorage.getItem("userName") || "", 
      email: sessionStorage.getItem("userEmail") || "", 
      resume: null, 
      cover: "" 
    });
  };
  
  const handleCloseApply = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
  };
  
  const handleFormChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };
  
  const handleFormSubmit = e => {
    e.preventDefault();
    setApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      setApplying(false);
      toast.success("Application submitted successfully!");
      handleCloseApply();
    }, 1500);
  };
  
  const handleSaveJob = (jobId, isSaved) => {
    const newSavedJobs = new Set(savedJobs);
    
    if (isSaved) {
      newSavedJobs.add(jobId);
      toast.success("Job saved successfully!");
    } else {
      newSavedJobs.delete(jobId);
      toast.info("Job removed from saved jobs");
    }
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(Array.from(newSavedJobs)));
  };

  return (
    <div className="job-page-container">
      <JobHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onQuickFilter={handleQuickFilter}
        companyFilter={searchParams.get('company')}
        onClearCompanyFilter={handleClearCompanyFilter}
      />
      
      <div className="job-page-content">
        <aside className="filters-section">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
          />
        </aside>
        
        <main className="job-list-section" ref={jobListRef}>
          
          <JobList
            jobs={paginatedJobs}
            loading={loading}
            empty={!loading && sortedJobs.length === 0}
            onViewDetails={handleViewDetails}
            onSaveJob={handleSaveJob}
            onApply={handleApply}
            savedJobs={savedJobs}
          />
          
          {!loading && sortedJobs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
      
      {/* Modals */}
      {showDetailsModal && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={handleCloseDetails}
          onApply={() => handleApply(selectedJob)}
          isSaved={savedJobs.has(selectedJob._id)}
          onSaveJob={() => handleSaveJob(selectedJob._id, !savedJobs.has(selectedJob._id))}
        />
      )}
      
      {showApplyModal && selectedJob && (
        <ApplicationModal
          job={selectedJob}
          form={form}
          applying={applying}
          onFormChange={handleFormChange}
          onFormSubmit={handleFormSubmit}
          onClose={handleCloseApply}
        />
      )}
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light"
      />
    </div>
  );
};

export default JobPage;