// utils/employeeJobAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/employee';

// Get JWT token from storage
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// POST job to backend
export const postJob = async (jobData) => {
  try {
    const response = await apiClient.post('/addjob', jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET my jobs from backend
export const getMyJobs = async () => {
  try {
    const response = await apiClient.get('/myjobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET all jobs (public)
export const getAllJobs = async () => {
  try {
    const response = await apiClient.get('/fetchjobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};