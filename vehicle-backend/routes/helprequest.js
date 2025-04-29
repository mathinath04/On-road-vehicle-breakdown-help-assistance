const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ✅ Submit help request
router.post('/help-request', (req, res) => {
  const { userId, location, details } = req.body;

  if (!userId || !location || !details) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO help_requests (user_id, location, details) VALUES (?, ?, ?)';
  db.query(sql, [userId, location, details], (err, result) => {
    if (err) {
      console.error('Error submitting help request:', err);
      return res.status(500).json({ message: 'Failed to submit help request' });
    }
    res.status(201).json({ success: true, message: 'Help request submitted' });
  });
});

// ✅ Get all help requests (for provider) with provider name
router.get('/requests', (req, res) => {
  const sql = `
    SELECT hr.*, u.name AS provider_name, u.email AS provider_email
    FROM help_requests hr
    LEFT JOIN users u ON hr.provider_id = u.id
    ORDER BY hr.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching help requests with provider info:', err);
      return res.status(500).json({ message: 'Error fetching help requests' });
    }
    res.status(200).json({ success: true, helpRequests: results });
  });
});

// ✅ Get help requests for a specific user (with provider name)
router.get('/my-requests/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT hr.*, u.name AS provider_name, u.email AS provider_email
    FROM help_requests hr
    LEFT JOIN users u ON hr.provider_id = u.id
    WHERE hr.user_id = ?
    ORDER BY hr.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user requests' });
    }
    res.status(200).json({ success: true, helpRequests: results });
  });
});

// ✅ Get pending help requests for providers
router.get('/pending', (req, res) => {
  const sql = 'SELECT * FROM help_requests WHERE status IS NULL ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching pending requests' });
    res.status(200).json({ success: true, helpRequests: results });
  });
});

// ✅ Update help request status (for provider)
router.put('/update-status/:id', (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status field is required' });
  }

  const sql = 'UPDATE help_requests SET status = ? WHERE id = ?';
  db.query(sql, [status, requestId], (err, result) => {
    if (err) {
      console.error('Error updating request status:', err);
      return res.status(500).json({ message: 'Failed to update request status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Request status updated successfully' });
  });
});

// ✅ Accept help request (for provider)
router.post('/accept-help/:id', (req, res) => {
  const requestId = req.params.id;
  const { providerId } = req.body;

  if (!providerId) {
    console.warn('Missing providerId in request body');
    return res.status(400).json({ message: 'Provider ID is required' });
  }

  const sql = 'UPDATE help_requests SET provider_id = ?, status = ? WHERE id = ?';
  db.query(sql, [providerId, 'In Progress', requestId], (err, result) => {
    if (err) {
      console.error('Error accepting help request:', err);
      return res.status(500).json({ message: '❌ Failed to accept help request' });
    }

    if (result.affectedRows === 0) {
      console.warn(`No help request found with ID: ${requestId}`);
      return res.status(404).json({ message: 'Help request not found' });
    }

    res.status(200).json({
      success: true,
      message: `✅ Help request ${requestId} accepted and marked as In Progress`,
    });
  });
});

module.exports = router;
