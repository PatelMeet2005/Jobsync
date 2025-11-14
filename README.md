# 🚀 Jobsync - Modern Job Portal Platform

A comprehensive full-stack job portal application with sophisticated admin management, real-time job posting, and advanced filtering capabilities. Built with modern web technologies for seamless user experience.

## ✨ Key Features

### 🎯 Core Functionality
- **Multi-Role Authentication** - JWT-based secure login for admins, employees, and job seekers
- **Real-time Job Management** - Dynamic job posting, editing, and approval workflow
- **Advanced Company Profiles** - Company listings with job statistics and detailed information
- **Smart Job Filtering** - Location, industry, department, and skill-based filtering
- **Admin Dashboard** - Comprehensive analytics and management interface
- **Responsive Design** - Mobile-first approach with modern UI/UX

### 👨‍💼 Admin Features
- **Dashboard Analytics** - Real-time statistics (users, employees, jobs, requests)
- **Job Approval System** - Three-tier approval workflow (Pending/Accepted/Rejected)
- **User Management** - Complete CRUD operations for users and employees
- **Company Management** - Dynamic company extraction from job submissions
- **Request Management** - Tab-based interface for processing job applications

### 💼 Employee/User Features
- **Job Posting** - Intuitive job creation with rich form validation
- **Profile Management** - Comprehensive user profiles with skill tracking
- **Job Search** - Advanced search with real-time filtering and sorting
- **Application Tracking** - Monitor application status and responses

## 🛠️ Tech Stack

### Frontend
- **React.js 19.1.0** - Modern React with latest features
- **Vite 7.0.5** - Fast build tool and development server
- **React Router DOM 7.6.3** - Client-side routing
- **Axios 1.11.0** - HTTP client for API communication
- **React Icons 5.5.0** - Comprehensive icon library
- **Formik 2.4.6 + Yup 1.7.1** - Form handling and validation
- **CSS3** - Modern styling with Flexbox/Grid, animations, and responsive design

### Backend
- **Node.js + Express.js 5.1.0** - Server-side runtime and framework
- **MongoDB + Mongoose 8.16.4** - NoSQL database with ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication and authorization
- **bcryptjs 3.0.2** - Password hashing and security
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.0** - Environment variable management

### Development Tools
- **Nodemon 3.1.10** - Development server auto-reload
- **ESLint 9.29.0** - Code linting and quality assurance

## 📁 Project Architecture
```
Jobsync/
├── jobsyncbackend/
│   ├── index.js                    # Main server file
│   ├── package.json               # Backend dependencies
│   ├── Config/
│   │   └── db.js                  # MongoDB connection
│   ├── Controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── employeeJobController.js # Job management
│   │   └── employeeController.js   # Employee operations
│   ├── Models/
│   │   ├── User.js                # User schema
│   │   ├── Employee.js            # Employee schema
│   │   └── Job.js                 # Job schema
│   ├── Routes/
│   │   ├── authRoute.js           # Auth endpoints
│   │   ├── employeeJobRoutes.js   # Job CRUD operations
│   │   ├── employeeRoutes.js      # Employee management
│   │   └── jobRoute.js            # Job listings
│   └── middleware/
│       └── authMiddleware.js      # JWT verification
│
├── jobsyncfrontend/
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── src/
│   │   ├── App.jsx                # Main application component
│   │   ├── main.jsx               # Application entry point
│   │   └── Component/
│   │       ├── Admin/             # Admin panel components
│   │       │   ├── AdminDashbord/ # Dashboard with analytics
│   │       │   ├── AdminJobList/  # Job management interface
│   │       │   ├── AdminRequest/  # Approval workflow
│   │       │   ├── AdminUser/     # User management
│   │       │   └── AdminCompany/  # Company management
│   │       ├── Job/               # Job listing components
│   │       │   ├── Job.jsx        # Main job listing
│   │       │   └── JobCard.jsx    # Individual job cards
│   │       ├── Companie/          # Company profiles
│   │       ├── Employee/          # Employee dashboard
│   │       ├── Login/             # Authentication
│   │       ├── Register/          # User registration
│   │       ├── Navbar/            # Navigation
│   │       └── Footer/            # Footer component
│   └── public/                    # Static assets
└── README.md                      # Project documentation
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 🔧 Backend Setup
```bash
# Navigate to backend directory
cd jobsyncbackend

