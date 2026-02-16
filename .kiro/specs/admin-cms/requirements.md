# Kravdokument - Admin CMS System

## Introduktion

Detta dokument beskriver kraven för ett administrativt innehållshanteringssystem (CMS) för ribegatan.se. Systemet ska ge administratörer möjlighet att logga in och hantera allt innehåll på webbplatsen, inklusive inlägg, texter, färger och bilder.

## Ordlista

- **Admin_System**: Det administrativa innehållshanteringssystemet
- **Autentiseringsmodul**: Komponenten som hanterar inloggning och sessionshantering
- **Innehållseditor**: Gränssnittet för att redigera webbplatsinnehåll
- **Inlägg**: Nyhetsartiklar, meddelanden eller annat dynamiskt innehåll på webbplatsen
- **Statisk_Sida**: HTML-sidor som utgör webbplatsens struktur
- **Mediabibliotek**: Systemet för att hantera bilder och andra mediafiler
- **Session**: En autentiserad användarsession efter lyckad inloggning
- **Administratör**: En användare med fullständiga rättigheter att redigera webbplatsinnehåll

## Krav

### Krav 1: Administrativ Autentisering

**Användarberättelse:** Som administratör vill jag kunna logga in säkert på webbplatsen, så att jag kan få tillgång till administrativa funktioner.

#### Acceptanskriterier

1. NÄR en administratör besöker inloggningssidan, SKA Admin_System VISA ett inloggningsformulär med fält för användarnamn och lösenord
2. NÄR en administratör anger korrekta inloggningsuppgifter (användarnamn: "ADMIN", lösenord: "MINDA164!"), SKA Autentiseringsmodul SKAPA en giltig Session
3. NÄR en administratör anger felaktiga inloggningsuppgifter, SKA Autentiseringsmodul AVVISA inloggningsförsöket och VISA ett felmeddelande
4. NÄR en giltig Session skapas, SKA Admin_System OMDIRIGERA administratören till administratörspanelen
5. NÄR en Session är aktiv, SKA Admin_System BIBEHÅLLA autentiseringen under användarens besök
6. NÄR en administratör loggar ut, SKA Admin_System AVSLUTA Session och OMDIRIGERA till inloggningssidan

### Krav 2: Hantering av Inlägg

**Användarberättelse:** Som administratör vill jag kunna skapa, redigera och radera inlägg, så att jag kan hålla webbplatsens innehåll aktuellt.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Innehållseditor VISA en lista över alla befintliga Inlägg
2. NÄR en administratör klickar på "Skapa nytt inlägg", SKA Innehållseditor VISA ett formulär för att skapa ett nytt Inlägg
3. NÄR en administratör fyller i och sparar ett nytt Inlägg, SKA Admin_System LAGRA Inlägg och VISA det på webbplatsen
4. NÄR en administratör väljer ett befintligt Inlägg, SKA Innehållseditor VISA redigeringsformulär med befintligt innehåll
5. NÄR en administratör uppdaterar ett Inlägg, SKA Admin_System SPARA ändringarna och UPPDATERA visningen på webbplatsen
6. NÄR en administratör väljer att radera ett Inlägg, SKA Admin_System BEGÄRA bekräftelse innan radering
7. NÄR en administratör bekräftar radering, SKA Admin_System TA BORT Inlägg permanent från webbplatsen

### Krav 3: Textredigering

**Användarberättelse:** Som administratör vill jag kunna redigera texter på alla sidor, så att jag kan uppdatera information och korrigera fel.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Innehållseditor TILLÅTA redigering av textinnehåll på alla Statisk_Sida
2. NÄR en administratör väljer en Statisk_Sida, SKA Innehållseditor VISA sidans textinnehåll i redigerbart format
3. NÄR en administratör ändrar text, SKA Admin_System SPARA ändringarna till den ursprungliga HTML-filen
4. NÄR text sparas, SKA Admin_System BEVARA HTML-strukturen och formatering
5. NÄR en administratör redigerar text, SKA Innehållseditor TILLHANDAHÅLLA en förhandsvisning av ändringarna
6. NÄR ändringar sparas, SKA Admin_System UPPDATERA den publika webbplatsen omedelbart

### Krav 4: Färghantering

**Användarberättelse:** Som administratör vill jag kunna ändra färger på texter och element, så att jag kan anpassa webbplatsens utseende.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Innehållseditor VISA en färgväljare för textelement
2. NÄR en administratör väljer ett textelement, SKA Innehållseditor VISA dess nuvarande färg
3. NÄR en administratör väljer en ny färg, SKA Admin_System UPPDATERA CSS-stilarna för det valda elementet
4. NÄR färgändringar sparas, SKA Admin_System TILLÄMPA ändringarna på alla relevanta sidor
5. NÄR färgändringar görs, SKA Innehållseditor VISA en realtidsförhandsvisning
6. NÄR färgändringar sparas, SKA Admin_System BEVARA ändringar i CSS-filer eller inline-stilar

### Krav 5: Bildhantering

