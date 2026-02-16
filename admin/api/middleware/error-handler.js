/**
 * Global Error Handler Middleware
 * Hanterar alla fel som kastas i applikationen
 */

function errorHandler(err, req, res, next) {
  // Logga felet
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Fil för stor',
      message: 'Filen är för stor (max 10MB)'
    });
  }

  if (err.message && err.message.includes('Endast JPEG')) {
    return res.status(400).json({
      error: 'Ogiltig filtyp',
      message: err.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Ogiltig autentiseringstoken',
      message: 'Din session är ogiltig. Vänligen logga in igen.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Session har gått ut',
      message: 'Din session har gått ut. Vänligen logga in igen.'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Valideringsfel',
      message: err.message
    });
  }

  // File system errors
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'Filen kunde inte hittas',
      message: 'Den begärda filen eller resursen finns inte'
    });
  }

  if (err.code === 'EACCES') {
    return res.status(500).json({
      error: 'Åtkomst nekad',
      message: 'Servern har inte behörighet att läsa/skriva filen'
    });
  }

  if (err.code === 'ENOSPC') {
    return res.status(507).json({
      error: 'Otillräckligt diskutrymme',
      message: 'Servern har inte tillräckligt med diskutrymme'
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    error: 'Ett internt serverfel inträffade',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ett oväntat fel inträffade. Försök igen senare.'
      : err.message
  });
}

module.exports = errorHandler;
