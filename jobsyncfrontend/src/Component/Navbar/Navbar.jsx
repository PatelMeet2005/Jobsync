import React, { useState, useRef } from 'react';
import './Navbar.css';
import './Job_drop.css';
import categories from '../../Data/categories.json';
import Login from '../Login/Login';
import Register from '../Register/Register';
import axios from 'axios';

const Navbar = () => {


  const [Jobdropfun, setJobdropfun] = useState(false);
  const timeoutID = useRef(null); // Use useRef for timeoutID

  const selectedEmail = sessionStorage.getItem('userEmail');
  const selectedFirstName = sessionStorage.getItem('userFirstName');
  const selectedLastName = sessionStorage.getItem('userLastName');

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLoginModel = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegisterModel = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModel = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = async () => {
    try{
      const response = await axios.post('http://localhost:8000/user/logout');
      console.log("Logout data : ",response.data);
      sessionStorage.clear();
      window.location.reload(); // Reload the page to reflect the logout
      
    }
    catch(error){
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  }
  return (
    <>
      <div className="mainNav">
        <div className="logo">JobSync</div>

        <div className="navLink">
          <ul>
            {/* Job drop down contant */}
            <li className='job_drop nav_li' onMouseEnter={() => {
              clearTimeout(timeoutID.current);
              setJobdropfun(true);
            }}
              onMouseLeave={() => {
                timeoutID.current = setTimeout(() => {
                  setJobdropfun(false);
                }, 300);
              }}>
              <a href="./" tabIndex={0} aria-haspopup="true" aria-expanded={Jobdropfun} aria-label="Jobs dropdown">Jobs</a>

              {Jobdropfun && (
                <div className="job_drop_content">
                  <div className="categories_grid">
                    <div className="category_column">
                      <h1 className="categories_head">Popular categories</h1>
                      <ul className='category_list'>
                        {categories.POPULAR_CATEGORIES.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="category_column">
                      <h1 className="categories_head">Jobs in demand</h1>
                      <ul className='category_list'>
                        {categories.JOBS_IN_DEMAND.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="category_column">
                      <h1 className="categories_head">Jobs by location</h1>
                      <ul className='category_list'>
                        {categories.JOBS_BY_LOCATION.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li className='nav_li'><a href="/companie">Companies</a></li>
            <li className='nav_li'><a href="/about">About</a></li>
          </ul>
        </div>

        <div className="searchbar">
          <input type="text" />
          <button>serch</button>
        </div>


        {selectedEmail ? (
          <div className="user-info">
            <p>Welcome, {selectedFirstName} {selectedLastName}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="login">
            <button id='clt' onClick={openLoginModel}>Sign in / sign up</button>
            <button id='emp'>Employees</button>
          </div>
        )}

        {showLogin && <Login onClose={closeModel} switchToSignup={openRegisterModel} />}
        {showRegister && <Register onClose={closeModel} switchToLogin={openLoginModel} />}

      </div>
    </>
  )
}

export default Navbar