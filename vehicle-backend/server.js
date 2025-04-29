const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const helpRoutes = require('./routes/helpRequest'); // ✅ NEW route

const app = express();
const PORT = 5000;

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use('/api', authRoutes);       // /api/login and /api/register
app.use('/api', helpRoutes);       // /api/help-request and /api/my-requests

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