**Användarberättelse:** Som administratör vill jag kunna lägga till, ersätta och ta bort bilder, så att jag kan hålla webbplatsens visuella innehåll uppdaterat.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Mediabibliotek VISA alla befintliga bilder på webbplatsen
2. NÄR en administratör väljer "Ladda upp bild", SKA Mediabibliotek TILLÅTA uppladdning av bildfiler (JPEG, PNG, GIF, WebP)
3. NÄR en bild laddas upp, SKA Admin_System VALIDERA filtyp och storlek
4. NÄR en giltig bild laddas upp, SKA Admin_System SPARA bilden i lämplig katalog (img/, res/, eller assets/)
5. NÄR en administratör väljer en befintlig bild, SKA Mediabibliotek VISA alternativ för att ersätta eller radera bilden
6. NÄR en administratör raderar en bild, SKA Admin_System BEGÄRA bekräftelse och VARNA om bilden används på sidor
7. NÄR en bildradering bekräftas, SKA Admin_System TA BORT bildfilen från servern
8. NÄR en administratör ersätter en bild, SKA Admin_System BEHÅLLA samma filnamn för att bevara referenser

### Krav 6: Sidnavigering och Översikt

**Användarberättelse:** Som administratör vill jag ha en översikt över alla sidor och innehåll, så att jag enkelt kan hitta och redigera vad jag behöver.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Admin_System VISA en administratörspanel med navigering
2. NÄR administratörspanelen visas, SKA Admin_System LISTA alla Statisk_Sida organiserade efter kategori
3. NÄR en administratör söker efter innehåll, SKA Admin_System FILTRERA och VISA matchande sidor och inlägg
4. NÄR en administratör väljer en sida från listan, SKA Innehållseditor ÖPPNA den sidan för redigering
5. NÄR administratörspanelen visas, SKA Admin_System VISA statistik om antal sidor, inlägg och bilder

### Krav 7: Säkerhetskopiering och Återställning

**Användarberättelse:** Som administratör vill jag kunna säkerhetskopiera och återställa innehåll, så att jag kan skydda mot oavsiktliga ändringar eller dataförlust.

#### Acceptanskriterier

1. MEDAN en Session är aktiv, SKA Admin_System TILLHANDAHÅLLA en funktion för att skapa säkerhetskopior
2. NÄR en administratör begär en säkerhetskopia, SKA Admin_System SKAPA en komplett kopia av alla filer och innehåll
3. NÄR en säkerhetskopia skapas, SKA Admin_System INKLUDERA tidsstämpel i filnamnet
4. NÄR en administratör väljer att återställa, SKA Admin_System VISA en lista över tillgängliga säkerhetskopior
5. NÄR en återställning initieras, SKA Admin_System BEGÄRA bekräftelse innan nuvarande innehåll skrivs över
6. NÄR en återställning bekräftas, SKA Admin_System ÅTERSTÄLLA alla filer från den valda säkerhetskopian

### Krav 8: Lokal Testmiljö

**Användarberättelse:** Som administratör vill jag kunna testa systemet lokalt innan deployment, så att jag kan verifiera att allt fungerar korrekt.

#### Acceptanskriterier

1. NÄR systemet körs lokalt, SKA Admin_System FUNGERA med samma funktionalitet som i produktion
2. NÄR ändringar görs i lokal miljö, SKA Admin_System SPARA ändringar till lokala filer
3. NÄR lokal testning är klar, SKA Admin_System TILLHANDAHÅLLA instruktioner för deployment till GitHub
4. NÄR systemet körs lokalt, SKA Admin_System ANVÄNDA en lokal databas eller filbaserad lagring
5. NÄR lokal server startas, SKA Admin_System VISA tydliga instruktioner om hur man når inloggningssidan

### Krav 9: Responsiv Administratörspanel

**Användarberättelse:** Som administratör vill jag kunna använda CMS:et på olika enheter, så att jag kan göra uppdateringar från dator, surfplatta eller mobil.

#### Acceptanskriterier

1. NÄR administratörspanelen visas på olika skärmstorlekar, SKA Admin_System ANPASSA layouten responsivt
2. NÄR administratörspanelen används på mobil enhet, SKA Innehållseditor BIBEHÅLLA full funktionalitet
3. NÄR formulär visas på små skärmar, SKA Admin_System OPTIMERA inmatningsfält för touch-interaktion
4. NÄR bilder laddas upp från mobil, SKA Mediabibliotek STÖDJA kameraåtkomst för direktfotografering
5. NÄR administratörspanelen används på surfplatta, SKA Admin_System UTNYTTJA tillgängligt utrymme effektivt

### Krav 10: Versionshantering av Innehåll

**Användarberättelse:** Som administratör vill jag kunna se historik över ändringar, så att jag kan spåra vad som ändrats och av vem.

#### Acceptanskriterier

1. NÄR en administratör gör en ändring, SKA Admin_System LOGGA ändringen med tidsstämpel
2. NÄR en administratör visar historik för en sida, SKA Admin_System VISA alla tidigare versioner
3. NÄR en administratör väljer en tidigare version, SKA Admin_System VISA en förhandsvisning av den versionen
4. NÄR en administratör väljer att återställa en tidigare version, SKA Admin_System BEGÄRA bekräftelse
5. NÄR en återställning bekräftas, SKA Admin_System ÅTERSTÄLLA innehållet till den valda versionen och LOGGA återställningen
