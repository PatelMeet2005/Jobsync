import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <>
      <div className="footer">

        <div className="leftfooter">
          <div className="firstline ; highlight">Job</div>
          <div className="secondline">Sync</div>
        </div>

        <div className="middlefooter">
          <div className="middlefooter-content">
            <div className="middlefooter-content-title">
              <h1>Find the right <span className="highlight">Job</span> for you</h1>
            </div>
          </div>
        </div>

        <div className="rightfooter">
          <div className="footlink">
            <ul>
              <li className="highlight">Jobs</li>
              <li>Companies</li>
              <li>About</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; <span className="highlight">Job</span> Sync 2025</p>
        </div>
      </div>
    </>
  )
}

export default Footer