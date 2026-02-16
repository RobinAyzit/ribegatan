# Implementationsplan: Admin CMS System

## Översikt

Denna implementationsplan beskriver stegen för att bygga ett komplett admin CMS-system för ribegatan.se. Systemet kommer att implementeras med Node.js/Express för backend och vanilla JavaScript för frontend admin-panelen.

## Tasks

- [x] 1. Projektstruktur och beroenden
  - Skapa katalogstruktur för admin-systemet
  - Initiera package.json med nödvändiga beroenden (express, jsonwebtoken, bcrypt, multer, sharp)
  - Konfigurera nodemon för utveckling
  - Skapa .gitignore för node_modules och känsliga filer
  - _Krav: 8.1, 8.4_

- [x] 2. Backend: Autentiseringsmodul
  - [x] 2.1 Implementera AuthService
    - Skapa auth-service.js med funktioner för hashPassword, comparePassword, generateToken, verifyToken
    - Implementera JWT-token generering med 24 timmars utgångstid
    - Skapa users.json med hashad admin-användare (ADMIN/MINDA164!)
    - _Krav: 1.2, 1.5_

  - [ ]* 2.2 Skriv property test för autentisering
    - **Property 2: Inloggning med korrekta uppgifter ger giltig token**
    - **Validerar: Krav 1.2**

  - [ ]* 2.3 Skriv property test för felaktig autentisering
    - **Property 3: Inloggning med felaktiga uppgifter avvisas**
    - **Validerar: Krav 1.3**

  - [x] 2.4 Implementera auth middleware
    - Skapa auth-middleware.js för att verifiera JWT-tokens
    - Implementera felhantering för utgångna/ogiltiga tokens
    - _Krav: 1.2, 1.5_

  - [ ]* 2.5 Skriv property test för middleware
    - **Property 1: Autentisering krävs för alla admin-operationer**
    - **Validerar: Krav 1.2, 1.5**

  - [x] 2.6 Implementera auth routes
    - Skapa POST /api/auth/login endpoint
    - Skapa POST /api/auth/logout endpoint
    - Skapa GET /api/auth/verify endpoint
    - _Krav: 1.2, 1.3, 1.4, 1.6_

  - [ ]* 2.7 Skriv unit tests för auth endpoints
    - Testa lyckad inloggning med korrekta uppgifter
    - Testa misslyckad inloggning med felaktiga uppgifter
    - Testa token-verifiering
    - _Krav: 1.2, 1.3_

- [x] 3. Checkpoint - Verifiera autentisering
  - Säkerställ att alla tester passerar, fråga användaren om frågor uppstår.

- [x] 4. Backend: Innehållshanteringsmodul
  - [x] 4.1 Implementera ContentService för inlägg
    - Skapa content-service.js med CRUD-funktioner för inlägg
    - Implementera filbaserad lagring i content.json
    - Lägg till funktioner: getAllPosts, getPost, createPost, updatePost, deletePost
    - _Krav: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [ ]* 4.2 Skriv property test för inläggsskapande
    - **Property 4: Skapade inlägg kan hämtas**
    - **Validerar: Krav 2.3**

  - [ ]* 4.3 Skriv property test för inläggsradering
    - **Property 5: Raderade inlägg försvinner från listan**
    - **Validerar: Krav 2.7**

  - [ ]* 4.4 Skriv property test för inläggsuppdatering
    - **Property 6: Uppdaterade inlägg behåller ID**
    - **Validerar: Krav 2.5**

  - [x] 4.5 Implementera ContentService för sidor
    - Lägg till funktioner: getAllPages, getPage, updatePage
    - Implementera HTML-parsing och uppdatering med bevarad struktur
    - Lägg till validering för välformad HTML
    - _Krav: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ]* 4.6 Skriv property test för HTML-bevarande
    - **Property 7: HTML-struktur bevaras vid textredigering**
    - **Validerar: Krav 3.4**

  - [x] 4.7 Implementera stilhantering
    - Lägg till funktion updateStyle för CSS-ändringar
    - Implementera CSS-parsing och uppdatering
    - _Krav: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [ ]* 4.8 Skriv property test för CSS-ändringar
    - **Property 8: CSS-ändringar tillämpas korrekt**
    - **Validerar: Krav 4.4**

  - [x] 4.9 Implementera content routes
    - Skapa GET /api/content/posts endpoint
    - Skapa POST /api/content/posts endpoint
    - Skapa PUT /api/content/posts/:id endpoint
    - Skapa DELETE /api/content/posts/:id endpoint
    - Skapa GET /api/content/pages endpoint
    - Skapa GET /api/content/pages/:filename endpoint
    - Skapa PUT /api/content/pages/:filename endpoint
    - Skapa PUT /api/content/styles endpoint
    - _Krav: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_

