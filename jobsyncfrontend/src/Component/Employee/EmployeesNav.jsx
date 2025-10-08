import React from "react";
import "./EmployeesNav.css";

const EmployeeNav = ({ isLoggedIn, setIsLoggedIn, scrollToSection, refs }) => {
  // Only show navbar when user is logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="floating-employee-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="logo-icon">
            🚀
          </div>
        </div>
        
        <ul className="nav-links">
          <li onClick={() => scrollToSection(refs.dashboardRef)}>Work</li>
          <li onClick={() => scrollToSection(refs.addJobRef)}>Add Job</li>
          <li onClick={() => scrollToSection(refs.postedJobRef)}>Jobs</li>
          <li onClick={() => scrollToSection(refs.applicantsRef)}>Applicants</li>
        </ul>

        <div className="nav-profile">
          <div className="profile-email" onClick={() => setIsLoggedIn(false)}>
            employee@jobsync.com
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNav;
