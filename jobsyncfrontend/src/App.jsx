import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Navbar from './Component/Navbar/Navigation/Navbar'
import Footer from './Component/Footer/Footer'
import Job from './Component/Job/Job'
import Companie from './Component/Companie/Companie'
import './App.css'


const App = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<><Navbar /><Job /><Footer /></>} />
          <Route path="/companie" element={<><Navbar /><Companie /><Footer /></>} />
        </Routes>   
    </>
  )
}

export default App