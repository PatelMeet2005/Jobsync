import React from 'react'
import './Job.css'

const Job = () => {
  return (
    <>
    <div className="jobMain_contant">
      <div className="jobMain_left">
        <h1 className="main_heading">
        Find your dream job with us!
      </h1>
      <search className='search_container'>
        <input type="text" placeholder="Search for jobs..." className="search_input" />
        <button className="search_button">Search</button>
      </search>  
      </div>
      <div className="jobMain_right">
        <img src="/main_section/finding_job.png" alt="Job search" />
      </div>
    </div>
    </>
  )
}

export default Job