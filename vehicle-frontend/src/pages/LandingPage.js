import React from 'react';
import './LandingPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>On-Road Vehicle Breakdown Help Assistance</h1>
        <p>Need urgent vehicle help? We connect you with nearby service providers instantly!</p>
        <div className="button-group">
          <button onClick={() => navigate('/register')}>🆘 Request Help</button>
          <button onClick={() => navigate('/login')}>👨‍🔧 Login as Provider</button>
          <button onClick={() => navigate('/login')}>👤 Login as User</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
