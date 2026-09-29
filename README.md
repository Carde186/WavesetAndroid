# Waveset (Android)

App React Native per scoprire musica elettronica: catalogo di artisti, album
e brani consultabile senza account (bio, discografia, mappa eventi); con un
account si seguono artisti, si creano e gestiscono playlist, e si vede un
feed "Novità" personalizzato in Home. Un ruolo ADMIN gestisce il catalogo e
la coda di importazione eventi da Ticketmaster.

Il backend (Node.js + Express + MySQL) vive in `backend/` in questo stesso
repository e gira in Docker Compose — vedi "Avvio completo" sotto per come
portarlo su, popolarlo e collegare l'app.

## 1. Panoramica

### Funzionalità operative

Verificate presenti nel codice attuale (schermate in `src/schermate/`,
endpoint in `backend/src/routes/`), non pianificate:

- **Catalogo**: Home (Novità per chi segue qualcuno, Esplora per genere per
  tutti), Dettaglio artista/album/brano, ricerca live con debounce.
- **Autenticazione**: sessioni lato server (tabella MySQL, non JWT — vedi
  sotto), login, logout, "esci da tutti i dispositivi".
- **Follow**: seguire/smettere di seguire un artista, feed Novità e
  "Esplora per genere" costruiti di conseguenza.
- **Playlist**: multiple per utente (non una sola di default), aggiunta e
  rimozione brani, brani ordinati per data di aggiunta.
- **Eventi**: mappa (Google Maps, marker per artista), filtro "Che
  seguo"/"Tutti", Dettaglio evento, 4 tipi di mappa con preferenza salvata
  sul dispositivo.
- **Impostazioni**: tema chiaro/scuro (sempre accessibile, anche da
  anonimo), sezione Account (nome/email/ruolo, esci, esci da tutti i
  dispositivi — bloccata ma visibile se non loggato).
