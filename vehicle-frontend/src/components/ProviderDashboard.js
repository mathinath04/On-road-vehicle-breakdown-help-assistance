import React, { useEffect, useState } from 'react';

const ProviderDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const providerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests');
        const data = await response.json();
        if (data.success) {
          setPendingRequests(data.helpRequests);
        } else {
          alert('❌ Failed to fetch pending help requests.');
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        alert('⚠️ Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    if (!providerId) {
      alert('🔒 Provider not logged in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/accept-help/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerId }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Request accepted!');
        setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        alert(data.message || '❌ Failed to accept request.');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('⚠️ Error processing request.');
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-status/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Status updated!');
        setPendingRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status } : req
          )
        );
      } else {
        alert(data.message || '❌ Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('⚠️ Error updating status.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">🛠 Pending Help Requests</h2>
      {loading ? (
        <p>⏳ Loading...</p>
      ) : pendingRequests.length > 0 ? (
        <ul className="list-group shadow">
          {pendingRequests.map((req) => (
            <li key={req.id} className="list-group-item mb-3 rounded">
              <strong>🆔 Request ID:</strong> {req.id} <br />
              <strong>📍 Location:</strong> {req.location || 'Not specified'}<br />
              <strong>🛠 Issue:</strong> {req.issue || req.details}<br />
              <strong>🧑‍🔧 Provider:</strong>{' '}
              {req.provider_name ? `${req.provider_name} (${req.provider_email})` : 'Not assigned yet'}<br />
              <strong>📌 Status:</strong> {req.status || 'Pending'}<br />
              {!req.provider_id && (
                <button
                  className="btn btn-success mt-2 me-2"
                  onClick={() => acceptRequest(req.id)}
                >
                  ✅ Accept Help
                </button>
              )}

              {req.provider_id?.toString() === providerId && (
                <select
                  className="form-select mt-2"
                  defaultValue=""
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  <option value="In Progress">🟡 In Progress</option>
                  <option value="Resolved">✅ Resolved</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>🎉 No pending requests right now.</p>
      )}
    </div>
  );
};

export default ProviderDashboard;
