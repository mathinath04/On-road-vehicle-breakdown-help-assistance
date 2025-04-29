// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Login from '../src/components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/Dashboard/UserDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import RequestHelp from './components/RequestHelp';
import MyRequests from './components/MyRequests';
import LandingPage from './pages/LandingPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🟢 Public Routes */}
        <Route path="/" element={<LandingPage />} /> {/* ✅ Set to Landing Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔵 User Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/request-help" element={<RequestHelp />} />

        {/* 🟣 Service Provider Route */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
