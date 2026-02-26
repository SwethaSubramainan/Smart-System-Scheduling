const express = require('express');
const cors = require('cors');

// Import routes
const jobRoutes = require('./routes/jobRoutes');
const machineRoutes = require('./routes/machineRoutes');
const workerRoutes = require('./routes/workerRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Smart Scheduling API is running' });
});

// App Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/schedule', scheduleRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