- **ADMIN**: coda di revisione eventi Ticketmaster (Profilo → "Coda eventi
  Ticketmaster"), anteprime di sola lettura Spotify e Deezer.
- **Link esterni**: bottone Spotify e badge Apple Music su album/brano, per
  i soli artisti del catalogo reale curato — comportamento dettagliato al
  punto 4.
- **"In evidenza su Deezer"** in Home, per chi ha fatto accesso: dati live
  da Deezer, testo e link, nessuna scrittura nel database.

**Non ancora implementate** (Android — per scelta di scope, non un
dimenticanza): recensioni su brani/album, cambio email/password, eliminazione
account, localizzazione IT/EN — tutte previste solo per il progetto
Fullstack separato, non per questa consegna Android.

### Stack e perché

- **Mobile**: React Native 0.87, **NativeWind** (Tailwind per RN) al posto
  di React Native Paper — nessuno stile "Material" imposto, design token
  propri (colori, raggi) coerenti su tutte le schermate.
- **Navigazione**: React Navigation (bottom tabs + stack nativi per
  schermata).
- **Icone**: Lucide (SVG via `react-native-svg`), non icone a font — la
  pipeline di stile di NativeWind riscrive `fontFamily` sui componenti
  `Text`, incompatibile con le icone a font.
- **Backend**: Node.js + Express, scelto (invece di limitarsi a backend di
  terze parti) per riusare lo stesso codice nel progetto Fullstack
  collegato a questo.
- **Database**: MySQL, containerizzato con Docker Compose (backend +
  database) sia in locale sia in vista del progetto Fullstack.
- **Autenticazione**: sessioni lato server su tabella MySQL (token casuale,
  hash SHA-256, confronto a tempo costante), non JWT — ogni richiesta
  autenticata verifica la sessione contro il database, quindi revocarla
  (logout, "esci da tutti i dispositivi") significa semplicemente
  cancellare la riga: effetto immediato, senza dover aggiungere
  un'infrastruttura a parte (es. una denylist condivisa) come servirebbe
  per ottenere lo stesso effetto con un JWT stateless verificato solo
  localmente. Trasportate come bearer token nell'header `Authorization`
  (non un cookie: React Native non ha la gestione automatica dei cookie di
  un browser).

### Struttura del repository

```
WavesetAndroid/
├── android/, ios/          nativo, generato dal CLI React Native
├── src/
│   ├── api/                client HTTP verso il backend
│   ├── autenticazione/     contesto sessione, storage sicuro del token
│   ├── componenti/         componenti riusabili (bottoni, card, badge...)
│   ├── navigazione/        tab bar + stack, tipi delle rotte
│   ├── preferenze/         contesto tema chiaro/scuro
│   ├── schermate/          una schermata per file (+ admin/ per le 4 ADMIN)
│   └── tema/                token di colore/raggio (NativeWind)
├── patches/                 patch-package (react-native-css-interop)
└── backend/
    ├── db/init/              schema + seed, eseguiti in ordine da MySQL
    ├── src/routes/            un file per area (artisti, album, brani, ...)
    ├── src/{itunes,spotify,deezer,ticketmaster}/  integrazioni esterne
    ├── scripts/               import/migrazione dati, lanciati a mano
    └── test/                  test di integrazione (node --test)
```

React (web, progetto Fullstack) e questo repository React Native restano
**sempre** separati: nessun pacchetto condiviso, codice duplicato dove
serve (per scelta esplicita, non un limite tecnico).

## 2. Configurazione delle chiavi

Tutte le variabili d'ambiente **realmente lette dal codice**, verificate
in `backend/.env.example`, `.env.example` (radice) e con una ricerca nel
codice (`process.env.*` nel backend, lettura diretta del `.env` in
`android/app/build.gradle` per quella del Maps) — nessuna aggiunta, nessuna
omessa. **11 variabili in totale: 1 nella radice del repository
(`GOOGLE_MAPS_API_KEY`) + 10 in `backend/.env`** (`PORT`, `DB_HOST`,
`DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `TICKETMASTER_API_KEY`,
`GOOGLE_GEOCODING_API_KEY`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`) —
tutte già elencate nelle due tabelle sotto, alcune raggruppate sulla stessa
riga per leggibilità dove condividono obbligatorietà/provenienza.

### Radice del repository (`.env`, per l'app Android)

| Variabile | Obbligatoria? | A cosa serve | Cosa succede senza |
|---|---|---|---|
| `GOOGLE_MAPS_API_KEY` | **Facoltativa, ma consigliata** | Mostra la mappa nella schermata Eventi (`react-native-maps`) | L'app funziona lo stesso, ma la mappa resta **grigia** — nessun crash |

**Come ottenerla, passo passo:**
1. [Google Cloud Console](https://console.cloud.google.com/) → crea/seleziona un progetto → attiva la **fatturazione** (obbligatoria per usare "Maps SDK for Android", indipendentemente da quanto costerà davvero l'uso che se ne fa). Non riportiamo qui una cifra di prezzi/quota gratuita: **Maps SDK for Android non è lo stesso prodotto di "Dynamic Maps"** (usata per le mappe JavaScript/web) e i due hanno piani e SKU distinti all'interno di Google Maps Platform — verifica prezzi e quote aggiornati sulla [pagina ufficiale dei prezzi di Google Maps Platform](https://mapsplatform.google.com/pricing/) prima di attivare la fatturazione, non fidarti di un numero scritto qui che potrebbe non essere più valido.
2. "API e servizi" → "Libreria" → abilita **"Maps SDK for Android"**.
3. "Credenziali" → "Crea credenziali" → "Chiave API".
4. Consigliato (non obbligatorio per farla funzionare): limita la chiave ad app Android, pacchetto `com.wavesetandroid`, con lo SHA-1 del keystore di debug:
   ```sh
   keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android
   ```
5. `cp .env.example .env` nella **radice** del repository, incolla il valore in `GOOGLE_MAPS_API_KEY=`.

La legge **Gradle** in fase di build (`android/app/build.gradle`, funzione che legge `GOOGLE_MAPS_API_KEY` dal `.env` della radice e la inserisce nel manifest), non il codice JavaScript: dopo averla aggiunta o cambiata serve una **nuova build nativa** (`npm run android`), non basta ricaricare Metro. Il `.env` è escluso da git.

### `backend/.env` (per il backend)

| Variabile | Obbligatoria? | A cosa serve | Dove ottenerla | Cosa succede senza |
|---|---|---|---|---|
| `PORT` | No (default `3000` nel codice) | Porta HTTP del backend | — | Usa `3000` |
| `DB_HOST` | Sì, ma già valorizzata in `.env.example` (`mysql`) | Host MySQL — **deve restare `mysql`** con Docker Compose (nome del servizio nella rete interna) | — | Il backend non trova il database |
| `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Sì, ma già valorizzate in `.env.example` | Credenziali MySQL locali (non servizi esterni, sono quelle che Docker Compose stesso crea) | — | Il backend non si connette |
| `TICKETMASTER_API_KEY` | **Facoltativa** | Import eventi da Ticketmaster Discovery API (`scripts/importaTicketmaster.js`) | [Ticketmaster Developer Portal](https://developer.ticketmaster.com/) → account → "My Apps" → nuova app (self-service, gratuita, 5000 richieste/giorno) → copia la "Consumer Key" | Lo script di import non parte; il resto dell'app funziona, con solo gli eventi del seed dimostrativo |
| `GOOGLE_GEOCODING_API_KEY` | **Facoltativa**, ha senso solo insieme a `TICKETMASTER_API_KEY` | Fallback di geocodifica quando Ticketmaster non fornisce coordinate valide | Stesso progetto Google Cloud del Maps sopra → abilita anche **"Geocoding API"** → crea una **seconda chiave**, dedicata (mai la stessa `GOOGLE_MAPS_API_KEY`: quella è ristretta a Maps SDK for Android e usata da Gradle, questa la chiama il backend via HTTP) | L'evento senza coordinate valide finisce in coda di revisione invece di essere geocodificato automaticamente |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | **Facoltative** | Solo l'**anteprima ADMIN** di sola lettura (`GET /api/admin/spotify/anteprima`) — Client Credentials Flow | [Spotify for Developers](https://developer.spotify.com/dashboard) → "Create app" → copia Client ID e Client Secret. **Nota**: l'app Spotify deve restare in modalità Development e l'account proprietario deve avere Spotify **Premium** attivo | L'anteprima risponde `503` in modo controllato; catalogo, playlist, bottoni Spotify sui brani reali, eventi, coda Ticketmaster e anteprima Deezer **funzionano comunque**, invariati |

**Non serve nessuna chiave per**: sfogliare il catalogo, autenticarsi, seguire artisti, gestire playlist, vedere la mappa eventi con marker (una volta impostato `GOOGLE_MAPS_API_KEY`), i bottoni Spotify/badge Apple Music sui brani del catalogo reale (link statici già verificati, nessuna chiamata a runtime), l'anteprima Deezer (API pubblica, nessuna registrazione).

**Nessuna chiave, token o segreto reale è incluso in questo README o nei file d'esempio** — solo nomi di variabili e istruzioni per ottenerle.

## 3. Avvio completo dopo `git clone`

Verificato eseguendo davvero ogni comando su questa macchina (non solo letto dal codice), tranne dove indicato esplicitamente alla fine.

### Prerequisiti

- Node.js `^22.13.0`, `^24.3.0` o `>= 26` (richiesto da React Native 0.87)
- Docker con Docker Compose
- Ambiente Android per React Native (SDK, JDK) e un dispositivo o emulatore raggiungibile da `adb`

### Sequenza

1. **Clone**
   ```sh
   git clone <url-di-questo-repository>
   cd WavesetAndroid
   ```

2. **Dipendenze JavaScript** (radice del repository)
   ```sh
   npm install
   ```
   Applica anche le patch in `patches/` (`patch-package`, script `postinstall`).

3. **Chiave Google Maps** (facoltativa, vedi sezione 2 sopra) — se la salti, procedi comunque: la mappa resterà grigia.
   ```sh
   cp .env.example .env
   # poi incolla GOOGLE_MAPS_API_KEY nel file .env appena creato
   ```

4. **Backend: configurazione**
   ```sh
   cd backend
   cp .env.example .env
   # facoltativo: incolla TICKETMASTER_API_KEY / GOOGLE_GEOCODING_API_KEY / SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET
   ```

5. **Backend + database: avvio**
   ```sh
   docker compose up -d --build
   ```
   Al primo avvio, su un volume MySQL vuoto, vengono eseguiti **in ordine numerico** tutti gli script in `backend/db/init/` (`01_schema.sql` → `12_collaboratori_brano_schema.sql`): schema completo (comprese le colonne aggiunte in un secondo momento, credito foto e collaboratori) più i dati dimostrativi (4 artisti/3 album/6 brani inventati, 4 eventi, utenti di prova, follow e playlist di esempio). Non serve eseguire nessuna migrazione a mano su un database nuovo: gli script numerati la coprono già.

6. **Verifica che backend e database siano su**
   ```sh
   curl localhost:3000/health
   # {"stato":"ok","database":"connesso"}
   ```

7. **Catalogo reale — obbligatorio per lo stato documentato in questo README** (senza questo passo il catalogo contiene solo i 4 artisti demo inventati, non i 6 reali descritti al punto 4). Questi script girano sull'**host**, non dentro il container (l'immagine Docker copia solo `src/`, non `scripts/` — vedi `backend/Dockerfile`): `DB_HOST` nel `.env` vale `mysql`, risolvibile solo nella rete interna di Docker, va quindi sovrascritto a `127.0.0.1` (la porta 3306 è pubblicata sull'host da `docker-compose.yml`) per l'esecuzione da riga di comando:
   ```sh
   DB_HOST=127.0.0.1 node scripts/importaCatalogoRealeLotto1.js --applica   # Carl Cox, Charlotte de Witte
   DB_HOST=127.0.0.1 node scripts/importaCatalogoRealeLotto2.js --applica   # Avicii, Alesso
   DB_HOST=127.0.0.1 node scripts/importaCatalogoRealeLotto3.js --applica   # Fred again.., ODESZA (crea anche il genere "Elettronica")
   ```
   Ogni script, lanciato **senza** `--applica`, mostra solo un'anteprima (nessuna scrittura) — consigliato lanciarlo così una volta prima, per leggere cosa verrebbe inserito. Sono idempotenti: rilanciarli non duplica nulla. (Verificato in questa sessione: lanciato senza `DB_HOST=127.0.0.1`, lo script fallisce con `Error: getaddrinfo ENOTFOUND mysql` — non un'ipotesi.)

   **Facoltativo**, per riprodurre anche il dettaglio "The Blessed Madonna" come collaboratrice del brano "Marea" di Fred again..:
   ```sh
   DB_HOST=127.0.0.1 node scripts/popolaCollaboratoriBrani.js --solo-brano-id=<id di "Marea" — verificalo con una query, cambia da un'installazione all'altra> --applica
   ```

   **Non eseguire** (preparati ma non fanno parte dello stato documentato — vedi punto 4): `importaCatalogoRealeLotto4.js`, `importaCatalogoRealeLotto5.js`.

8. **App: build e avvio** (torna alla radice del repository)
   ```sh
   cd ..
   npm run android
   ```
   Richiede una build nativa (non basta ricaricare Metro): l'app usa moduli nativi (`react-native-keychain`, `react-native-maps`, `react-native-svg`, `react-native-reanimated`).

9. **Inoltro porte** (il dispositivo/emulatore deve raggiungere `localhost:3000` e Metro sul computer host):
   ```sh
   adb reverse tcp:3000 tcp:3000
   adb reverse tcp:8081 tcp:8081
   ```
   Si perde a ogni riconnessione del cavo o riavvio di `adb`: se l'app mostra errori di rete mentre `curl localhost:3000/health` dal computer risponde, rilanciare questi due comandi. Con più dispositivi: `adb -s <seriale> reverse ...` per ciascuno (`adb devices` elenca i seriali).

### Come verificare che tutto funzioni

- Backend: `curl localhost:3000/health` → `{"stato":"ok","database":"connesso"}`.
- Database popolato: `docker exec backend-mysql-1 mysql -uroot -proot waveset -e "SELECT COUNT(*) FROM artista;"` → deve restituire 10 dopo il punto 7 (6 reali + 4 demo). Il nome del container (`backend-mysql-1`) è quello assegnato di default da Docker Compose al servizio `mysql` definito in `backend/docker-compose.yml`.
- App: si apre sulla Home, mostra "Esplora per genere" con almeno House/Techno/Trance/Drum and Bass/Elettronica; Dettaglio artista di Carl Cox o Charlotte de Witte mostra foto con credito.

### Obbligatorio vs facoltativo

| Passo | Obbligatorio? | Richiede credenziali esterne? |
|---|---|---|
| 1-2 (clone, `npm install`) | Sì | No |
| 3 (Google Maps) | Facoltativo (mappa grigia senza) | Sì |
| 4-6 (backend + verifica) | Sì | No |
| 7 (lotti 1-3) | Sì, per lo stato documentato | No |
| 7 (collaboratori) | Facoltativo | No |
| 8-9 (app + adb reverse) | Sì | No |
| Ticketmaster/Geocoding/Spotify (§2) | Facoltativi | Sì |

### Cosa NON ho potuto verificare da zero

Ho verificato ogni comando singolarmente su questa macchina (con il backend già avviato in precedenza, il database già popolato oltre i lotti 1-3, e l'app già builtata) — **non ho eseguito un `git clone` in una cartella vuota e ripetuto l'intera sequenza da zero** in questa sessione. In particolare non ho una conferma diretta, in questa sessione, di: tempo/esito del primo `docker compose up -d --build` su un volume Docker davvero vuoto (mai avviato prima), e del primo `npm run android` su un ambiente Android locale mai configurato. La sequenza rispecchia esattamente i comandi e l'ordine dei file coinvolti (nomi verificati contro il repository), ma questi due passaggi specifici restano non testati end-to-end da zero in questa sessione.

## 4. Funzionalità e stato dei dati

### Link Apple Music e Spotify — come funzionano

Solo per gli artisti del **catalogo reale curato** (mai per i 4 demo): due comportamenti diversi, non sono la stessa cosa.

- **Copertina album (Apple)**: chiamata **dal vivo** a iTunes/Apple Music ad ogni apertura del Dettaglio album (mai salvata nel database), verificata contro nome artista e titolo album prima di essere mostrata — se il catalogo Apple cambiasse cosa c'è dietro quell'id, il componente **non mostra nulla** invece di un'artwork sbagliata.
- **Link album (Spotify)** e **link brano (Apple)**: mappature **statiche**, verificate una volta e scritte nel codice (`backend/src/spotify/linkAlbum.js`, `backend/src/itunes/linkBrano.js`) — nessuna chiamata esterna a runtime per "ritrovare" un link già noto.
- **Link brano (Spotify)**: colonna `url_spotify` sul brano stesso, scritta all'importazione.
- **Quando manca un link** (album senza mappatura, artista demo, brano senza `url_spotify`): il componente corrispondente **non renderizza nulla** — mai un bottone rotto o un placeholder senza destinazione.
- **Caso particolare — "Cloud Nine" di Kygo** (non ancora nel database, lotto 5 non applicato): non ha un prodotto Apple corrispondente (verificato: nessun risultato sullo store italiano), solo il link Spotify all'album; il brano "Firestone" mostrerà comunque entrambi i link nel proprio Dettaglio, indipendentemente dall'album.
- **Brani senza album** (`album_id` NULL — es. i singoli di Martin Garrix, non ancora nel database): i link funzionano lo stesso, perché dipendono solo dal brano (chiave artista+titolo), mai da un album locale.
- **Collaboratori** (colonna `brano.collaboratori`, nullable): un artista accreditato ma **assente dal titolo ufficiale** del brano (es. Bebe Rexha su "In the Name of Love" di Martin Garrix, non ancora nel database) compare come riga "Con {nome}" nel Dettaglio brano, **senza alterare il titolo**, non tappabile. Popolata solo quando il nome non è già nel titolo — quando un featuring è già scritto nel titolo (es. "Titanium (feat. Sia)"), questa colonna resta `NULL`, niente doppione.

### Stato attuale del catalogo (verificato via query dirette, non stimato)

- **6 artisti reali importati**: Carl Cox, Charlotte de Witte (lotto 1), Avicii, Alesso (lotto 2), Fred again.., ODESZA (lotto 3) — con album, brani, foto con credito Wikimedia Commons verificato, generi (incluso "Elettronica", creato dal lotto 3).
- **4 artisti demo ancora presenti** (Nova Circuit, Sunset Grid, Lucent Wave, Break Signal — id 1-4): dati/nomi inventati, mai rimossi finora.
- **Lotti 4 e 5 preparati ma NON applicati**: `importaCatalogoRealeLotto4.js` (Calvin Harris, David Guetta) e `importaCatalogoRealeLotto5.js` (Martin Garrix, Kygo) esistono, sono testati, ma non hanno scritto nulla nel database — eseguirli è una scelta rimandata, non un errore.
- **Un brano ("Marea", di Fred again..) ha un collaboratore popolato** ("The Blessed Madonna") — solo se è stato eseguito anche il passo facoltativo del punto 7 sopra.
- **Perché "solo" 6 artisti reali**: ogni artista richiede una verifica manuale non automatizzabile — identità su MusicBrainz (rischio di omonimi), foto con licenza libera verificata singolarmente su Wikimedia Commons, e per ogni brano un confronto puntuale fra edizione Spotify e Apple (titolo esatto, durata, featuring reali vs. inventati nel titolo) per evitare errori di attribuzione. È un processo lento per scelta, non automatizzabile senza perdere l'affidabilità dei dati verificati. Con la consegna imminente, il lavoro si è fermato dopo il lotto 3 per dare priorità a stabilizzazione e README, lasciando i lotti 4 e 5 pronti ma non applicati (vedi punto sopra).

### Database di sviluppo attuale vs dati ricreabili da `git clone`

Distinzione importante: **il database usato durante lo sviluppo di questa sessione contiene un dato che i file versionati NON ricreano**. In quel database esiste una playlist "Alba" (utente Alice, id playlist 60) creata **a mano dal telefono**, non da nessun seed o script — contiene un brano demo ("Alba su Napoli") e un brano reale ("The Realm" di Charlotte de Witte). **Questa playlist non esiste e non può esistere subito dopo un `git clone`**: nessun file di questo repository la crea. Chi clona il repository ed esegue la sequenza del punto 3 ottiene un catalogo con lo stato descritto sopra, ma **nessuna playlist "Alba"** — solo quelle del seed (`04_playlist_seed.sql`: 2 playlist di Alice, 1 di Bob, tutte su brani demo).

### Limiti noti e lavori rimasti

- **Pulizia del catalogo demo**: i 4 artisti demo non sono ancora stati rimossi. Non è un'operazione banale: eliminare un artista demo fa cascata (vincoli `ON DELETE CASCADE`) su album, brani, follow **e voci di playlist** — inclusa, sul database di sviluppo attuale, la playlist "Alba" sopra (che referenzia un brano demo). Va gestita con un backup preventivo e una verifica riga per riga prima di qualunque cancellazione, mai un `DELETE` diretto sui 4 artisti.
- Lotti 4 e 5 (Calvin Harris, David Guetta, Martin Garrix, Kygo) non applicati.
- Il collaboratore di "In the Name of Love" (Bebe Rexha) non è ancora scrivibile: il brano non esiste finché il lotto 5 non viene applicato.
- La UI dei collaboratori ("Con {nome}" nel Dettaglio brano) è stata verificata **tramite codice e risposta API reale** (`GET /brani/:id` restituisce `collaboratori` correttamente, la logica di `DettaglioBranoSchermata.tsx` è stata riletta riga per riga sui dati reali) — **non è stata verificata visivamente sul telefono**: questo ambiente non permette di simulare interazioni touch sul dispositivo di sviluppo usato in questa sessione (solo screenshot della schermata iniziale sono possibili).
- Recensioni, cambio email/password, eliminazione account, localizzazione IT/EN: per scelta di scope, non previste per questo deliverable Android (vedi "Panoramica").

## 5. Test e consegna

```sh
cd backend
npm install      # solo la prima volta
npm test         # con i container del punto 3 attivi
```

Stato al momento di questa consegna: **191/191 verdi**. Coprono autenticazione, isolamento tra due utenti reali su playlist/follow, ricerca, feed Novità, eventi (inclusa la coda di revisione), import Ticketmaster (servizi esterni mockati, nessuna chiave richiesta per i test), le anteprime Spotify/Deezer (mockate), l'idempotenza e la sicurezza (chiave ambigua, interruzione a metà transazione) di tutti gli import del catalogo reale, e la coerenza delle mappature Apple/Spotify.

Il passo facoltativo per "The Blessed Madonna" (punto 7 di "Avvio completo")
richiede di conoscere l'id locale del brano "Marea", che **cambia da
un'installazione all'altra** (dipende dall'ordine/storico degli insert): va
prima trovato con una query (`SELECT id FROM brano WHERE titolo LIKE
'Marea%'`), non è un comando copiabile a occhi chiusi.
