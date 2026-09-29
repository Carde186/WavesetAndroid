# Waveset (Android)

App React Native per scoprire musica elettronica: catalogo di artisti, brani
e album consultabile senza account; con un account si creano e gestiscono
playlist. Il backend (Node.js + Express + MySQL) gira in Docker Compose nella
cartella `backend/` di questo stesso repository.

## Requisiti

- Node.js `^22.13.0`, `^24.3.0` o `>= 26` (richiesto da React Native 0.87)
- Docker con Docker Compose
- Ambiente Android per React Native (SDK, JDK) e un dispositivo o emulatore
  raggiungibile da `adb`

## Avvio

### 1. Backend e database

```sh
cd backend
cp .env.example .env
docker compose up -d --build
```

Al primo avvio MySQL esegue gli script in `backend/db/init/` (schema e dati di
prova). Girano solo su un volume vuoto: dopo una modifica agli script, o per
tornare ai dati iniziali, `docker compose down -v` e poi di nuovo `up`.

Verifica: `curl localhost:3000/health`.

### 2. Chiave Google Maps

La mappa degli eventi usa Google Maps (`react-native-maps`). Senza chiave
l'app funziona, ma la mappa resta grigia.

1. Google Cloud Console: progetto con fatturazione attiva, API
   **Maps SDK for Android** abilitata, crea una chiave API.
2. Consigliato: limitala ad app Android con nome pacchetto
   `com.wavesetandroid` e SHA-1 del keystore di debug
   (`keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android`).
3. Nella radice del repository: `cp .env.example .env` e inserisci il valore
   di `GOOGLE_MAPS_API_KEY`.

La chiave la legge Gradle in fase di build (`android/app/build.gradle`) e la
scrive nel manifest: dopo averla aggiunta o cambiata serve una nuova build
nativa. Il `.env` è escluso da git.

### 3. App

Dalla radice del repository:

```sh
npm install
npm run android
```

`npm install` applica anche le patch in `patches/` (tramite `patch-package`,
nello script `postinstall`). Serve una build nativa (`npm run android`), non
basta ricaricare Metro: l'app usa moduli nativi (`react-native-keychain`,
`react-native-maps`, `react-native-svg`, `react-native-reanimated`).

### 4. `adb reverse`

L'app chiama il backend su `http://localhost:3000` (vedi
`src/api/config.ts`). Sul telefono o sull'emulatore `localhost` è il
dispositivo stesso: le porte vanno inoltrate al computer.

```sh
adb reverse tcp:3000 tcp:3000   # backend
adb reverse tcp:8081 tcp:8081   # Metro
```

L'inoltro si perde a ogni riconnessione del cavo o riavvio di `adb`: se l'app
mostra errori di rete (`Network request failed` nei log) mentre
`curl localhost:3000/health` dal computer risponde, rilanciare i due comandi.
Con più dispositivi collegati: `adb -s <seriale> reverse ...` per ciascuno
(`adb devices` elenca i seriali).

### 5. Import eventi Ticketmaster (facoltativo)

Popola il catalogo eventi da Ticketmaster Discovery API, cercando per nome
ogni artista già presente nel database. Senza queste chiavi l'app funziona
comunque, con solo gli eventi del seed.

