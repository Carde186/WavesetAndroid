# CLAUDE.md — Waveset

## Stato del documento
Specifiche ufficiali del docente arrivate e integrate per entrambi i
deliverable (vedi "I due deliverable" sotto). Documento operativo, in uso
con Claude Code.

---

## Cos'è Waveset
Piattaforma di scoperta musica elettronica (tipo Spotify/SoundCloud molto più
essenziale). Chiunque può sfogliare il catalogo senza registrarsi; un utente
registrato segue artisti, crea playlist, scrive recensioni; un ADMIN gestisce
il catalogo.

Progetto puramente educativo, non verrà pubblicato.

## I due deliverable
Sono due consegne separate per il corso, che condividono lo stesso backend:

1. **WavesetAndroid** — scadenza più vicina, si parte da questo. Repo a sé,
   NON un monorepo. Requisiti ufficiali:
   - README.md con: titolo e descrizione progetto; istruzioni d'uso per un
     collega sviluppatore (dipendenze, dati necessari per provare l'app —
     **si dà per scontato un lettore già tecnico**, che sa creare un
     progetto React Native da zero: niente spiegazioni base); funzionalità
     future; riferimenti utili
   - useState, useEffect
   - React Navigation con più di uno screen
   - libreria di componenti CSS (React Native Paper) o stile CSS decente
   - useContext (qui: tema chiaro/scuro — coincide con quanto già previsto
     in Impostazioni)
   - è permesso agganciarsi a backend di terze parti online — **scelta
     presa**: backend Node/Express + MySQL veri, non solo API di terze
     parti, per riusare lavoro in vista del Fullstack. Vedi "Come si avvia"
     sotto per come questo resta comunque riproducibile con un comando
   - deve funzionare con `git clone` + istruzioni nel README
   - extra utili: screenshot dell'app

2. **waveset** — progetto Fullstack, monorepo con sottocartelle per ogni
   servizio. Requisiti ufficiali:
   - README.md con: titolo/descrizione; istruzioni d'uso (dipendenze, dati
     per provare il sistema nella sua interezza, quali servizi devono
     essere attivi); funzionalità future; riferimenti utili
   - database, backend, API, frontend web
   - Docker Compose per lanciare tutti i servizi
   - una funzionalità AI nel backend — vedi "Funzionalità AI" sotto
   - è permesso agganciarsi anche a backend di terze parti online, **da
     specificare esplicitamente quali e come avviene il collegamento** —
     qui: Spotify, Ticketmaster, Google Maps (vedi "Integrazioni esterne")
   - monorepo con servizi in sottocartelle
   - deve funzionare interamente con `git clone` + istruzioni nel README
   - extra utili: screenshot, documentazione, dati di init

Il backend si sviluppa una volta sola dentro il monorepo `waveset`; per
`WavesetAndroid` se ne copia uno snapshot al momento della consegna, incluso
il proprio `docker-compose.yml` per backend+database.

## Stack tecnologico
- **Web**: React
- **Mobile**: React Native (React Native Paper come libreria componenti)
- **Backend**: Node.js + Express (nuovo — sostituisce il backend Spring Boot
  già consegnato come progetto a sé per il corso Java, che resta invariato e
  non viene toccato)
- **Database**: MySQL — Lorenzo lo conosce già, nessun vantaggio tecnico
  concreto di PostgreSQL per questo schema (tutto relazionale standard) tale
  da giustificare la curva di apprendimento
- **Containerizzazione**: Docker Compose per backend + database, sia su
  Fullstack che su Android (requisito esplicito solo per Fullstack, adottato
  anche su Android per coerenza e riuso)
- **Pannello admin**: non è un'app separata — sono schermate dentro la stessa
  app React, dietro controllo del ruolo ADMIN

## Struttura repository

```
waveset/                      (monorepo — progetto Fullstack)
├── frontend/                 React (web)
├── backend/                  Node.js + Express — sviluppato qui
└── README.md

WavesetAndroid/                (repo a sé — progetto Android)
├── android/                  nativo Android, generato dal CLI React Native
├── ios/                      nativo iOS, generato dal CLI (non usato per il target Android)
├── App.tsx, index.js, package.json, ...   progetto React Native alla radice
├── backend/                  snapshot del backend, aggiunto più avanti — allo
│                              stesso livello di android/ e ios/, non dentro
│                              una sottocartella app/
└── README.md
```

