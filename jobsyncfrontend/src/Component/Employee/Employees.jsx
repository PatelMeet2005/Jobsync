import React, { useRef, useState, useEffect } from "react";
import EmployeeNav from "./EmployeesNav";
import EmployeeDashboard from "./EmployeeDashboard";
import EmployeeAddJob from "./EmployeeAddJob";
import EmployeePostedJob from "./EmployeePostedJob";
import EmployeeApplicants from "./EmployeeApplicants";
import EmployeeAuth from "./EmployeeAuth";
import "./Employees.css";

const Employee = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

    const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    setIsLoggedIn(false);
  };

  // Refs for smooth scrolling
  const authRef = useRef(null);
  const dashboardRef = useRef(null);
  const addJobRef = useRef(null);
  const postedJobRef = useRef(null);
  const applicantsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="employee-container">
      <EmployeeNav
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        scrollToSection={scrollToSection}
        refs={{ authRef, dashboardRef, addJobRef, postedJobRef, applicantsRef }}
      />

      {!isLoggedIn ? (
        <section ref={authRef} className="employee-section">
          <EmployeeAuth onLogin={() => setIsLoggedIn(true)} />
        </section>
      ) : (
        <>
          <section ref={dashboardRef} className="employee-section">
            <EmployeeDashboard />
          </section>

          <section ref={addJobRef} className="employee-section">
            <EmployeeAddJob />
          </section>

          <section ref={postedJobRef} className="employee-section">
            <EmployeePostedJob />
          </section>

          <section ref={applicantsRef} className="employee-section">
            <EmployeeApplicants />
          </section>
        </>
      )}
    </div>
  );
};

export default Employee;
