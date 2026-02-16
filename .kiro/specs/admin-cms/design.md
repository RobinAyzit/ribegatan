# Designdokument - Admin CMS System

## Översikt

Admin CMS-systemet är ett innehållshanteringssystem för ribegatan.se som möjliggör administrativ kontroll över webbplatsens innehåll. Systemet är designat för lokal utveckling och testning innan deployment till GitHub Pages.

### Designbeslut

**Arkitekturvalet: Hybrid Static + Dynamic CMS**

Vi väljer en hybrid-arkitektur där:
- Frontend förblir statisk HTML/CSS/JS för snabb laddning
- Admin-panelen är en separat Single Page Application (SPA)
- Backend API hanterar autentisering och innehållsändringar
- Innehåll lagras som JSON-filer och HTML-filer för enkel versionshantering

**Teknologival:**
- **Backend**: Node.js med Express (lätt att köra lokalt, bra filhantering)
- **Frontend Admin**: Vanilla JavaScript med modern CSS (ingen build-process behövs)
- **Autentisering**: JWT (JSON Web Tokens) för sessionhantering
- **Datalagring**: Filbaserad (JSON för metadata, HTML för sidor)
- **Bildhantering**: Multer för uppladdning, Sharp för bildoptimering

## Arkitektur

### Systemkomponenter

```
┌─────────────────────────────────────────────────────────────┐
│                     Ribegatan.se                            │
│                  (Statisk webbplats)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Läser från
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Filsystem                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ HTML-filer   │  │ JSON-data    │  │ Bilder       │     │
│  │ (sidor)      │  │ (metadata)   │  │ (media)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Skriver till
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Admin CMS Backend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express API Server                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────┐      │  │
│  │  │ Auth       │ │ Content    │ │ Media       │      │  │
│  │  │ Service    │ │ Service    │ │ Service     │      │  │
│  │  └────────────┘ └────────────┘ └─────────────┘      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│              Admin Panel (SPA)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────┐      │  │
│  │  │ Login      │ │ Content    │ │ Media       │      │  │
│  │  │ View       │ │ Editor     │ │ Manager     │      │  │
│  │  └────────────┘ └────────────┘ └─────────────┘      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Katalogstruktur

```
ribegatan.se/
├── index.html                    # Publika sidor
├── *.html
├── css/
├── js/
├── img/
├── res/
├── admin/                        # Admin CMS
│   ├── index.html               # Admin panel SPA
│   ├── css/
│   │   └── admin.css
│   ├── js/
│   │   ├── app.js              # Main admin app
│   │   ├── auth.js             # Autentisering
│   │   ├── content-editor.js   # Innehållsredigering
│   │   └── media-manager.js    # Bildhantering
│   └── api/                     # Backend API
│       ├── server.js           # Express server
│       ├── routes/
│       │   ├── auth.js
│       │   ├── content.js
│       │   └── media.js
│       ├── services/
│       │   ├── auth-service.js
│       │   ├── content-service.js
│       │   └── media-service.js
│       ├── middleware/
│       │   └── auth-middleware.js
│       └── data/
│           ├── users.json      # Admin-användare
│           ├── content.json    # Innehållsmetadata
│           └── backups/        # Säkerhetskopior
└── package.json
```

## Komponenter och Gränssnitt

### 1. Autentiseringsmodul

**Ansvar:**
- Validera inloggningsuppgifter
- Generera och validera JWT-tokens
- Hantera sessioner

**API Endpoints:**

```javascript
POST /api/auth/login
Request: { username: string, password: string }
Response: { token: string, expiresIn: number }

POST /api/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean }

GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { valid: boolean, user: object }
```

**Gränssnitt:**

```javascript
interface AuthService {
  login(username: string, password: string): Promise<AuthToken>
  logout(token: string): Promise<void>
  verifyToken(token: string): Promise<boolean>
  hashPassword(password: string): string
  comparePassword(password: string, hash: string): boolean
}

interface AuthToken {
  token: string
  expiresIn: number
  issuedAt: number
}
```

### 2. Innehållshanteringsmodul

**Ansvar:**
- CRUD-operationer för inlägg
- Redigera HTML-filer
- Hantera CSS-ändringar för färger
- Versionshantering

**API Endpoints:**

```javascript
// Inlägg
GET /api/content/posts
Response: { posts: Post[] }

POST /api/content/posts
Request: { title: string, content: string, category: string }
Response: { post: Post }

PUT /api/content/posts/:id
Request: { title: string, content: string }
Response: { post: Post }

DELETE /api/content/posts/:id
Response: { success: boolean }

// Sidor
GET /api/content/pages
Response: { pages: Page[] }

GET /api/content/pages/:filename
Response: { page: Page }