Nota: originariamente si era pensato a `app/` come sottocartella dedicata al
progetto React Native dentro `waveset-android/`. In pratica il progetto è
stato generato direttamente alla radice del repo (percorso reale:
`/Users/lorenzocardellini/Documents/React_Native/Progetti-ITS/WavesetAndroid`),
quindi `android/`, `ios/` e i file React Native vivono lì, non dentro `app/`.

React (web) e React Native (mobile) sono **sempre** repo fisicamente separati.
Codice condiviso tra i due (es. client API) va duplicato — nessun pacchetto
npm interno, nessun tentativo di condivisione a livello di file.

## Convenzioni di codice
- Nomi di variabili e funzioni **in italiano**
- Indentazione a 4 spazi
- Codice semplice e leggibile, evitare astrazioni non necessarie
- Messaggi di commit in italiano

## Modello dati

Entità di base: **User**, **UserProfile** (1:1 con User), **Artist**,
**Song** (N:1 con Artist), **Event**, **Playlist** (N:1 con User, N:N con
Song), **Review**.

Modifiche rispetto allo spec iniziale, decise durante la progettazione:

| Entità/relazione | Decisione v1 |
|---|---|
| **Genere** | Nuova entità, N:N con Artist. Song NON ha un genere proprio — lo eredita filtrando tramite l'artista. |
| **PlaylistSong** | Join esplicito Playlist↔Song con campo `aggiunto_il` (timestamp). Ordine = cronologico. Niente campo `posizione`/riordino manuale in v1. |
| **Review** | Aggiunto vincolo di unicità (user_id, song_id). Serve supporto per la modifica, non solo la creazione. |
| **Album** (nuova) | `titolo`, `data_pubblicazione`, `artista_id` (N:1 Artist). `Song.album_id` nullable — un brano può non appartenere a nessun album. `Song.data_pubblicazione` è un campo a sé, indipendente da quella dell'album. |
| **AlbumReview** (nuova) | Gemella di Review ma per Album (stessa struttura, stesso vincolo di unicità). Entità separata per non modificare Review, già scritta e testata nel backend Spring. |
| **Event** | Aggiunti `latitudine`/`longitudine` (numerici). Inseriti a mano dall'ADMIN per gli eventi non importati da Ticketmaster — vedi sezione Ticketmaster più sotto per l'automazione. |
| **Event↔Artist (lineup)** | Resta N:N pura. Nessun campo "ruolo" (headliner/opening act) in v1 — rimandato al futuro. |
| **User↔Artist (follow)** | Join implicito, nessun attributo aggiuntivo. |

## Ruoli e permessi

