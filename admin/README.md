# Admin CMS System - Ribegatan.se

Ett komplett innehållshanteringssystem för att administrera ribegatan.se.

## Installation

1. Installera beroenden:
```bash
npm install
```

## Användning

### Starta servern

```bash
npm start
```

Eller för utveckling med auto-reload:
```bash
npm run dev
```

Servern startar på `http://localhost:3000`

### Öppna Admin-panelen

1. Öppna `admin/index.html` i din webbläsare (eller använd en lokal server)
2. Logga in med:
   - **Användarnamn:** ADMIN
   - **Lösenord:** MINDA164!

## Funktioner

### ✅ Implementerat (MVP)

- **Autentisering:** Säker inloggning med JWT-tokens
- **Inläggshantering:** Skapa, redigera och radera inlägg
- **Sidhantering:** Visa och hantera statiska sidor
- **Mediahantering:** Ladda upp och radera bilder
- **Färghantering:** Ändra CSS-färger för element
- **Dashboard:** Översikt med statistik

### 🔄 Kommande funktioner

- Säkerhetskopiering och återställning
- Versionshantering
- Avancerad sidredigering
- Bildoptimering

## API Endpoints

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

## Teknisk Stack

- **Backend:** Node.js, Express
- **Autentisering:** JWT, bcrypt
- **Filuppladdning:** Multer
- **Frontend:** Vanilla JavaScript, CSS3
- **Datalagring:** Filbaserad (JSON)

## Säkerhet

- Lösenord hashas med bcrypt
- JWT-tokens för sessionshantering
- CORS-konfiguration för lokal utveckling
- Filvalidering för uppladdningar
- Autentisering krävs för alla admin-operationer

## Felsökning

### Servern startar inte
- Kontrollera att port 3000 är ledig
- Verifiera att alla beroenden är installerade

### Kan inte logga in
- Kontrollera att servern körs
- Verifiera användarnamn och lösenord
- Kontrollera konsolen för felmeddelanden

### Bilder laddas inte
- Kontrollera att katalogerna `img/`, `res/`, `assets/` finns
- Verifiera filbehörigheter

## Support

För frågor eller problem, kontakta systemadministratören.
