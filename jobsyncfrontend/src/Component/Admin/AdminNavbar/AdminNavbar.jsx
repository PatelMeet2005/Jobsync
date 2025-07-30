import React from 'react';
import './AdminNavbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import Utils from '../../../common/UtilsPart/Utils';
// import movieIcon from '../../../assets/Images/movie_icon.png';
// import movieIcon1 from '../../../assets/Images/movielist.png'
// import movieIcon2 from '../../../assets/Images/cinema.png'
// import movieIcon3 from '../../../assets/Images/show.png'
// import movieIcon4 from '../../../assets/Images/customer.png'
// import movieIcon5 from '../../../assets/Images/booking.png'
// import movieIcon6 from '../../../assets/Images/enquiry.png'
// import movieIcon7 from '../../../assets/Images/logout.png'

const AdminNavbar = () => {

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


  return (
    <>
      <div className='AdminContainer'>
        <div className='AdminContain'>
          <p>Welcome! Administrator</p>
        </div>
      </div>
      <div className='AdminSidebar'>
        <Link to="/admin" style={{ textDecoration: 'none' }}> 
        <p className='AdminDashboardTitle'>Admin Dashboard</p></Link>
        <div className='AdminNavLink'>
          <ul className='AdminMenu'>
          <Link to='/adminmovie'>
              <li>
                <img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" /> Jobs
              </li>
            </Link>
          
            <Link to='/adminmovielist'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Job List</li></Link>
            <Link to='/admintheater'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Company</li></Link>
            <Link to='/adminshow'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Shows</li></Link>
            <Link to='/admincustomer'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Users</li></Link>
            <Link to='/adminbooking'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Requests</li></Link>
            <Link to='/adminenquiry'><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" />Enquiry</li></Link>
            <Link to='/adminlogout' onClick={handlelogout}><li><img src="https://t3.ftcdn.net/jpg/05/40/08/54/240_F_540085480_WN26Tz5VOFRwdPsLmK73JXNuSYsi2luw.jpg" alt="Movies" className="menu-icon" /> Logout</li></Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
