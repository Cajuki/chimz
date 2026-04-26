import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Set axios base URL so all API calls go to the backend
// In dev, Vite proxies /api → http://localhost:5000
// In production, change this to your deployed backend URL
axios.defaults.baseURL = '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Global response interceptor for debugging
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('❌ Cannot reach backend. Is the server running on port 5000?');
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
