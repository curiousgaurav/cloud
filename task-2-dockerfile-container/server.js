const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'curiousgaurav-app';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    app: APP_NAME,
    timestamp: new Date().toISOString()
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${APP_NAME}`,
    description: 'This is a Docker containerized Node.js application',
    container: process.env.HOSTNAME,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// API endpoint
app.get('/api/info', (req, res) => {
  res.json({
    app_name: APP_NAME,
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    container_id: process.env.HOSTNAME
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${APP_NAME}] Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Visit http://localhost:${PORT}`);
});
