import React from "react";
import "./EmployeeApplicants.css";

const EmployeeApplicants = () => {
  const applicants = [
    { id: 1, name: "John Doe", job: "Frontend Developer" },
    { id: 2, name: "Jane Smith", job: "Backend Developer" },
  ];

  return (
    <div className="employee-applicants">
      <h2>Applicants</h2>
      <ul>
        {applicants.map((app) => (
          <li key={app.id}>
            <strong>{app.name}</strong> applied for <em>{app.job}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeApplicants;
