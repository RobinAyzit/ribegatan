# Deployment Guide - Ribegatan Admin CMS

## Railway Deployment

### Steg 1: Förbered projektet
Alla nödvändiga filer är redan på plats:
- `railway.json` - Railway konfiguration
- `nixpacks.toml` - Build konfiguration
- `Procfile` - Process definition
- `package.json` - Dependencies

### Steg 2: Skapa Railway projekt
1. Gå till [railway.app](https://railway.app)
2. Logga in med GitHub
3. Klicka "New Project"
4. Välj "Deploy from GitHub repo"
5. Välj ditt `ribegatan` repository

### Steg 3: Konfigurera miljövariabler (valfritt)
I Railway dashboard:
- `NODE_ENV=production`
- `PORT` (sätts automatiskt av Railway)

### Steg 4: Deploy
Railway kommer automatiskt att:
1. Installera dependencies (`npm ci`)
2. Starta servern (`node admin/api/server.js`)

### Steg 5: Hämta din backend URL
Efter deployment, kopiera din Railway URL (t.ex. `https://ribegatan-production.up.railway.app`)

### Steg 6: Uppdatera frontend
Öppna `inline-editor.js` och ändra:
```javascript
API_URL: 'https://DIN-RAILWAY-URL.up.railway.app/api'
```

### Steg 7: Pusha till GitHub
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Din admin-funktionalitet kommer nu fungera på GitHub Pages!

## Felsökning

### Railway deployment misslyckas
- Kontrollera Railway logs i dashboard
- Verifiera att alla dependencies finns i `package.json`
- Kontrollera att `admin/api/server.js` finns

### CORS-fel
- Verifiera att GitHub Pages URL finns i `allowedOrigins` i `admin/api/server.js`
- Kontrollera att du använder HTTPS (inte HTTP) för Railway URL

### 401 Unauthorized
- Kontrollera att JWT token skickas korrekt
- Verifiera att `users.json` finns i `admin/api/data/`

## Alternativ: Render.com

Om Railway inte fungerar, prova Render.com:

1. Gå till [render.com](https://render.com)
2. Skapa "New Web Service"
3. Anslut GitHub repo
4. Konfigurera:
   - **Build Command**: `npm install`
   - **Start Command**: `node admin/api/server.js`
   - **Environment**: Node
5. Deploy

## Alternativ: Vercel

För Vercel behöver du skapa en `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "admin/api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "admin/api/server.js"
    }
  ]
}
```