- [-] 5. Backend: Mediahanteringsmodul
  - [x] 5.1 Implementera MediaService
    - Skapa media-service.js med funktioner för bildhantering
    - Konfigurera multer för filuppladdning
    - Implementera bildvalidering (typ, storlek)
    - Lägg till funktioner: getAllImages, uploadImage, deleteImage, replaceImage
    - _Krav: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8_

  - [ ]* 5.2 Skriv property test för bilduppladdning
    - **Property 9: Uppladdade bilder sparas i korrekt katalog**
    - **Validerar: Krav 5.4**

  - [ ]* 5.3 Skriv property test för bildradering
    - **Property 10: Bildradering tar bort filen**
    - **Validerar: Krav 5.7**

  - [ ]* 5.4 Skriv property test för bildersättning
    - **Property 11: Bildersättning behåller filnamn**
    - **Validerar: Krav 5.8**

  - [~] 5.5 Implementera bildoptimering
    - Konfigurera sharp för bildkomprimering
    - Implementera automatisk storleksanpassning vid uppladdning
    - _Krav: 5.3, 5.4_

  - [x] 5.6 Implementera bildanvändningsspårning
    - Lägg till funktion getImageUsage för att hitta var bilder används
    - Implementera varning vid radering av använda bilder
    - _Krav: 5.6_

  - [x] 5.7 Implementera media routes
    - Skapa GET /api/media/images endpoint
    - Skapa POST /api/media/upload endpoint med multer middleware
    - Skapa DELETE /api/media/images/:filename endpoint
    - Skapa PUT /api/media/images/:filename endpoint
    - _Krav: 5.1, 5.2, 5.5, 5.7, 5.8_

  - [ ]* 5.8 Skriv unit tests för mediahantering
    - Testa uppladdning av giltig bild
    - Testa avvisning av ogiltig filtyp
    - Testa radering med användningsvarning
    - _Krav: 5.3, 5.6_

- [~] 6. Checkpoint - Verifiera backend-funktionalitet
  - Säkerställ att alla tester passerar, fråga användaren om frågor uppstår.

- [~] 7. Backend: Säkerhetskopieringsmodul
  - [~] 7.1 Implementera BackupService
    - Skapa backup-service.js med funktioner för säkerhetskopiering
    - Implementera createBackup för att kopiera alla filer
    - Implementera listBackups för att visa tillgängliga säkerhetskopior
    - Implementera restoreBackup för att återställa från säkerhetskopia
    - _Krav: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 7.2 Skriv property test för säkerhetskopior
    - **Property 12: Säkerhetskopior innehåller alla filer**
    - **Validerar: Krav 7.2**

  - [ ]* 7.3 Skriv property test för återställning
    - **Property 13: Återställning från säkerhetskopia är idempotent**
    - **Validerar: Krav 7.6**

  - [~] 7.4 Implementera backup routes
    - Skapa GET /api/backup/list endpoint
    - Skapa POST /api/backup/create endpoint
    - Skapa POST /api/backup/restore/:id endpoint
    - _Krav: 7.1, 7.4, 7.5_

- [~] 8. Backend: Versionshanteringsmodul
  - [~] 8.1 Implementera versionshantering i ContentService
    - Lägg till getPageHistory funktion
    - Lägg till restoreVersion funktion
    - Implementera automatisk versionsskapande vid siduppdatering
    - _Krav: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 8.2 Skriv property test för versionsloggning
    - **Property 14: Versionshistorik loggar alla ändringar**
    - **Validerar: Krav 10.1**

  - [ ]* 8.3 Skriv property test för versionsåterställning
    - **Property 15: Återställning av version återställer innehåll**
    - **Validerar: Krav 10.5**

  - [~] 8.4 Implementera version routes
    - Skapa GET /api/content/pages/:filename/history endpoint
    - Skapa POST /api/content/pages/:filename/restore/:versionId endpoint
    - _Krav: 10.2, 10.4_

