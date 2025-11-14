const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const authRoute = require('./Routes/authRoute');
const jobRoute = require('./Routes/jobRoute');
const employeeRoute = require('./Routes/employeeRoutes');
const employeeJobRoute = require('./Routes/employeeJobRoutes');
const applicationRoutes = require('./Routes/applicationRoutes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();


// Initialize Express app
const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type , Authorization', // Allow specific headers
  credentials: true // Allow credentials
}));




// Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Define a register route    
app.use('/user',authRoute);

app.use('/admin', jobRoute);

// employee route

app.use('/employee', employeeRoute);

app.use('/employee', employeeJobRoute);

// Application routes
app.use('/applications', applicationRoutes);

// Serve uploaded resumes statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 8000;

// Start server after DB connection is established
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Graceful handling of unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});