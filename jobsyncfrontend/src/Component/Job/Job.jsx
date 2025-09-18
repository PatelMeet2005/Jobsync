import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import JobHeader from "./JobHeader";
import JobFilters from "./JobFilters";
import JobList from "./JobList";
import Pagination from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Job.css";

const JobPage = () => {
  // State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ 
    location: "", 
    type: "", 
    sort: "",
    salary: "",
    experience: "",
    remote: ""
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
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/admin/getJobs");
      setJobs(response.data.jobs || []);
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
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobSkills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesLocation = filters.location ? 
      job.jobLocation?.toLowerCase().includes(filters.location.toLowerCase()) : true;
    
    const matchesType = filters.type ? job.jobType === filters.type : true;
    
    const matchesRemote = filters.remote ? 
      (filters.remote === "remote" ? job.jobLocation?.toLowerCase().includes("remote") :
       filters.remote === "hybrid" ? job.jobLocation?.toLowerCase().includes("hybrid") :
       filters.remote === "onsite" ? !job.jobLocation?.toLowerCase().includes("remote") && 
                                     !job.jobLocation?.toLowerCase().includes("hybrid") : true) : true;
    
    return matchesSearch && matchesLocation && matchesType && matchesRemote;
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
    setFilters({ location: "", type: "", sort: "", salary: "", experience: "", remote: "" });
    setSearchTerm("");
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
          <div className="results-header">
            <h2>
              {loading ? "Searching jobs..." : 
               `${sortedJobs.length} ${sortedJobs.length === 1 ? 'job' : 'jobs'} found`}
            </h2>
            
            {sortedJobs.length > 0 && (
              <div className="sort-container">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary-desc">Salary (High to Low)</option>
                  <option value="salary-asc">Salary (Low to High)</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            )}
          </div>
          
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