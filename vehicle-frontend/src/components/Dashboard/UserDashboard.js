import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  const [helpRequests, setHelpRequests] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/my-requests/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setHelpRequests(data.helpRequests);
          } else {
            console.error('Error:', data.message);
          }
        })
        .catch(error => console.error('Error fetching help requests:', error));
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2 className="dashboard-title">🚗 User Dashboard</h2>
        <p className="dashboard-text">
          Welcome{userEmail ? `, ${userEmail}` : ''}! Ready to request assistance?
        </p>

        <div className="dashboard-buttons">
          <Link to="/request-help" className="dashboard-btn primary">Request Help</Link>
          <Link to="/my-requests" className="dashboard-btn primary">My Requests</Link>
          <button onClick={handleLogout} className="dashboard-btn secondary">Logout</button>
        </div>

        <div className="help-requests-section">
          <h3>📋 My Help Requests</h3>
          {helpRequests.length > 0 ? (
            <ul className="help-request-list">
              {helpRequests.map((request) => (
                <li key={request.id} className="help-request-item">
                  <p><strong>Status:</strong> {request.status || 'Pending'}</p>
                  <p><strong>Details:</strong> {request.details}</p>
                  <p><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</p>
                  {request.provider_name && (
                    <>
                      <p><strong>Provider Name:</strong> {request.provider_name}</p>
                      <p><strong>Provider Email:</strong> {request.provider_email}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No help requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
