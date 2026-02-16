const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/error-handler');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');

// Middleware
// CORS - tillåt både lokal utveckling och GitHub Pages
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'https://robinayzit.github.io'
];

app.use(cors({
  origin: function(origin, callback) {
    // Tillåt requests utan origin (som Postman eller server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser för JSON med ökad gräns för stora HTML-filer
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servera statiska filer från admin-mappen och root
app.use('/admin', express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../..')));

// Logga alla requests i utvecklingsmiljö
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Root endpoint - redirect till admin panel
app.get('/', (req, res) => {
  res.redirect('/admin/index.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint hittades inte',
    message: `${req.method} ${req.path} finns inte`,
    availableEndpoints: ['/api/auth', '/api/content', '/api/media']
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Admin CMS API Server`);
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});

module.exports = app;