**Anonimo**: sfoglia catalogo, dettaglio artista/brano/album/evento, mappa
eventi (vista "Tutti", centrata sull'Italia), bottone Spotify.

**Autenticato**: + segue artisti, crea/modifica playlist, scrive recensioni
(su brano e su album — solo Fullstack, vedi differenze Android), vede il feed
"Novità" personalizzato in Home, accede a Profilo/Impostazioni completi.

**ADMIN**: vedi sezione dedicata sotto.

## Cosa fa davvero l'ADMIN

Quattro responsabilità distinte, non solo "approvare eventi":

1. **CRUD completo sul catalogo** — creare/modificare/eliminare Artist, Song,
   Album, Genere, Event a mano.
2. **Inserimento manuale eventi** per la scena che Ticketmaster non copre
   (club night piccoli, festival su altri canali di vendita) — canale
   primario per questi, non un fallback.
3. **Coda di revisione eventi Ticketmaster** (modalità ibrida) — la maggior
   parte degli eventi importati si pubblica **automaticamente**. Finiscono in
   coda per revisione manuale SOLO quelli che falliscono una regola:
   - coordinate irrecuperabili (0.000000 *e* geocodifica di fallback fallita)
   - possibile doppione (stesso artista + data + venue da rivenditori diversi)
   - lineup ambiguo (nessuna attraction con `subType.name === "Artist"`)
4. **Correzione dati importati da Spotify** in fase di seed (genere sbagliato,
   bio incompleta) — l'importazione è una tantum, non un sync continuo.

Nessun ruolo di moderazione su recensioni/contenuti utente in v1 (possibile
aggiunta futura).

## Funzionalità AI (solo Fullstack)

Requisito esplicito della specifica Fullstack. Scelta: **assistente per la
coda di revisione eventi Ticketmaster** (punto 3 sopra), non una feature
scollegata aggiunta solo per soddisfare il requisito.

Come funziona: quando un evento importato finisce in coda per possibile
doppione (stesso artista + data + venue da rivenditori diversi), invece di
lasciare solo il confronto meccanico dei campi, una chiamata a un LLM
valuta il caso e propone una decisione ("stesso evento" / "eventi diversi")
con una breve motivazione. L'ADMIN vede la proposta e conferma o corregge —
l'AI propone, non decide da sola.

- **Online via API key**, non Ollama locale — scelto per un setup più
  leggero e riproducibile con `git clone` (nessun modello da scaricare).
- Provider: `[DA DECIDERE — OpenAI / Anthropic / OpenRouter]`
- La chiave va documentata nel README insieme alle altre (Spotify,
  Ticketmaster, Google Maps).

## Schermate (dal prototipo wireframe — canvas Waveset)

- **Home**: feed "Novità" (brani/eventi recenti degli artisti seguiti) in
  cima; sotto, sezione "Esplora per genere" (per chi non segue ancora
  nessuno, o per utenti anonimi)
- **Dettaglio artista**: bio, Segui, lista Brani (bottone Spotify per riga),
  sezione Album, Prossimi eventi
- **Dettaglio brano**: titolo, artista, data pubblicazione, bottone Spotify,
  voto medio, lista recensioni, CTA "Lascia una recensione" (gated — solo
  Fullstack)
- **Dettaglio album**: come sopra + tracklist (recensioni solo Fullstack)
- **Playlist**: brani ordinati per data aggiunta, bottone Spotify per riga,
  rimozione
- **Eventi**: mappa con marker personalizzati (loghi artista) + toggle
  "Che seguo / Tutti" (il primo visibile solo se loggato) + lista eventi
- **Dettaglio evento**: mappa, lineup completo, link esterno a Google Maps
- **Profilo**: playlist, artisti seguiti, recensioni (solo Fullstack),
  impostazioni
- **Artisti seguiti**: lista semplice
- **Le mie recensioni**: lista (brani e album insieme) — solo Fullstack
- **Impostazioni**: sezione Aspetto (tema chiaro/scuro — sempre accessibile,
  anche da anonimo) + sezione Account (bloccata se non loggato — contenuto
  diverso tra Android e Fullstack, vedi differenze sotto)
- **Accedi per continuare**: mostrata su Playlist/Profilo quando l'utente non
  è loggato
- **Tab bar**: Home / Eventi / Playlist / Profilo, con icone

## Ricerca
Va costruita per davvero: schermata con risultati live (debounce ~300ms),
raggruppati in sezioni Artisti/Brani. **Prima verificare** se il backend
Spring esistente ha già un endpoint di ricerca con match parziale
(`LIKE`/`ILIKE`, non match esatto) — se sì, si riusa lo stesso comportamento
nel nuovo backend Node; se no, va scritto ex novo.

## Integrazioni esterne

**Spotify** — solo Client Credentials Flow per popolare il catalogo in fase
di seed (`/search`, `/tracks/{id}`, `/artists/{id}`, `/albums/{id}`), più un
bottone "Ascolta su Spotify" che è un semplice link esterno
(`external_urls.spotify` da ogni Track). **Niente OAuth, niente player
integrato, niente preview audio** (rimosse dall'API Spotify da novembre 2024,
permanente), **niente sync playlist**.

**Google Maps** — Maps JavaScript API (web) / `react-native-maps` (mobile),
marker personalizzati con logo artista. Usata per intero, senza versioni
semplificate, sia su Fullstack che su Android. Richiede account di
fatturazione Google Cloud (free tier: 10.000 caricamenti mappa/mese,
ampiamente sufficiente).

**Ticketmaster Discovery API** — unica fonte automatica per l'import eventi
(niente Bandsintown, richiede partnership commerciale; niente TicketOne,
nessuna API pubblica trovata). Credenziali già ottenute (self-service,
gratuita). Regole:
- Query **per nome artista/festival**, mai per genere (il filtro genere perde
  sia i festival grandi, classificati sotto "Miscellaneous", sia gran parte
  della scena underground italiana)
- Script/job periodico interroga l'API per ogni artista del catalogo
- Coordinate: usa `location.latitude`/`longitude` se diverse da
  `"0.000000"`; altrimenti fallback su geocodifica dell'indirizzo
  (`address.line1` + `city.name` + `country.name`)
- Lineup: filtra `_embedded.attractions` tenendo solo quelle con
  `classifications[0].subType.name === "Artist"`, per escludere il nome del
  festival trattato come se fosse un artista
- Pubblicazione automatica salvo i casi da mettere in coda — vedi "Cosa fa
  davvero l'ADMIN" sopra

**Localizzazione IT/EN** (react-i18next) — richiesta esplicitamente dal
docente. **Solo Fullstack**, implementata per ultima, solo se avanza tempo.
Copre solo le stringhe statiche dell'interfaccia (bottoni, etichette,
messaggi) — **non** i contenuti del catalogo (bio, nomi, descrizioni), che
restano nella lingua in cui li ha inseriti l'ADMIN. Setup: stessa API
(`useTranslation`, `t()`) su web e mobile; il language detector cambia
(`i18next-browser-languagedetector` sul web, un pacchetto dedicato tipo
`react-native-localize` su mobile).