- [~] 9. Backend: Express server och felhantering
  - [x] 9.1 Implementera huvudserver
    - Skapa server.js med Express-konfiguration
    - Konfigurera CORS för lokal utveckling
    - Konfigurera body-parser för JSON
    - Montera alla routes
    - _Krav: 8.1, 8.4_

  - [x] 9.2 Implementera global felhantering
    - Skapa error-handler middleware
    - Implementera alla felmeddelanden enligt design
    - Lägg till logging för fel
    - _Krav: Alla felhanteringskrav_

  - [~] 9.3 Implementera rate limiting
    - Konfigurera express-rate-limit för API-endpoints
    - Implementera särskild rate limiting för login-endpoint
    - _Krav: Säkerhet_

- [~] 10. Checkpoint - Verifiera komplett backend
  - Säkerställ att alla tester passerar, fråga användaren om frågor uppstår.

- [x] 11. Frontend: Admin panel struktur
  - [x] 11.1 Skapa HTML-struktur för admin panel
    - Skapa admin/index.html med grundläggande layout
    - Implementera responsiv design med CSS Grid/Flexbox
    - Skapa navigeringsmeny för olika sektioner
    - _Krav: 6.1, 6.2, 9.1, 9.2_

  - [x] 11.2 Skapa CSS för admin panel
    - Skapa admin/css/admin.css med modern styling
    - Implementera responsiv design för mobil, surfplatta och desktop
    - Lägg till animationer och övergångar
    - _Krav: 9.1, 9.2, 9.3, 9.5_

- [~] 12. Frontend: Autentisering
  - [x] 12.1 Implementera login-vy
    - Skapa inloggningsformulär i admin panel
    - Implementera formulärvalidering
    - _Krav: 1.1_

  - [x] 12.2 Implementera auth.js
    - Skapa admin/js/auth.js med funktioner för inloggning
    - Implementera token-lagring i localStorage
    - Implementera automatisk token-verifiering vid sidladdning
    - Implementera logout-funktionalitet
    - _Krav: 1.2, 1.4, 1.5, 1.6_

  - [x] 12.3 Implementera session-hantering
    - Lägg till automatisk omdirigering till login vid utgången session
    - Implementera "kom ihåg mig"-funktionalitet
    - _Krav: 1.5, 1.6_

- [~] 13. Frontend: Innehållseditor
  - [x] 13.1 Implementera inläggslista
    - Skapa vy för att visa alla inlägg
    - Implementera hämtning av inlägg från API
    - Lägg till sök- och filtreringsfunktionalitet
    - _Krav: 2.1, 6.3_

  - [x] 13.2 Implementera inläggsformulär
    - Skapa formulär för att skapa nytt inlägg
    - Implementera rich text editor (t.ex. Quill eller TinyMCE)
    - Lägg till förhandsvisning av inlägg
    - _Krav: 2.2, 2.3_

  - [x] 13.3 Implementera inläggsredigering
    - Skapa redigeringsvy för befintliga inlägg
    - Implementera uppdatering av inlägg via API
    - _Krav: 2.4, 2.5_

  - [x] 13.4 Implementera inläggsradering
    - Lägg till raderingsfunktion med bekräftelsedialog
    - Implementera radering via API
    - _Krav: 2.6, 2.7_

  - [x] 13.5 Implementera content-editor.js
    - Skapa admin/js/content-editor.js med alla funktioner för innehållshantering
    - Implementera API-anrop för alla CRUD-operationer
    - Lägg till felhantering och användarfeedback
    - _Krav: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [~] 14. Frontend: Sidredigering
  - [~] 14.1 Implementera sidlista
    - Skapa vy för att visa alla statiska sidor
    - Implementera hämtning av sidor från API
    - Organisera sidor efter kategori
    - _Krav: 6.2, 6.4_

  - [~] 14.2 Implementera sidredigerare
    - Skapa redigeringsvy för HTML-sidor
    - Implementera code editor med syntax highlighting (t.ex. CodeMirror)
    - Lägg till förhandsvisning av sida
    - _Krav: 3.2, 3.5_

  - [~] 14.3 Implementera siduppdatering
    - Implementera sparning av sidändringar via API
    - Lägg till automatisk sparning (draft)
    - _Krav: 3.3, 3.6_

- [~] 15. Frontend: Färghantering
  - [~] 15.1 Implementera färgväljare
    - Skapa vy för att välja textelement
    - Implementera färgväljare (color picker)
    - Visa nuvarande färg för valt element
    - _Krav: 4.1, 4.2_

  - [~] 15.2 Implementera färguppdatering
    - Implementera realtidsförhandsvisning av färgändringar
    - Implementera sparning av färgändringar via API
    - _Krav: 4.3, 4.4, 4.5_

