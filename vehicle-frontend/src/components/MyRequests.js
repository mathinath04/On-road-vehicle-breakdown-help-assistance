import React, { useEffect, useState } from 'react';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/my-requests/${userId}`);
        const data = await response.json();
        
        if (data.success) {  // Check if the response is successful
          setRequests(data.helpRequests);  // Update to use helpRequests
        } else {
          alert('⚠️ No help requests found.');
        }
      } catch (error) {
        console.error('Error fetching help requests:', error);
        alert('⚠️ Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRequests();
    } else {
      alert('🔒 User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">📋 My Help Requests</h2>
      {loading ? (
        <p>⏳ Loading...</p>
      ) : requests.length > 0 ? (
        <ul className="list-group shadow">
          {requests.map((req) => (
            <li key={req.id} className="list-group-item mb-3 rounded">
              <strong>🆔 Request ID:</strong> {req.id} <br />
              <strong>📍 Location:</strong> {req.location || 'Not specified'}<br />
              <strong>🛠 Issue:</strong> {req.details}<br />
              <strong>📊 Status:</strong> {req.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>🙁 You have not submitted any help requests yet.</p>
      )}
    </div>
  );
};

export default MyRequests;
