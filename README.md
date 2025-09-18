# Jobsync

Jobsync is a modern job portal platform with a full-featured admin panel, job listing management, company and user management, and job request approval workflow.

## Features
- Admin dashboard with statistics (users, employees, jobs, requests)
- Job posting and management (CRUD)
- Company management with job statistics
- User management (job seekers & employers)
- Job request approval system
- Responsive design for all devices
- JWT authentication

## Tech Stack
- **Frontend:** React.js (Vite), Axios, CSS (Flexbox/Grid)
- **Backend:** Node.js, Express.js, MongoDB, JWT

## Project Structure
```
jobsyncbackend/
  index.js
  package.json
  Config/
  Controllers/
  Models/
  Routes/
jobsyncfrontend/
  src/
  public/
  package.json
```

## Setup Instructions

### Backend
1. `cd jobsyncbackend`
2. Install dependencies: `npm install`
3. Start server: `nodemon index.js`
4. Server runs on `http://localhost:8000`

### Frontend
1. `cd jobsyncfrontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. App runs on `http://localhost:5173`

## API Endpoints (Sample)
- `POST /user/login` - User login
- `POST /user/register` - User registration
- `GET /admin/getJobs` - Get all jobs
- `POST /admin/addJob` - Add new job
- `DELETE /admin/deleteJob/:id` - Delete job
- ...and more in `/jobsyncbackend/Routes/`

## Contribution
Pull requests and suggestions are welcome! Please fork the repo and submit PRs.

## Contact
For questions or support, contact the maintainer at [backend@nextgen.com](mailto:backend@nextgen.com).
