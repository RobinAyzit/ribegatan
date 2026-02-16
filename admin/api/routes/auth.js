const express = require('express');
const router = express.Router();
const { authenticateUser, generateToken, verifyToken } = require('../services/auth-service');
const { authenticateToken } = require('../middleware/auth-middleware');

/**
 * POST /api/auth/login
 * Autentiserar användare och returnerar JWT-token
 * Validerar: Krav 1.2, 1.3
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validera input
    if (!username || !password) {
      return res.status(400).json({
        error: 'Ogiltiga inloggningsuppgifter',
        message: 'Användarnamn och lösenord krävs'
      });
    }

    // Autentisera användare
    const user = await authenticateUser(username, password);

    if (!user) {
      // Krav 1.3: Avvisa felaktiga inloggningsuppgifter
      return res.status(401).json({
        error: 'Felaktigt användarnamn eller lösenord',
        message: 'Inloggningen misslyckades. Kontrollera dina uppgifter och försök igen.'
      });
    }

    // Krav 1.2: Skapa giltig session med JWT-token
    const token = generateToken(user);

    // Returnera token och användarinfo
    res.json({
      success: true,
      token,
      expiresIn: '24h',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Inloggningen kunde inte genomföras. Försök igen senare.'
    });
  }
});

/**
 * POST /api/auth/logout
 * Loggar ut användare (client-side token removal)
 * Validerar: Krav 1.6
 */
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // Krav 1.6: Avsluta session
    // Med JWT är logout huvudsakligen client-side (ta bort token)
    // Men vi kan logga händelsen här för audit trail
    console.log(`User ${req.user.username} logged out at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Utloggning lyckades'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Utloggningen kunde inte genomföras.'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verifierar om nuvarande token är giltig
 * Validerar: Krav 1.4, 1.5
 */
router.get('/verify', authenticateToken, (req, res) => {
  try {
    // Om vi kommer hit har authenticateToken-middleware redan verifierat token
    // Krav 1.4, 1.5: Bibehåll autentisering under användarens besök
    res.json({
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      error: 'Ett internt serverfel inträffade',
      message: 'Token-verifiering misslyckades.'
    });
  }
});

module.exports = router;