## Differenze Android vs Fullstack

Rimosse dalla versione Android (per ora — possibile aggiunta futura):
- Localizzazione IT/EN
- Notifiche push
- Cambia email
- Cambia password
- Elimina account
- Recensioni su brani e album (lettura e scrittura)

Intatte in entrambe le versioni, senza semplificazioni: catalogo, dettaglio
artista/brano/album, follow, playlist, ricerca, feed Novità, mappa eventi
completa (Google Maps con marker personalizzati, non una lista), bottone
Spotify, autenticazione con gating per utenti anonimi, logout.

## Come lavorare su questo progetto

- **Passo per passo**: procedi spiegando via via cosa fai. Sulle parti più
  semplici/standard basta una spiegazione breve; sulle parti concettualmente
  più difficili (es. perché una certa relazione va modellata in un certo
  modo, meccanismi asincroni, scelte di sicurezza, integrazioni esterne)
  fermati più a lungo: motiva davvero la scelta, le alternative scartate e
  perché.
- **Commit**: NON eseguire `git commit` né `git push`. Dimmi quale comando
  useresti e con quale messaggio, poi li scrivo ed eseguo io da terminale.

## README — requisiti

Pubblico di riferimento: **lettore già tecnico**, che sa creare un progetto
React Native/Node da zero — niente spiegazioni base (`npm install`, cos'è
Metro, ecc.), solo ciò che è specifico di questo progetto.

Contenuto obbligatorio (entrambi i deliverable):
- Titolo e descrizione del progetto
- Istruzioni d'uso per un collega sviluppatore: dipendenze da installare,
  dati/chiavi necessari per provare l'app (Fullstack: anche quali servizi
  devono essere attivi)
- Funzionalità da sviluppare in futuro (mappa naturalmente sulle voci in
  "Differenze Android vs Fullstack" e sulle feature rimandate)
- Riferimenti in rete utili/necessari

Aggiuntivo:
- Passo per passo, come ottenere ciascuna chiave API dai siti ufficiali
  (Spotify for Developers, Ticketmaster Developer Portal, Google Cloud
  Console, provider AI) e come inserirle nel file `.env` (nomi esatti delle
  variabili attese dal codice)
- Solo Fullstack: elencare esplicitamente i backend di terze parti usati
  (Spotify, Ticketmaster, Google Maps) e come avviene il collegamento a
  ciascuno — richiesto testualmente dalla specifica

**README_REACT_NATIVE.md** (solo Android): il README generato in automatico
dal CLI React Native va rinominato così e tenuto solo se contiene contenuto
realmente utile oltre al boilerplate standard (es. note di troubleshooting
specifiche) — altrimenti va eliminato, non tenuto "per abitudine". In ogni
caso, qualunque passo davvero necessario per far funzionare **questo**
progetto deve stare nel README.md principale, non delegato lì: la consegna
richiede esplicitamente che il progetto funzioni seguendo le istruzioni nel
README.md.

## Stato di avanzamento

Ordine di lavoro concordato — aggiorna questa lista mano a mano che si
procede, spuntando cosa è fatto:

- [x] Docker Compose (backend + MySQL)
- [x] Scaffolding progetto + navigazione base
- [ ] Schermate di catalogo (Home, Dettaglio artista/brano/album)
- [ ] Playlist
- [ ] Autenticazione (JWT contro il backend, ruoli USER/ADMIN)
- [ ] Ricerca
- [ ] Eventi + mappa (Google Maps, marker, Dettaglio evento)
- [ ] Integrazione Ticketmaster (import + coda di revisione)
- [ ] Assistente AI per la coda di revisione (solo Fullstack)
- [ ] Bottone Spotify + seed catalogo via Spotify Client Credentials
- [ ] Impostazioni (tema chiaro/scuro + sezione Account)
- [ ] Recensioni brani/album (solo Fullstack)
- [ ] Localizzazione IT/EN (solo Fullstack, solo se avanza tempo)
- [ ] README (+ README_REACT_NATIVE.md su Android)
