# 🎮 Catch the Falling Balls — Funkcionalni ECS Projekat

###### 📦 POKRETANJE

Otvoriti `index.html` u browseru - pokrenuti Live server iz index.html-a. Nije potrebna instalacija dodatnih biblioteka.

## 👨‍💻 Autor

Djordje Paunovic - 2019240605

- Predmet: Funkcionalno programiranje

## 🧠 Opis projekta

Ova igrica demonstrira primenu funkcionalne paradigme kroz implementaciju **Entity-Component-System (ECS)** engine-a u JavaScriptu. Igra se zasniva na jednostavnom konceptu: fudbaler (kopačka) pomera se levo/desno i hvata lopte koje padaju. Vremenom lopte padaju sve brže, a cilj je uhvatiti što više pre nego što neka prođe.

## 🧱 Arhitektura

Projekat je podeljen u sledeće fajlove:
catch-game/
├── index.html // HTML i UI modal
├── game.js // Glavna logika igre i sistemi
├── ecs.js // Core ECS engine
└── assets/
├── boot.png // Slika fudbalera (kopačka)
└── ball.png // Slika lopte

## ⚙️ ECS Sistemi

- **Input sistem** — reaguje na strelice levo/desno
- **Render sistem** — koristi `drawImage` za prikaz entiteta
  +++
- **Gravitacija** — ubrzava lopte tokom vremena
- **Kolizija** — detektuje hvatanje lopte
- **Spawn sistem** — generiše nove lopte svakih 60 frame-ova
- **Miss sistem** — detektuje promašene lopte i aktivira Game Over

## 🧪 Funkcionalni principi

- ✅ **Imutabilnost**: svi sistemi vraćaju novi `store`
- ✅ **Kompozicija funkcija**: `reduce` u `gameLoop`
- ✅ **Funkcije višeg reda**: `runSystem`, `createEntity`, `setTimeout`
- ✅ **map/filter/reduce**: koristi se za obradu entiteta

## 🏆 High Score

Rezultat se čuva u `localStorage`. Klikom na **QUIT** briše se i prikazuje dugme **PLAY AGAIN** koje pokreće igru od nule.

## 🎮 Kontrole

- ⬅️ Strelica levo — pomera fudbalera ulevo
- ➡️ Strelica desno — pomera fudbalera udesno
