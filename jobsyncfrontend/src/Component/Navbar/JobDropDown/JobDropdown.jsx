// JobDropdown.jsx
import React, { useState, useRef } from "react";
import categories from "../../../Data/categories.json";
import "./Job_drop.css";

const JobDropdown = () => {
  const [open, setOpen] = useState(false);
  const timeoutID = useRef(null);

  return (
    <li
      className="job_drop nav_li"
      onMouseEnter={() => {
        clearTimeout(timeoutID.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timeoutID.current = setTimeout(() => setOpen(false), 300);
      }}
    >
      <a href="./" aria-haspopup="true" aria-expanded={open}>Jobs</a>
      {open && (
        <div className="job_drop_content">
          <div className="categories_grid">
            <div className="category_column">
              <h1 className="categories_head">Popular categories</h1>
              <ul className="category_list">
                {categories.POPULAR_CATEGORIES.map((cat, i) => (
                  <li key={i} className="category_item">{cat}</li>
                ))}
              </ul>
            </div>
            <div className="category_column">
              <h1 className="categories_head">Jobs in demand</h1>
              <ul className="category_list">
                {categories.JOBS_IN_DEMAND.map((cat, i) => (
                  <li key={i} className="category_item">{cat}</li>
                ))}
              </ul>
            </div>
            <div className="category_column">
              <h1 className="categories_head">Jobs by location</h1>
              <ul className="category_list">
                {categories.JOBS_BY_LOCATION.map((cat, i) => (
                  <li key={i} className="category_item">{cat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default JobDropdown;