# Install dependencies
npm install

# Create environment file
# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=8000

# Start development server
npm run dev
# or
nodemon index.js

# Server runs on http://localhost:8000
```

### ⚡ Frontend Setup
```bash
# Navigate to frontend directory
cd jobsyncfrontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

## 🌐 API Endpoints

### 🔐 Authentication
- `POST /auth/login` - User/Admin login
- `POST /auth/register` - User registration
- `GET /auth/verify` - Token verification

### 👥 User Management
- `GET /employee/all` - Get all employees
- `POST /employee/create` - Create employee profile
- `PUT /employee/update/:id` - Update employee information

### 💼 Job Management
- `GET /employee/fetchjobs` - Get all jobs (public)
- `POST /employee/addjob` - Create new job (authenticated)
- `GET /employee/myjobs` - Get user's posted jobs
- `PUT /employee/job/:jobId/status` - Update job status
- `DELETE /job/delete/:id` - Delete job

### 🏢 Company Operations
- Dynamic company extraction from job submissions
- Real-time job statistics by company
- Company profile generation from job data

## 🎨 UI/UX Features

### Modern Design Elements
- **Gradient Backgrounds** - Beautiful color transitions
- **Card-based Layout** - Clean, organized information display
- **Hover Animations** - Interactive feedback on user actions
- **Responsive Grid System** - Adaptable to all screen sizes
- **Professional Typography** - Consistent and readable fonts

### Advanced Filtering
- **Multi-category Filters** - Industry, location, department, job count
- **Real-time Search** - Instant results as you type
- **Dynamic Filter Generation** - Filters created from actual data
- **Filter Persistence** - Maintains selections across navigation

### Admin Interface
- **Tab-based Navigation** - Organized workflow management
- **Status Indicators** - Visual representation of job/request states
- **Bulk Operations** - Efficient management of multiple items
- **Analytics Dashboard** - Real-time statistics and insights

## 📊 Data Flow Architecture

```
User Input → Frontend (React) → API (Express) → Database (MongoDB) → Response → UI Update
```

### Key Data Models
- **User Model** - Authentication and basic information
- **Employee Model** - Extended profile with skills and experience
- **Job Model** - Complete job postings with all details
- **Company Model** - Dynamically generated from job submissions

## 🔒 Security Features

- **JWT Authentication** - Stateless token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Route Protection** - Middleware-based access control
- **CORS Configuration** - Cross-origin request management
- **Input Validation** - Comprehensive form validation with Yup

## 🌟 Recent Updates

### Latest Enhancements (October 2025)
- **Complete API Migration** - All components now use real employee job API
- **Dynamic Company System** - Companies extracted from actual job submissions
- **Enhanced Admin Interface** - Professional styling with modern UI components
- **Advanced Filtering** - Dynamic filter generation from real data
- **Improved Performance** - Optimized API calls and state management
- **Mobile Responsiveness** - Enhanced mobile experience across all components

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/PatelMeet2005/Jobsync.git
   cd Jobsync
   ```

2. **Setup Backend**
   ```bash
   cd jobsyncbackend
   npm install
   # Configure .env file
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../jobsyncfrontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow React best practices and hooks patterns
- Use semantic commit messages
- Implement proper error handling
- Write meaningful component and function names
- Maintain consistent code formatting with ESLint

## 📞 Support & Contact

For questions, suggestions, or support:
- **Email**: [backend@nextgen.com](mailto:backend@nextgen.com)
- **GitHub Issues**: Report bugs or request features
- **Project Repository**: [Jobsync on GitHub](https://github.com/PatelMeet2005/Jobsync)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by the Jobsync Team** | *Connecting talent with opportunities*
