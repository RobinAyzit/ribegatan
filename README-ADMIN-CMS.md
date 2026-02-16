# Admin CMS System - Ribegatan.se

Ett komplett innehållshanteringssystem för att administrera ribegatan.se lokalt.

## 🚀 Snabbstart

### 1. Installera beroenden
```bash
npm install
```

### 2. Starta backend-servern
```bash
npm start
```

Servern startar på `http://localhost:3000`

### 3. Öppna Admin-panelen

Öppna `admin/index.html` i din webbläsare, eller använd Live Server i VS Code.

### 4. Logga in

- **Användarnamn:** `ADMIN`
- **Lösenord:** `MINDA164!`

## ✨ Funktioner

### ✅ Implementerat (MVP)

- **🔐 Autentisering:** Säker inloggning med JWT-tokens
- **📝 Inläggshantering:** Skapa, redigera och radera inlägg
- **📄 Sidhantering:** Visa alla HTML-sidor på webbplatsen
- **🖼️ Mediahantering:** Ladda upp och radera bilder (med varning om bilden används)
- **🎨 Färghantering:** Ändra CSS-färger för element
- **📊 Dashboard:** Översikt med statistik över inlägg, sidor och bilder
- **📱 Responsiv design:** Fungerar på desktop, surfplatta och mobil

## 🎯 Hur du använder systemet

### Skapa ett nytt inlägg
1. Klicka på "Inlägg" i navigationen
2. Klicka på "Nytt inlägg"
3. Fyll i titel, kategori och innehåll
4. Klicka "Spara"

### Ladda upp en bild
1. Klicka på "Media" i navigationen
2. Klicka på "Ladda upp bild"
3. Välj katalog (img, res eller assets)
4. Välj bildfil
5. Klicka "Ladda upp"

### Ändra färger
1. Klicka på "Färger" i navigationen
2. Ange CSS-selektor (t.ex. `.header` eller `body`)
3. Välj egenskap (color, background-color, etc.)
4. Välj färg med färgväljaren
5. Klicka "Tillämpa"

## 📁 Projektstruktur

```
ribegatan.se/
├── admin/                      # Admin CMS
│   ├── index.html             # Admin panel
│   ├── css/
│   │   └── admin.css          # Admin styling
│   ├── js/
│   │   ├── app.js             # Huvudapplikation
│   │   ├── auth.js            # Autentisering
│   │   ├── content-editor.js  # Innehållsredigering
│   │   └── media-manager.js   # Bildhantering
│   └── api/                   # Backend API
│       ├── server.js          # Express server
│       ├── routes/            # API routes
│       ├── services/          # Business logic
│       ├── middleware/        # Auth middleware
│       └── data/              # JSON-datalagring
├── package.json
└── README-ADMIN-CMS.md
```

## 🔧 API Endpoints

### Autentisering
- `POST /api/auth/login` - Logga in
- `POST /api/auth/logout` - Logga ut
- `GET /api/auth/verify` - Verifiera token

### Innehåll
- `GET /api/content/posts` - Hämta alla inlägg
- `POST /api/content/posts` - Skapa inlägg
- `PUT /api/content/posts/:id` - Uppdatera inlägg
- `DELETE /api/content/posts/:id` - Radera inlägg
- `GET /api/content/pages` - Hämta alla sidor
- `PUT /api/content/styles` - Uppdatera CSS-stilar

### Media
- `GET /api/media/images` - Hämta alla bilder
- `POST /api/media/upload` - Ladda upp bild
- `DELETE /api/media/images/:filename` - Radera bild

## 🛠️ Teknisk Stack

- **Backend:** Node.js, Express
- **Autentisering:** JWT, bcrypt
- **Filuppladdning:** Multer
- **Frontend:** Vanilla JavaScript, CSS3
- **Datalagring:** Filbaserad (JSON)

## 🔒 Säkerhet

- Lösenord hashas med bcrypt
- JWT-tokens för sessionshantering (24h utgångstid)
- CORS-konfiguration för lokal utveckling
- Filvalidering för uppladdningar (max 10MB, endast JPEG/PNG/GIF/WebP)
- Autentisering krävs för alla admin-operationer
- Path traversal-skydd

## 🐛 Felsökning

### Servern startar inte
- Kontrollera att port 3000 är ledig
- Kör `npm install` igen

### Kan inte logga in
- Kontrollera att servern körs (`npm start`)
- Använd exakt: `ADMIN` / `MINDA164!`
- Öppna konsolen (F12) för felmeddelanden

### CORS-fel
- Öppna admin/index.html via en lokal server (Live Server i VS Code)
- Eller öppna direkt från filsystemet (file://)

### Bilder laddas inte
- Kontrollera att katalogerna `img/`, `res/`, `assets/` finns
- Verifiera att servern har skrivbehörighet

## 📝 Nästa steg (Framtida funktioner)

- ⏳ Säkerhetskopiering och återställning
- ⏳ Versionshantering av innehåll
- ⏳ Avancerad HTML-sidredigering
- ⏳ Bildoptimering vid uppladdning
- ⏳ Deployment till GitHub Pages

## 🎉 Klart att testa!

Systemet är nu redo för lokal testning. När du är nöjd med hur det fungerar kan du be mig hjälpa dig att deploya det till GitHub.

**Viktigt:** Detta är en lokal utvecklingsmiljö. Innan deployment till produktion bör du:
1. Ändra JWT_SECRET i auth-service.js
2. Konfigurera HTTPS
3. Sätta upp en riktig databas (om önskat)
4. Implementera rate limiting för produktion
