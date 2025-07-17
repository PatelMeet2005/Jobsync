import React, { useState, useRef } from 'react';
import './Navbar.css';
import './Job_drop.css';
import categories from '../../Data/categories.json';
import Login from '../Login/Login';

const Navbar = () => {

  const [showLogin, setShowLogin] = useState(false);
  const [Jobdropfun, setJobdropfun] = useState(false);
  const timeoutID = useRef(null); // Use useRef for timeoutID

  const openModel = () => setShowLogin(true);
  const closeModel = () => setShowLogin(false);

  return (
    <>
      <div className="mainNav">
        <div className="logo">JobSync</div>

        <div className="navLink">
          <ul>
            <li className='job_drop' onMouseEnter={() => {
              clearTimeout(timeoutID.current);
              setJobdropfun(true);
            }}
              onMouseLeave={() => {
                timeoutID.current = setTimeout(() => {
                  setJobdropfun(false);
                }, 300);
              }}>
              <a href="#" tabIndex={0} aria-haspopup="true" aria-expanded={Jobdropfun} aria-label="Jobs dropdown">Jobs</a>
              {Jobdropfun && (
                <div className="job_drop_content">
                  <div className="categories_grid">
                    <div className="category_column">
                      <h1 className="categories_head">Popular categories</h1>
                      <ul>
                        {categories.POPULAR_CATEGORIES.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="category_column">
                      <h1 className="categories_head">Jobs in demand</h1>
                      <ul>
                        {categories.JOBS_IN_DEMAND.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="category_column">
                      <h1 className="categories_head">Jobs by location</h1>
                      <ul>
                        {categories.JOBS_BY_LOCATION.map((cat, i) => (
                          <li key={i} className="category_item">{cat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              </li>
            <li><a href="#">Companies</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div className="searchbar">
          <input type="text" aria-label="Search" />
          <button>search</button>
        </div>

        <div className="login">
          <button id='clt' onClick={openModel}>Sign in / sign up</button>
          <button id='emp'>Employees</button>
        </div>

        {showLogin && <Login onClose={closeModel} />}

      </div>
    </>
  )
}

export default Navbar