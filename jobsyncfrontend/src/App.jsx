import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Navbar from './Component/Navbar/Navigation/Navbar'
import Footer from './Component/Footer/Footer'
import Job from './Component/Job/Job'
import Companie from './Component/Companie/Companie'
import AdminNavbar from './Component/Admin/AdminNavbar/AdminNavbar'
import AdminDashboard from './Component/Admin/AdminDashbord/AdminDashboard'
import AdminJob from './Component/Admin/AdminJob/AdminJob'
import AdminJobList from './Component/Admin/AdminJobList/AdminJobList'
import AdminCompany from './Component/Admin/AdminCompany/AdminCompany'
import './App.css'


const App = () => {

  const selectedrole = sessionStorage.getItem("role");

  return (
    <div>
      <Routes>
        {selectedrole === "admin" ? (
          <>
            <Route path="/" element={<><AdminNavbar /><AdminDashboard /></>} />
            <Route path="/admin" element={<><AdminNavbar /><AdminDashboard /></>} />
            <Route path="/adminjob" element={<><AdminNavbar /><AdminJob /></>} />
            <Route path="/adminjoblist" element={<><AdminNavbar /><AdminJobList /></>} />
            <Route path="/admincompany" element={<><AdminNavbar /><AdminCompany /></>} />
            <Route path="*" element={<><AdminNavbar /><AdminDashboard /></>} />
          </>
        ) : (
          <>
            <Route path="/" element={<><Navbar /><Job /><Footer /></>} />
            <Route path="/companie" element={<><Navbar /><Companie /><Footer /></>} />
            <Route path="*" element={<><Navbar /><Job /><Footer /></>} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App