- [~] 16. Frontend: Mediahantering
  - [x] 16.1 Implementera bildgalleri
    - Skapa vy för att visa alla bilder
    - Implementera grid-layout för bilder
    - Lägg till sök- och filtreringsfunktionalitet
    - _Krav: 5.1, 6.5_

  - [x] 16.2 Implementera bilduppladdning
    - Skapa uppladdningsformulär med drag-and-drop
    - Implementera förhandsvisning av bilder före uppladdning
    - Lägg till progress bar för uppladdning
    - Implementera kameraåtkomst för mobila enheter
    - _Krav: 5.2, 5.3, 9.4_

  - [x] 16.3 Implementera bildhantering
    - Lägg till funktioner för att radera bilder
    - Implementera bildersättning
    - Visa varning om bild används på sidor
    - _Krav: 5.5, 5.6, 5.7, 5.8_

  - [x] 16.4 Implementera media-manager.js
    - Skapa admin/js/media-manager.js med alla funktioner för mediahantering
    - Implementera API-anrop för uppladdning, radering och ersättning
    - Lägg till felhantering och användarfeedback
    - _Krav: 5.1, 5.2, 5.5, 5.7, 5.8_

- [~] 17. Frontend: Säkerhetskopiering och versionshantering
  - [~] 17.1 Implementera säkerhetskopieringsvy
    - Skapa vy för att visa säkerhetskopior
    - Lägg till funktion för att skapa ny säkerhetskopia
    - Implementera återställning från säkerhetskopia med bekräftelse
    - _Krav: 7.1, 7.4, 7.5_

  - [~] 17.2 Implementera versionshistorik
    - Skapa vy för att visa versionshistorik för sidor
    - Implementera förhandsvisning av tidigare versioner
    - Lägg till funktion för att återställa version
    - _Krav: 10.2, 10.3, 10.4_

- [~] 18. Frontend: Huvudapplikation
  - [x] 18.1 Implementera app.js
    - Skapa admin/js/app.js som huvudapplikation
    - Implementera routing mellan olika vyer
    - Lägg till global state management
    - Implementera laddningsindikatorer
    - _Krav: 6.1_

  - [x] 18.2 Implementera dashboard
    - Skapa översiktsvy med statistik
    - Visa antal sidor, inlägg och bilder
    - Lägg till snabblänkar till vanliga funktioner
    - _Krav: 6.5_

- [~] 19. Integration och polish
  - [~] 19.1 Integrera alla komponenter
    - Koppla samman alla frontend-komponenter
    - Säkerställ att all navigation fungerar
    - Testa alla API-anrop
    - _Krav: Alla_

  - [~] 19.2 Implementera användarfeedback
    - Lägg till toast-notifikationer för framgång/fel
    - Implementera laddningsindikatorer för API-anrop
    - Lägg till bekräftelsedialoger för destruktiva åtgärder
    - _Krav: Alla_

  - [~] 19.3 Optimera prestanda
    - Implementera lazy loading för bilder
    - Lägg till caching för API-svar
    - Optimera CSS och JavaScript
    - _Krav: Prestandakrav_

- [~] 20. Dokumentation och deployment
  - [~] 20.1 Skapa README
    - Dokumentera installation och konfiguration
    - Lägg till instruktioner för lokal körning
    - Dokumentera API-endpoints
    - _Krav: 8.3, 8.5_

  - [~] 20.2 Skapa deployment-guide
    - Dokumentera hur man deployar till GitHub Pages
    - Lägg till instruktioner för produktionsmiljö
    - Dokumentera säkerhetsöverväganden
    - _Krav: 8.3_

  - [~] 20.3 Skapa användarmanual
    - Dokumentera hur man använder admin-panelen
    - Lägg till skärmdumpar och exempel
    - Dokumentera vanliga problem och lösningar
    - _Krav: Alla_

- [~] 21. Final checkpoint - Komplett systemtest
  - Säkerställ att alla tester passerar, fråga användaren om frågor uppstår.

## Noteringar

- Tasks markerade med `*` är valfria och kan hoppas över för snabbare MVP
- Varje task refererar till specifika krav för spårbarhet
- Checkpoints säkerställer inkrementell validering
- Property tests validerar universella korrekthetsegenskaper
- Unit tests validerar specifika exempel och edge cases
- Systemet ska testas lokalt innan deployment till GitHub
