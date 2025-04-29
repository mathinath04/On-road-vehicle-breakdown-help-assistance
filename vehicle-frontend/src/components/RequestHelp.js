import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestHelp.css';


const RequestHelp = () => {
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('⚠️ Please login to request help.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/help-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, details, location: 'Not specified' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Help request submitted successfully!');
        navigate('/my-requests');
      } else {
        alert(data.message || '❌ Failed to create request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('🚨 Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">🆘 Request Help</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="details" className="form-label">Issue Description</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Describe the issue you're facing..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestHelp;