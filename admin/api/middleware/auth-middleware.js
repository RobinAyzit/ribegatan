const { verifyToken } = require('../services/auth-service');

/**
 * Middleware för att verifiera JWT-tokens
 * Validerar: Krav 1.2, 1.5
 * 
 * Detta middleware:
 * 1. Extraherar token från Authorization header (Bearer token)
 * 2. Verifierar token med AuthService
 * 3. Lägger till användarinfo i request-objektet om giltig
 * 4. Returnerar lämpliga felsvar för ogiltiga/utgångna tokens
 */
function authenticateToken(req, res, next) {
  // Extrahera Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // Om ingen token finns, returnera 401
  if (!token) {
    return res.status(401).json({
      error: 'Autentisering krävs',
      message: 'Ingen autentiseringstoken tillhandahölls'
    });
  }

  // Verifiera token
  const decoded = verifyToken(token);

  // Om token är ogiltig eller utgången
  if (!decoded) {
    return res.status(401).json({
      error: 'Ogiltig autentiseringstoken',
      message: 'Token är ogiltig eller har gått ut. Vänligen logga in igen.'
    });
  }

  // Token är giltig - lägg till användarinfo i request
  req.user = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role
  };

  // Fortsätt till nästa middleware/route handler
  next();
}

/**
 * Middleware för att verifiera att användaren har admin-roll
 * Används efter authenticateToken för att säkerställa admin-åtkomst
 */
function requireAdmin(req, res, next) {
  // Kontrollera att användaren är autentiserad
  if (!req.user) {
    return res.status(401).json({
      error: 'Autentisering krävs',
      message: 'Du måste vara inloggad för att utföra denna åtgärd'
    });
  }

  // Kontrollera att användaren har admin-roll
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Otillräckliga rättigheter',
      message: 'Du har inte behörighet att utföra denna åtgärd'
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin
};
