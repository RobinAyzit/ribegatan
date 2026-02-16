# 🎨 Inline Editor - Redigera hemsidan direkt!

## Vad jag har byggt:

Ett system där du kan redigera hemsidan **direkt på själva webbplatsen** - precis som du ville!

## 🚀 Så här använder du det:

### 1. Öppna hemsidan
Gå till: `http://localhost:3000`

### 2. Logga in som admin
- Klicka på **🔒 Logga in** knappen i övre högra hörnet
- Användarnamn: `ADMIN`
- Lösenord: `MINDA164!`

### 3. Nu är du i redigeringsläge! 🎉

När du är inloggad ser du:
- **🔓 Admin** knapp i övre högra hörnet
- **Admin Verktyg** panel med:
  - 📝 Nytt inlägg
  - 💾 Spara ändringar
  - 🚪 Logga ut

## 📝 Skapa nytt inlägg i Aktuellt:

1. Klicka på **📝 Nytt inlägg** i Admin Verktyg
2. Fyll i formuläret:
   - **Rubrik** (obligatorisk)
   - **Text** (obligatorisk)
   - **Bild** (valfritt) - Välj en bild från din dator
   - **Länk** (valfritt) - T.ex. https://exempel.se
   - **Länktext** (valfritt) - T.ex. "Läs mer"
3. Klicka **Publicera inlägg**
4. Inlägget läggs automatiskt **längst upp** i Aktuellt-sektionen
5. Klicka **💾 Spara ändringar** för att spara

**Inlägget innehåller:**
- ✅ Rubrik med datum
- ✅ Text
- ✅ Bild (om du lade till en)
- ✅ Länk-knapp (om du lade till en länk)
- ✅ Snygg design som matchar hemsidan

## ✏️ Redigera text:

1. **Klicka på vilken text som helst** på sidan
2. Texten blir redigerbar (blå ram)
3. Skriv din nya text
4. Tryck **Enter** eller klicka utanför för att avsluta
5. Klicka **💾 Spara ändringar** när du är klar

**Tips:**
- Tryck **Escape** för att ångra
- Alla texter får en blå streckad ram när du hovrar över dem

## 🖼️ Hantera bilder:

1. **Högerklicka på en bild**
2. Välj:
   - **🔄 Byt bild** - Välj en ny bild från din dator
   - **🗑️ Ta bort bild** - Markera bilden för radering
3. Klicka **💾 Spara ändringar** när du är klar

## 💾 Spara dina ändringar:

**VIKTIGT:** Dina ändringar sparas INTE automatiskt!

1. Gör alla ändringar du vill
2. Klicka på **💾 Spara ändringar** i Admin Verktyg-panelen
3. Sidan laddas om och dina ändringar är sparade!

## 🚪 Logga ut:

Klicka på **🚪 Logga ut** i Admin Verktyg-panelen

## 🎯 Funktioner:

✅ Skapa nya inlägg med text, bild och länk
✅ Inlägg visas längst upp i Aktuellt
✅ Redigera all text direkt på sidan
✅ Byt bilder genom högerklick
✅ Ta bort bilder
✅ Se exakt hur sidan ser ut medan du redigerar
✅ Inga separata admin-paneler
✅ Allt sparas direkt till HTML-filerna

## 🔧 Tekniska detaljer:

- Backend-servern körs på port 3000
- Inline editor-scriptet (`inline-editor.js`) är inkluderat på hemsidan
- Ändringar sparas direkt till HTML-filerna via API:et
- Bilder laddas upp till servern automatiskt
- JWT-autentisering för säkerhet

## 📝 Nästa steg:

Om du vill ha inline editor på **fler sidor**, lägg till denna rad före `</body>` på varje sida:

```html
<script src="inline-editor.js"></script>
```

## 🎉 Klart!

Nu kan du redigera hemsidan och skapa nya inlägg precis som du ville - direkt på själva webbplatsen!
