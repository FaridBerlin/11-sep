# Express.js & HTTP-Statuscodes - Übungsaufgaben

**Datum:** 2025-09-10

## 📚 Theoretische Aufgaben

### 1. Recherchiere über HTTP-Statuscodes

**Prompt:** Liste die 5 am häufigsten genutzten HTTP-Statuscodes auf und gib kurz jeweils ein typisches Beispiel in einer REST-API mit Express

**Antwort:**

Die 5 häufigsten HTTP-Statuscodes:

1. **200 OK** - Erfolgreiche Anfrage

   ```javascript
   app.get("/users", (req, res) => {
     res.status(200).json(users);
   });
   ```

2. **201 Created** - Neue Ressource erfolgreich erstellt

   ```javascript
   app.post("/users", (req, res) => {
     const newUser = createUser(req.body);
     res.status(201).json(newUser);
   });
   ```

3. **400 Bad Request** - Fehlerhafte Anfrage

   ```javascript
   app.post("/users", (req, res) => {
     if (!req.body.email) {
       return res.status(400).json({ error: "Email ist erforderlich" });
     }
   });
   ```

4. **404 Not Found** - Ressource nicht gefunden

   ```javascript
   app.get("/users/:id", (req, res) => {
     const user = findUser(req.params.id);
     if (!user) {
       return res.status(404).json({ error: "Benutzer nicht gefunden" });
     }
   });
   ```

5. **500 Internal Server Error** - Serverfehler
   ```javascript
   app.use((err, req, res, next) => {
     console.error(err);
     res.status(500).json({ error: "Interner Serverfehler" });
   });
   ```

### 2. Finde ein Beispiel für status(204)

**Prompt:** Zeige kurz ein typisches Beispiel wie man in einer RESTful API mit Express den Statuscode 204 benutzt (nur die notwendige Route)

**Antwort:**

Der Status 204 "No Content" wird typischerweise bei erfolgreichem DELETE verwendet:

```javascript
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const deleted = deleteUser(userId);

  if (deleted) {
    res.status(204).send(); // Erfolgreich gelöscht, keine Inhalte zurück
  } else {
    res.status(404).json({ error: "Benutzer nicht gefunden" });
  }
});
```

### 3. Was sind die Vorteile vom Allgemeinen Error-Handler in Express?

**Prompt:** Gib eine kurze Übersicht was die Vorteile der Fehlerbehandlungsmiddleware in Express (err, req, res, next) sind

**Antwort:**

Die Vorteile der Error-Handler Middleware in Express:

1. **Zentrale Fehlerbehandlung** - Alle Fehler werden an einem Ort verarbeitet
2. **Konsistente Fehlerantworten** - Einheitliches Format für alle Fehler
3. **Vereinfachter Code** - Routen müssen nicht jeden Fehler einzeln behandeln
4. **Automatische Weiterleitung** - Fehler werden automatisch an den Error-Handler weitergeleitet
5. **Sicherheit** - Verhindert, dass sensitive Serverinformationen an Clients gesendet werden
6. **Logging** - Zentrale Stelle für Fehler-Protokollierung
7. **Graceful Degradation** - Server bleibt trotz Fehlern funktionsfähig

```javascript
// Error-Handler fängt alle Fehler aus vorherigen Middleware/Routes ab
app.use((err, req, res, next) => {
  console.error(err.stack); // Logging
  res.status(500).json({ error: "Etwas ist schiefgelaufen!" }); // Einheitliche Antwort
});
```

### 4. Express Server mit Fehlerbehandlung

**Aufgabe:** Hier ist ein simpler Express Server:

```javascript
import express from "express";

const app = express();

// Beispielroute
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Fehlerbehandlungsmiddleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Interner Serverfehler");
});

// 404-Handler
app.use((req, res) => {
  res.status(404).send("Seite nicht gefunden");
});

app.listen(3000, () => {
  console.log("Server hört auf port 3000");
});
```

**Aufgaben:**

- Teste den Code und versuche in der Beispielroute einen Fehler zu erzeugen, sodass er in der Fehlerbehandlungsmiddleware aufgefangen wird
- Funktionieren die Fehlerbehandlungsmiddleware und auch die 404-Route obwohl nicht mit next() an die 404-Route weitergegeben wird? Begründe deine Antwort

**Antwort:**

**Fehler erzeugen in der Route:**

```javascript
app.get("/", (req, res, next) => {
  try {
    // Fehler provozieren
    const obj = null;
    console.log(obj.property); // Wirft einen Error
    res.send("Hello World!");
  } catch (error) {
    next(error); // Weiterleitung an Error-Handler
  }
});
```

**Funktionsweise der Middleware:**

- **Error-Handler funktioniert:** ✅ Ja, wenn `next(error)` aufgerufen wird
- **404-Route funktioniert:** ✅ Ja, automatisch bei unbekannten Routen

**Begründung:**

