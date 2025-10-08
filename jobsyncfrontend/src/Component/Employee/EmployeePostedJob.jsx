import React from "react";
import "./EmployeePostedJob.css";

const EmployeePostedJob = () => {
  const jobs = [
    { id: 1, title: "Frontend Developer", status: "Pending" },
    { id: 2, title: "Backend Developer", status: "Accepted" },
  ];

  return (
    <div className="employee-postedjob">
      <h2>Posted Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <span>{job.title}</span>
            <span className={`status ${job.status.toLowerCase()}`}>
              {job.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeePostedJob;
