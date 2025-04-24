# 🛒 SmartCart – Einkaufsplanung leicht gemacht

Willkommen bei **SmartCart**, der intelligenten Webapplikation zur Einkaufsplanung, Vorratsverwaltung und Rezeptvorschlägen. Spare Zeit, reduziere Foodwaste und plane deinen Einkauf effizient – egal ob zu Hause oder unterwegs.

## 🌐 Live-Version

Die Anwendung ist jederzeit erreichbar unter:

🔗 [https://smartcart.website](https://smartcart.website)

---

## 🚀 Projekt lokal starten (mit Docker)

### 🔧 Voraussetzungen

Stelle sicher, dass folgende Tools auf deinem System installiert sind:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 📦 Projektstruktur

Das Projekt besteht aus drei zentralen Komponenten:

- **Frontend:** Angular-Anwendung (unter `src/`)
- **Backend:** Express.js API (unter `backend/`)
- **Datenbank:** MariaDB (Docker-Container)

### 🧪 Lokaler Start mit Docker

Erstelle eine .env Datei mit folgendem inhalt im Root (SmartCart-MVP) Ordner
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=smartcart
DB_PORT=3306


1. **Repository klonen:**

```bash
git clone https://github.com/CodeChoreographer/smartcart-mvp.git
cd smartcart-mvp
```

2. **Docker-Container starten:**

```bash
docker-compose up --build
```

> Hinweis: Beim ersten Start kann der Build-Vorgang einige Minuten dauern, da alle Abhängigkeiten geladen werden.

---

## 🌍 Zugriff auf die Applikation

Nach dem Start der Container erreichst du die Anwendung unter folgenden Adressen:

- **Frontend (Angular):**  
  [http://localhost:4200](http://localhost:4200)

- **Backend (Express API):**  
  [http://localhost:3000](http://localhost:3000)

> Stelle sicher, dass keine anderen Anwendungen bereits auf Port 4200 oder 3000 laufen.

---