PUT /api/content/pages/:filename
Request: { content: string }
Response: { page: Page }

// Färger
PUT /api/content/styles
Request: { selector: string, property: string, value: string }
Response: { success: boolean }
```

**Gränssnitt:**

```javascript
interface ContentService {
  // Inlägg
  getAllPosts(): Promise<Post[]>
  getPost(id: string): Promise<Post>
  createPost(post: PostInput): Promise<Post>
  updatePost(id: string, post: PostInput): Promise<Post>
  deletePost(id: string): Promise<void>
  
  // Sidor
  getAllPages(): Promise<Page[]>
  getPage(filename: string): Promise<Page>
  updatePage(filename: string, content: string): Promise<Page>
  
  // Stilar
  updateStyle(selector: string, property: string, value: string): Promise<void>
  
  // Versionshantering
  getPageHistory(filename: string): Promise<Version[]>
  restoreVersion(filename: string, versionId: string): Promise<void>
}

interface Post {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

interface Page {
  filename: string
  title: string
  content: string
  lastModified: string
}

interface Version {
  id: string
  timestamp: string
  content: string
}
```

### 3. Mediahanteringsmodul

**Ansvar:**
- Ladda upp bilder
- Radera bilder
- Ersätta bilder
- Optimera bilder

**API Endpoints:**

```javascript
GET /api/media/images
Response: { images: Image[] }

POST /api/media/upload
Request: FormData with file
Response: { image: Image }

DELETE /api/media/images/:filename
Response: { success: boolean }

PUT /api/media/images/:filename
Request: FormData with file
Response: { image: Image }
```

**Gränssnitt:**

```javascript
interface MediaService {
  getAllImages(): Promise<Image[]>
  uploadImage(file: File, directory: string): Promise<Image>
  deleteImage(filename: string): Promise<void>
  replaceImage(filename: string, file: File): Promise<Image>
  optimizeImage(filename: string): Promise<void>
  getImageUsage(filename: string): Promise<string[]>
}

interface Image {
  filename: string
  path: string
  size: number
  dimensions: { width: number, height: number }
  uploadedAt: string
  usedIn: string[]
}
```

### 4. Säkerhetskopieringsmodul

**Ansvar:**
- Skapa säkerhetskopior
- Lista säkerhetskopior
- Återställa från säkerhetskopia

**API Endpoints:**

```javascript
GET /api/backup/list
Response: { backups: Backup[] }

POST /api/backup/create
Response: { backup: Backup }

POST /api/backup/restore/:id
Response: { success: boolean }
```

**Gränssnitt:**

```javascript
interface BackupService {
  createBackup(): Promise<Backup>
  listBackups(): Promise<Backup[]>
  restoreBackup(id: string): Promise<void>
  deleteBackup(id: string): Promise<void>
}

interface Backup {
  id: string
  timestamp: string
  size: number
  files: number
}
```

## Datamodeller

### Användare (users.json)

```json
{
  "users": [
    {
      "id": "admin-001",
      "username": "ADMIN",
      "passwordHash": "$2b$10$...",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Innehållsmetadata (content.json)

```json
{
  "posts": [
    {
      "id": "post-001",
      "title": "Välkommen till nya Ribegatan",
      "content": "<p>...</p>",
      "category": "nyheter",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "pages": [
    {
      "filename": "index.html",
      "title": "Startsida",
      "lastModified": "2024-01-01T00:00:00Z",
      "versions": [
        {
          "id": "v1",
          "timestamp": "2024-01-01T00:00:00Z",
          "backupPath": "backups/index-v1.html"
        }
      ]
    }
  ],
  "media": [
    {
      "filename": "logo.png",
      "path": "img/logo.png",
      "size": 45678,
      "dimensions": { "width": 200, "height": 100 },
      "uploadedAt": "2024-01-01T00:00:00Z",
      "usedIn": ["index.html", "Foereningen.html"]
    }
  ]
}
```

## Correctness Properties

*En property (egenskap) är en karakteristik eller beteende som ska gälla för alla giltiga körningar av ett system - i grund och botten ett formellt påstående om vad systemet ska göra. Properties fungerar som bryggan mellan läsbara specifikationer och maskinverifierbara korrekthetsgarantier.*

### Property 1: Autentisering krävs för alla admin-operationer

*För alla* API-anrop till admin-endpoints (utom /api/auth/login), ska systemet avvisa förfrågningar utan giltig JWT-token med HTTP 401 Unauthorized.

**Validerar: Krav 1.2, 1.5**

### Property 2: Inloggning med korrekta uppgifter ger giltig token

*För alla* inloggningsförsök med användarnamn "ADMIN" och lösenord "MINDA164!", ska Autentiseringsmodul returnera en giltig JWT-token som kan användas för efterföljande API-anrop.

**Validerar: Krav 1.2**

### Property 3: Inloggning med felaktiga uppgifter avvisas

*För alla* inloggningsförsök där användarnamn eller lösenord inte matchar lagrade värden, ska Autentiseringsmodul returnera HTTP 401 och ett felmeddelande.

**Validerar: Krav 1.3**

### Property 4: Skapade inlägg kan hämtas

*För alla* inlägg som skapas via POST /api/content/posts, ska efterföljande GET /api/content/posts innehålla det skapade inlägget med samma titel och innehåll.

**Validerar: Krav 2.3**

### Property 5: Raderade inlägg försvinner från listan

*För alla* inlägg som raderas via DELETE /api/content/posts/:id, ska efterföljande GET /api/content/posts inte innehålla det raderade inlägget.

**Validerar: Krav 2.7**

### Property 6: Uppdaterade inlägg behåller ID

*För alla* inlägg som uppdateras via PUT /api/content/posts/:id, ska inläggets ID förbli oförändrat medan titel och innehåll uppdateras.

**Validerar: Krav 2.5**

### Property 7: HTML-struktur bevaras vid textredigering

*För alla* sidor som uppdateras via PUT /api/content/pages/:filename, ska den resulterande HTML-filen vara välformad och bevara alla HTML-taggar som inte explicit ändrades.

**Validerar: Krav 3.4**

### Property 8: CSS-ändringar tillämpas korrekt

*För alla* stiländringar via PUT /api/content/styles, ska den angivna CSS-egenskapen för den angivna selektorn uppdateras i CSS-filen, och andra stilar ska förbli oförändrade.

**Validerar: Krav 4.4**

### Property 9: Uppladdade bilder sparas i korrekt katalog

*För alla* bilder som laddas upp via POST /api/media/upload, ska bildfilen sparas i den angivna katalogen (img/, res/, eller assets/) och vara åtkomlig via sin sökväg.

**Validerar: Krav 5.4**

### Property 10: Bildradering tar bort filen

*För alla* bilder som raderas via DELETE /api/media/images/:filename, ska bildfilen inte längre existera i filsystemet efter radering.

**Validerar: Krav 5.7**

### Property 11: Bildersättning behåller filnamn

*För alla* bilder som ersätts via PUT /api/media/images/:filename, ska det nya bildinnehållet sparas med samma filnamn som den ursprungliga bilden.

**Validerar: Krav 5.8**

### Property 12: Säkerhetskopior innehåller alla filer

*För alla* säkerhetskopior som skapas via POST /api/backup/create, ska säkerhetskopian innehålla alla HTML-filer, CSS-filer, bilder och JSON-datafiler som fanns vid tidpunkten för skapandet.

**Validerar: Krav 7.2**

### Property 13: Återställning från säkerhetskopia är idempotent

*För alla* säkerhetskopior, om systemet återställs från en säkerhetskopia och sedan omedelbart återställs från samma säkerhetskopia igen, ska filsystemets tillstånd vara identiskt efter båda återställningarna.

**Validerar: Krav 7.6**

### Property 14: Versionshistorik loggar alla ändringar

*För alla* siduppdateringar via PUT /api/content/pages/:filename, ska en ny version skapas i versionshistoriken med korrekt tidsstämpel och innehåll.

**Validerar: Krav 10.1**

### Property 15: Återställning av version återställer innehåll

*För alla* versioner i historiken, om en version återställs, ska sidans innehåll matcha innehållet som sparades i den versionen.

**Validerar: Krav 10.5**

## Felhantering

### Autentiseringsfel

- **Ogiltiga inloggningsuppgifter**: HTTP 401 med meddelande "Felaktigt användarnamn eller lösenord"
- **Utgången token**: HTTP 401 med meddelande "Session har gått ut, vänligen logga in igen"
- **Saknad token**: HTTP 401 med meddelande "Autentisering krävs"
- **Ogiltig token**: HTTP 401 med meddelande "Ogiltig autentiseringstoken"

### Innehållsfel

- **Sida finns inte**: HTTP 404 med meddelande "Sidan kunde inte hittas"
- **Ogiltigt HTML**: HTTP 400 med meddelande "Ogiltigt HTML-innehåll"
- **Inlägg finns inte**: HTTP 404 med meddelande "Inlägget kunde inte hittas"
- **Ogiltig CSS-selektor**: HTTP 400 med meddelande "Ogiltig CSS-selektor"

### Mediafel

- **Ogiltig filtyp**: HTTP 400 med meddelande "Endast JPEG, PNG, GIF och WebP stöds"
- **Fil för stor**: HTTP 413 med meddelande "Filen är för stor (max 10MB)"
- **Bild används**: HTTP 409 med meddelande "Bilden används på följande sidor: [lista]"
- **Bild finns inte**: HTTP 404 med meddelande "Bilden kunde inte hittas"

### Säkerhetskopieringsfel

- **Säkerhetskopia finns inte**: HTTP 404 med meddelande "Säkerhetskopian kunde inte hittas"
- **Otillräckligt diskutrymme**: HTTP 507 med meddelande "Otillräckligt diskutrymme för säkerhetskopia"
- **Återställning misslyckades**: HTTP 500 med meddelande "Återställning misslyckades: [detaljer]"

### Allmänna fel

- **Serverfel**: HTTP 500 med meddelande "Ett internt serverfel inträffade"
- **Filsystemfel**: HTTP 500 med meddelande "Kunde inte läsa/skriva fil"

## Teststrategi

### Dual Testing Approach

Systemet ska testas med både unit tests och property-based tests för omfattande täckning.

**Unit Tests** fokuserar på:
- Specifika exempel på autentisering (korrekt/felaktigt lösenord)
- Edge cases för bilduppladdning (tomma filer, ogiltiga format)
- Felhantering för saknade filer
- Integration mellan komponenter

**Property-Based Tests** fokuserar på:
- Universella egenskaper som gäller för alla inputs
- Omfattande input-täckning genom randomisering
- Verifiering av correctness properties

### Property-Based Testing Konfiguration

- **Bibliotek**: fast-check (för JavaScript/Node.js)
- **Iterationer**: Minimum 100 per property test
- **Taggning**: Varje test refererar till sin design property
- **Format**: `// Feature: admin-cms, Property 1: Autentisering krävs för alla admin-operationer`

### Testfall

**Autentisering:**
- Unit: Testa inloggning med exakta uppgifter "ADMIN"/"MINDA164!"
- Unit: Testa inloggning med felaktiga uppgifter
- Property: För alla API-anrop utan token, verifiera 401-svar
- Property: För alla giltiga tokens, verifiera åtkomst till admin-endpoints

**Innehållshantering:**
- Unit: Skapa ett inlägg och verifiera att det sparas
- Unit: Radera ett inlägg och verifiera att det försvinner
- Property: För alla skapade inlägg, verifiera att de kan hämtas
- Property: För alla HTML-uppdateringar, verifiera att strukturen bevaras

**Mediahantering:**
- Unit: Ladda upp en JPEG-bild och verifiera att den sparas
- Unit: Försök ladda upp en ogiltig filtyp och verifiera felmeddelande
- Property: För alla uppladdade bilder, verifiera att de finns i filsystemet
- Property: För alla raderade bilder, verifiera att de inte längre finns

**Säkerhetskopiering:**
- Unit: Skapa en säkerhetskopia och verifiera att den innehåller alla filer
- Unit: Återställ från en säkerhetskopia och verifiera att filer återställs
- Property: För alla säkerhetskopior, verifiera idempotens vid återställning

**Versionshantering:**
- Unit: Uppdatera en sida och verifiera att en version skapas
- Property: För alla versioner, verifiera att återställning ger korrekt innehåll

### Testmiljö

- **Lokal utveckling**: Använd en separat testkatalog med kopior av filer
- **CI/CD**: Automatiska tester körs vid varje commit
- **Manuell testning**: Testa i webbläsare på desktop, surfplatta och mobil

## Säkerhetsöverväganden

### Autentisering

- Lösenord hashas med bcrypt (cost factor 10)
- JWT-tokens har 24 timmars utgångstid
- Tokens lagras i httpOnly cookies för att förhindra XSS
- CSRF-skydd med tokens

### Filhantering

- Validera alla filuppladdningar (typ, storlek, innehåll)
- Sanitera filnamn för att förhindra path traversal
- Begränsa uppladdningsstorlek till 10MB
- Skanna uppladdade filer för skadligt innehåll

### API-säkerhet

- Rate limiting för att förhindra brute force
- Input-validering för alla endpoints
- Sanitera HTML-innehåll för att förhindra XSS
- Använd prepared statements för alla databasoperationer (om SQL används)

### Deployment

- Använd HTTPS i produktion
- Sätt säkra HTTP-headers (CSP, X-Frame-Options, etc.)
- Håll beroenden uppdaterade
- Logga alla admin-åtgärder för revision

## Prestandaöverväganden

- Cachea statiska filer (bilder, CSS, JS)
- Komprimera HTTP-svar med gzip
- Optimera bilder vid uppladdning (resize, compress)
- Använd lazy loading för stora bildlistor
- Indexera innehållsmetadata för snabb sökning