1. Die **Fehlerbehandlungsmiddleware** wird nur ausgelöst, wenn `next(error)` explizit aufgerufen wird oder ein unbehandelter Fehler in async-Funktionen auftritt
2. Der **404-Handler** wird automatisch ausgeführt, wenn keine vorherige Route matched - Express durchläuft alle Middleware in Reihenfolge
3. **Wichtig:** Der 404-Handler muss NACH allen anderen Routen definiert werden, da Express Middleware sequenziell abarbeitet

### 5. Fehlerhafter Error-Handler

**Aufgabe:** Teste diesen Code:

```javascript
app.use((req, res, err, next) => {
  console.error(err.stack);
  res.status(500).send("Interner Serverfehler");
});
```

**Frage:** Funktioniert der Code wie gewünscht? Warum/warum nicht?

**Antwort:**

❌ **Nein, der Code funktioniert NICHT wie gewünscht!**

**Problem:** Die Parameter sind in der falschen Reihenfolge!

**Falsch:**

```javascript
app.use((req, res, err, next) => { // FALSCHE Reihenfolge!
```

**Richtig:**

```javascript
app.use((err, req, res, next) => { // RICHTIGE Reihenfolge!
```

**Begründung:**

- Express erkennt Error-Handler an der **4-Parameter-Signatur** mit `err` als **erstem Parameter**
- Bei falscher Reihenfolge wird die Middleware als normale Middleware behandelt, nicht als Error-Handler
- Der Error-Handler wird nie ausgeführt, da Express ihn nicht als solchen erkennt
- Fehler bleiben unbehandelt und führen zu Server-Crashes oder hängenden Requests

### 6. Recherchiere über "origins"

**Prompt:** Gib mir eine kurze Übersicht was origins bei einer URL sind und ein paar Beispiele von unterschiedlichen origins

**Antwort:**

Ein **Origin** (Ursprung) ist die Kombination aus **Protokoll + Domain + Port** einer URL.

**Format:** `protokoll://domain:port`

**Beispiele verschiedener Origins:**

| URL                        | Origin                     | Beschreibung              |
| -------------------------- | -------------------------- | ------------------------- |
| `https://example.com/api`  | `https://example.com`      | Standard HTTPS (Port 443) |
| `http://example.com/api`   | `http://example.com`       | Standard HTTP (Port 80)   |
| `https://api.example.com`  | `https://api.example.com`  | Andere Subdomain          |
| `https://example.com:8080` | `https://example.com:8080` | Anderer Port              |
| `http://localhost:3000`    | `http://localhost:3000`    | Lokale Entwicklung        |
| `https://example.org`      | `https://example.org`      | Andere Domain             |

**Wichtig:** Origins sind **unterschiedlich**, wenn sich auch nur **eines** der drei Elemente unterscheidet:

- `https://example.com` ≠ `http://example.com` (Protokoll)
- `https://example.com` ≠ `https://api.example.com` (Subdomain)
- `https://example.com` ≠ `https://example.com:8080` (Port)

### 7. Recherchiere über CORS

**Prompt:** Gib eine kurze, für Anfänger verständliche Erklärung, was CORS ist, warum es benötigt wird und welche Rolle origins dabei spielen

**Antwort:**

**CORS (Cross-Origin Resource Sharing)** ist ein Sicherheitsmechanismus in Webbrowsern.

**Was ist CORS?**

- Browser blockieren standardmäßig Anfragen zwischen verschiedenen Origins
- CORS erlaubt kontrolliertes Teilen von Ressourcen zwischen Origins
- Es ist ein Browser-Feature, nicht Server-seitig

**Warum wird CORS benötigt?**

**Problem ohne CORS:**

```
Frontend: http://localhost:3000  →  Backend: http://localhost:8080
                                     ❌ BLOCKIERT!
```

**Lösung mit CORS:**

```
Frontend: http://localhost:3000  →  Backend: http://localhost:8080
                                     ✅ ERLAUBT!
```

**Rolle der Origins:**

- Browser vergleicht **Origin der Webseite** mit **Origin der API**
- Bei unterschiedlichen Origins → CORS-Check erforderlich
- Server muss explizit erlauben, welche Origins zugreifen dürfen

**Beispiel:**

```javascript
// Backend erlaubt Frontend-Zugriff
app.use(
  cors({
    origin: "http://localhost:3000", // Nur diese Origin erlaubt
  })
);
```

**Ohne CORS:** Frontend kann nicht auf Backend zugreifen
**Mit CORS:** Kontrollierter, sicherer Cross-Origin-Zugriff möglich

### 8. Recherchiere wie man das npm-Paket "cors" konfigurieren kann

**Prompt:** Gib eine kurze Übersicht wie man das cors-Paket in Express konfigurieren kann, ignoriere hierbei credentials

**Antwort:**

Das **cors-Paket** bietet verschiedene Konfigurationsmöglichkeiten:

**1. Installation:**

```bash
npm install cors
```

**2. Basis-Konfigurationen:**

**Alle Origins erlauben:**

```javascript
import cors from "cors";
app.use(cors()); // Alle Origins erlaubt
```

