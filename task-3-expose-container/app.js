const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware new 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
const APP_NAME = process.env.APP_NAME || 'curiousgaurav-exposed-app';
const startTime = new Date();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ Routes ============

// Root route
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${APP_NAME}`,
    description: 'This is a Docker containerized Node.js application with exposed ports',
    port: PORT,
    container_id: process.env.HOSTNAME,
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'healthy',
    app: APP_NAME,
    uptime: Math.floor(process.uptime()),
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'online',
    app_name: APP_NAME,
    version: '1.0.0',
    uptime_seconds: Math.floor(uptime),
    uptime_formatted: formatUptime(uptime),
    started_at: startTime.toISOString(),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
    },
    node_version: process.version,
    os: process.platform
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    api_version: '1.0.0',
    app: APP_NAME,
    exposed_ports: [8080, 3000, 5000],
    container_id: process.env.HOSTNAME,
    environment: process.env.NODE_ENV,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /status',
      'GET /api/info',
      'GET /api/server-details',
      'POST /api/echo',
      'GET /metrics'
    ]
  });
});

// Server details
app.get('/api/server-details', (req, res) => {
  res.json({
    server_name: APP_NAME,
    listening_port: PORT,
    all_exposed_ports: [8080, 3000, 5000],
    request_ip: req.ip,
    request_host: req.hostname,
    request_protocol: req.protocol,
    current_time: new Date().toISOString(),
    container_hostname: process.env.HOSTNAME
  });
});

// Echo endpoint for testing
app.post('/api/echo', (req, res) => {
  res.json({
    message: 'Echo received',
    received_data: req.body,
    timestamp: new Date().toISOString(),
    container: process.env.HOSTNAME
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  res.json({
    uptime_ms: Math.floor(uptime * 1000),
    memory_heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
    memory_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
    timestamp: Date.now(),
    container_id: process.env.HOSTNAME
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requested_path: req.path,
    method: req.method,
    available_endpoints_info: 'Visit GET /api/info for list of available endpoints'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============ Server Start ============

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`  ${APP_NAME}`);
  console.log('='.repeat(50));
  console.log(`✓ Server is running on port: ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  console.log(`✓ Container ID: ${process.env.HOSTNAME}`);
  console.log(`✓ Started at: ${startTime.toISOString()}`);
  console.log('\n  Available endpoints:');
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/health`);
  console.log(`  - http://localhost:${PORT}/status`);
  console.log(`  - http://localhost:${PORT}/api/info`);
  console.log(`  - http://localhost:${PORT}/api/server-details`);
  console.log(`  - http://localhost:${PORT}/metrics`);
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
