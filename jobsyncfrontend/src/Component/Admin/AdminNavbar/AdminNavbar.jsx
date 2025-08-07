import React, { useState } from 'react';
import './AdminNavbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlelogout = async () => {
    try{
      const response = await axios.post(`http://localhost:8000/user/logout`);
      console.log("Logout Data:",response.data);
      sessionStorage.clear();
      window.location.reload();
    }catch(error){
      console.log("Error While Saving this data");
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className='AdminContainer'>
        <button 
          className='mobile-menu-toggle'
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
        <div className='AdminContain'>
          <p>Welcome! Administrator</p>
        </div>
      </div>
      
      {/* Mobile overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      <div className={`AdminSidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/admin" style={{ textDecoration: 'none' }}> 
        <p className='AdminDashboardTitle'>Admin Dashboard</p></Link>
        <div className='AdminNavLink'>
          <ul className='AdminMenu'>
          <Link to='/adminjob' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Jobs" className="menu-icon" /> Jobs</li>
          </Link>      
          <Link to='/adminjoblist' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Job List" className="menu-icon" />Job List</li>
          </Link>
          <Link to='/admincompany' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Company" className="menu-icon" />Company</li>
          </Link>
          <Link to='/adminuser' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Users" className="menu-icon" />Users</li>
          </Link>
          <Link to='/adminrequest' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Requests" className="menu-icon" />Requests</li>
          </Link>
          <Link to='/adminenquiry' onClick={() => setIsMobileMenuOpen(false)}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Enquiry" className="menu-icon" />Enquiry</li>
          </Link>
          <Link to='/adminlogout' onClick={() => { handlelogout(); setIsMobileMenuOpen(false); }}>
            <li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Logout" className="menu-icon" /> Logout</li>
          </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