**Spezifische Origin:**

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
```

**Mehrere Origins:**

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://myapp.com"],
  })
);
```

**Dynamische Origin-Prüfung:**

```javascript
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
```

**Erweiterte Optionen:**

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // Preflight-Cache: 24 Stunden
  })
);
```

**Route-spezifisches CORS:**

```javascript
app.get("/api/public", cors(), (req, res) => {
  // Nur für diese Route
});
```

---

## 9 🚀 Praktische Aufgabe: "Mini-Gästebuch" mit Node.js und React

### 🎯 Ziel

Eine kleine Fullstack-App, bei der Besucher Einträge in ein Gästebuch schreiben, ändern und löschen können.

- **Backend:** Speichert in einer JSON-Datei
- **Frontend:** Holt und zeigt die Nachrichten

---

## 9 🔧 Backend (Node.js + Express)

### 📁 Projekt vorbereiten

1. Neues Verzeichnis `backend` anlegen
2. `npm init -y` starten
3. **Pakete installieren:**
   ```bash
   npm install express cors
   ```
4. **In `package.json` ein Dev-Skript:**
   ```json
   "scripts": {
     "dev": "nodemon --env-file=.env server.js"
   }
   ```

### ⚙️ .env & Config

**`.env` Datei erstellen:**

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATA_FILE=messages.json
```

**`.env.sample`** mit gleichen Keys, nur ohne Werte.

👉 **Starten später mit:** `npm run dev`

### 🖥️ Express-Server Grundgerüst

**File `server.js`:**

- `express()` erstellen
- `cors({origin: process.env.FRONTEND_URL})` einbauen
- Middleware für `express.json()`
- Routes + Error-Handler + 404

### 💾 Datenhaltung

Im Root eine Datei `messages.json` erstellen mit leerem Array:

```json
[]
```

**Mit `fs/promises`:**

- `readFile` → `JSON.parse`
- `writeFile` → `JSON.stringify`

**💡 Tipp:** Mach dir 2 Helpers:

```javascript
async function readMessages() { ... }
async function writeMessages(messages) { ... }
```

### 🛣️ Routes

#### `GET /messages`

Liste der Einträge zurückschicken

#### `POST /messages`

- Body mit `{name, message}`
- Falls `!name || !message` → **400 Bad Request**
- Neue ID mit `crypto.randomUUID()`
- Neues Objekt `{id, name, message}` anhängen und speichern
- **201 Created** zurück mit Objekt

#### `PUT /messages/:id`

- Komplett ersetzen (Name + Message)
- Wenn ID nicht da → **404**

#### `DELETE /messages/:id`

- Entfernt Eintrag mit passender ID
- **204 No Content** wenn erfolgreich

#### `PATCH` (optional)

Nur einzelne Felder ändern (für Extra-Credit 😉)

### 🚨 Error Handling & 404

**Catch-all Route:**

```javascript
app.use((req, res) => {
  res.status(404).json({ error: "Seite nicht gefunden" });
});
```

**Allgemeiner Error-Handler:**

```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Serverfehler" });
});
```

---

## ⚛️ Frontend (Vite + React)

### 📁 Projekt starten

```bash
npm create vite@latest frontend
cd frontend
npm install
```

**Framework:** React, TypeScript optional.

### ⚙️ .env

**Frontend `.env`:**

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 🎨 Features

#### 📋 Liste anzeigen:

- `useEffect` → `fetch(${import.meta.env.VITE_API_BASE_URL}/messages)`
- Im State speichern, anzeigen

#### ✍️ Formular für neuen Eintrag:

- **Felder:** Name, Nachricht
- `POST` Request → bei Erfolg neu laden

#### 🗑️ Delete-Button neben jedem Eintrag:

- `DELETE /messages/:id`
- Danach Liste neu laden oder per State updaten

#### 🔧 Extra:

Inline-Edit über `PUT /messages/:id` oder `PATCH`

---

## ✅ Qualitäts-Checkliste

- ✅ Alle Methoden: `GET`, `POST`, `PUT`, `DELETE` (+ optional `PATCH`)
- ✅ Richtige Statuscodes (`201`, `400`, `404`, `204`)
- ✅ Globaler Error-Handler + 404 Route
- ✅ Konfigurierbares `PORT` & `FRONTEND_URL` in `.env`
- ✅ `cors` sauber gesetzt
- ✅ `.env.sample` vorhanden
- ✅ `uuid` via `crypto.randomUUID()`
- ✅ Dateispeicher mit `fs/promises` statt in-memory

---

## 🏆 BONUS

**Wer noch Zeit hat kann gerne versuchen:**

1. **Deployment bei Render:** Das fertige Projekt bei Render zu deployen. Dafür müssten in der `server.js` Änderungen vorgenommen werden und das Frontend muss den `dist`-Ordner im Backend erstellen

2. **Task-Liste komplettieren:** Unsere bereits deployte Task-Liste zu komplettieren. Das Backend benötigt noch den Code für einige Routen (`PATCH`, `DELETE`), ebenso das Frontend.
