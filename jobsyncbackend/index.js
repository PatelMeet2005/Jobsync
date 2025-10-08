const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const authRoute = require('./Routes/authRoute');
const jobRoute = require('./Routes/jobRoute');
const employeeRoute = require('./Routes/employeeRoutes');
const employeeJobRoute = require('./Routes/employeeJobRoutes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();



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

const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});