import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <>
      <div className="footer">

        <div className="leftfooter">
          <div className="firstline">Job</div>
          <div className="secondline">Sync</div>
        </div>
        <div className="rightfooter">
          <div className="footlink">
            <ul>
              <li>Jobs</li>
              <li>Companies</li>
              <li>About</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; Job Sync 2025
        </div>
      </div>
    </>
  )
}

export default Footer