1. **Ticketmaster**: [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
   → crea un account → "My Apps" → nuova app (self-service, gratuita, 5000
   richieste/giorno). Copia la "Consumer Key".
2. **Google Geocoding** (fallback quando Ticketmaster non dà coordinate
   valide): stesso progetto Google Cloud del passo 2 (Maps) → abilita anche
   l'API **"Geocoding API"** → crea una **seconda** chiave API, dedicata
   (non riusare `GOOGLE_MAPS_API_KEY`: quella è ristretta a Maps SDK for
   Android e usata da Gradle, questa la chiama il backend). Consigliato:
   restrizione "Geocoding API" soltanto.
3. In `backend/.env` (creato al passo 1): imposta `TICKETMASTER_API_KEY` e
   `GOOGLE_GEOCODING_API_KEY` con i valori ottenuti.
4. Avvio manuale (nessuno scheduler automatico, per scelta — vedi
   CLAUDE.md):
    ```sh
    cd backend
    node scripts/importaTicketmaster.js
    ```
    Dopo una modifica al codice del backend serve `docker compose up -d
--build` (l'immagine copia `src/` al build, non c'è un bind mount).

Gli eventi importati non compaiono subito: la maggior parte si pubblica in
automatico, alcuni finiscono in una coda di revisione (coordinate mancanti,
possibile doppione, lineup non confermato, o semplicemente perché è il
primo abbinamento trovato per quell'artista) visibile solo a un utente
ADMIN, in Profilo → "Coda eventi Ticketmaster" (`admin@waveset.test`, vedi
sotto). **Limite noto**: la ricerca è per nome artista, non esiste una
lista di festival a sé — un festival senza nessun artista del catalogo in
lineup non verrà trovato.

### 6. Anteprime ADMIN Spotify e Deezer (facoltative)

Due schermate di sola lettura, riservate a un utente ADMIN, in Profilo →
"Anteprima Spotify" / "Anteprima Deezer": mostrano dati reali di un
artista/album fissi (Carl Cox — "Electronic Generations") per dimostrare
l'integrazione con questi due servizi. **Nessuna delle due scrive nel
database, importa dati nel catalogo o sostituisce/estende il seed
dimostrativo** — sono dimostrazioni a sé, indipendenti dal catalogo che vedi
sfogliando l'app.

- **Spotify — facoltativa, richiede credenziali locali**. Client Credentials
  Flow (Spotify for Developers, app in **Development Mode**: richiede che
  l'account proprietario dell'app abbia un abbonamento **Premium** attivo).
  In `backend/.env`: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`. **Senza
  queste chiavi l'anteprima risponde in modo controllato (schermata "non
  disponibile"), il resto del progetto — catalogo, playlist, eventi, coda
  Ticketmaster, anteprima Deezer — funziona comunque, invariato.**
- **Deezer — chiamate dal vivo, senza bisogno delle chiavi Spotify**. L'API
  pubblica di Deezer (ricerca, artista, album, tracklist) non richiede
  nessuna chiave né registrazione: nessuna variabile d'ambiente da
  configurare per questa.

In entrambe, ogni dato mostrato (nome, immagine, copertina, brani) viene
letto dal vivo dal servizio esterno ad ogni apertura della schermata, non
da una copia salvata: chiudere l'app o riavviare il backend non lascia
nessuna traccia di questi dati nel database.

## Credenziali di prova

Non c'è registrazione: gli utenti sono creati dal seed
(`backend/db/init/04_playlist_seed.sql`).

| Email                | Password        | Ruolo | Dati                                                                                        |
| -------------------- | --------------- | ----- | ------------------------------------------------------------------------------------------- |
| `alice@waveset.test` | `alice-waveset` | USER  | 2 playlist, segue Nova Circuit e Lucent Wave                                                |
| `bob@waveset.test`   | `bob-waveset`   | USER  | 1 playlist, non segue nessuno                                                               |
| `admin@waveset.test` | `admin-waveset` | ADMIN | nessuna playlist; vede la Coda eventi Ticketmaster e le Anteprime Spotify/Deezer in Profilo |

Il seed contiene anche `test-a@waveset.test`, `test-b@waveset.test` e
`test-admin@waveset.test`, riservati ai test automatici del backend: non
usarli per le prove a mano.

Il catalogo è consultabile senza login; Playlist e Profilo richiedono
l'accesso.

**Una sessione per dispositivo**: accedere con un secondo utente sullo stesso
telefono chiude la sessione del primo. Per provare Alice e Bob in parallelo
servono due dispositivi (o un telefono e un emulatore), ciascuno con il
proprio `adb reverse`.

## Test del backend

Test di integrazione (runner integrato di Node, nessuna dipendenza in più):
chiamano le API vere e, per alcuni controlli, leggono direttamente MySQL sulla
porta 3306 esposta da Docker.

```sh
cd backend
npm install      # solo la prima volta: installa le dipendenze in locale
npm test         # con i container del passo 1 attivi
```

Coprono login, middleware di autenticazione, scadenza e revoca delle
sessioni, follow, feed Novità, ricerca, eventi (incluso che un evento in
coda non sia mai visibile pubblicamente), l'isolamento tra due utenti reali
(un utente non può vedere né modificare le playlist o i follow dell'altro),
l'import Ticketmaster (servizi esterni sostituiti con mock, nessuna chiave
richiesta per lanciare i test), gli endpoint della coda ADMIN e le due
anteprime Spotify/Deezer (anche qui i servizi esterni sono mockati: nessuna
chiave né chiamata di rete vera richiesta per lanciare i test, nemmeno per
Spotify). Usano solo gli utenti `test-a`/`test-b`/`test-admin` (mai Alice,
Bob o Admin, quindi non chiudono le sessioni delle prove a mano), creano
dati temporanei e li cancellano alla fine. I file di test girano in
sequenza, perché condividono lo stesso database.
