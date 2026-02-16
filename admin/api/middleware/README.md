# Auth Middleware

Middleware för att verifiera JWT-tokens och skydda admin-endpoints.

## Användning

### Grundläggande autentisering

```javascript
const { authenticateToken } = require('./middleware/auth-middleware');

// Skydda en route
app.get('/api/content/posts', authenticateToken, (req, res) => {
  // req.user innehåller användarinfo
  console.log('Användare:', req.user.username);
  res.json({ posts: [] });
});
```

### Kräv admin-roll

```javascript
const { authenticateToken, requireAdmin } = require('./middleware/auth-middleware');

// Skydda en route och kräv admin-roll
app.delete('/api/content/posts/:id', authenticateToken, requireAdmin, (req, res) => {
  // Endast admin-användare kommer hit
  res.json({ success: true });
});
```

## Felhantering

Middleware returnerar följande felsvar:

### Ingen token (401)
```json
{
  "error": "Autentisering krävs",
  "message": "Ingen autentiseringstoken tillhandahölls"
}
```

### Ogiltig/utgången token (401)
```json
{
  "error": "Ogiltig autentiseringstoken",
  "message": "Token är ogiltig eller har gått ut. Vänligen logga in igen."
}
```

### Otillräckliga rättigheter (403)
```json
{
  "error": "Otillräckliga rättigheter",
  "message": "Du har inte behörighet att utföra denna åtgärd"
}
```

## Token-format

Tokens ska skickas i Authorization header:

```
Authorization: Bearer <token>
```

## Validerar

- **Krav 1.2**: Autentisering med JWT-tokens
- **Krav 1.5**: Session bibehålls under användarens besök
