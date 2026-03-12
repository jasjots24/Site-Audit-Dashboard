const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our new routes
const scanRoutes = require('./routes/scanRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// All your SEO endpoints will now start with /api (e.g., POST /api/scan)
app.use('/api', scanRoutes);

// Health Check
app.get('/health', (req, res) => res.send('SEO Engine is Online'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  -----------------------------------------
  🚀 SEO ENGINE SERVER RUNNING ON PORT ${PORT}
  📁 Architecture: Modular & Distributed
  -----------------------------------------
  `);
});