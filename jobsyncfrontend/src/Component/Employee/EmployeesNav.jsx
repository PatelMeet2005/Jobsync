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
          <li onClick={() => scrollToSection(refs.dashboardRef)}>Dashboard</li>
          <li onClick={() => scrollToSection(refs.addJobRef)}>Add Job</li>
          <li onClick={() => scrollToSection(refs.postedJobRef)}>Jobs Tracking</li>
          <li onClick={() => scrollToSection(refs.applicantsRef)}>Applicants</li>
        </ul>

        <div className="nav-profile">
          <div className="profile-email" onClick={() => {
                localStorage.removeItem("token"); // remove token
                setIsLoggedIn(false);
          }}>
            Log out
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNav;
