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
  const [filters, setFilters] = useState({ location: "", type: "", sort: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const jobListRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", resume: null, cover: "" });

  // API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/getJobs");
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Filtering & Sorting
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filters.location ? job.jobLocation?.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const matchesType = filters.type ? job.jobType === filters.type : true;
    return matchesSearch && matchesLocation && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (filters.sort === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filters.sort === "salary") {
      return (b.jobSalary || 0) - (a.jobSalary || 0);
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
  };
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  const handleSortChange = e => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
    setCurrentPage(1);
  };
  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        if (jobListRef.current) {
          jobListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
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
    setSelectedJob(job);
    setShowApplyModal(true);
    setForm({ name: "", email: "", resume: null, cover: "" });
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
    setTimeout(() => {
      setApplying(false);
      toast.success("Application submitted successfully!");
      handleCloseApply();
    }, 1200);
  };
  const handleSaveJob = job => {
    toast.info(`Saved job: ${job.jobTitle}`);
  };

  return (
    <div className="main-content-wrapper">
      <JobHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="main-content-grid">
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        <div className="job-list-section">
          <JobList
            jobs={paginatedJobs}
            loading={loading}
            empty={!loading && paginatedJobs.length === 0}
            onViewDetails={handleViewDetails}
            onSaveJob={handleSaveJob}
            onApply={handleApply}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default JobPage;
