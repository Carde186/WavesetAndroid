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
   - libreria di componenti CSS (NativeWind) o stile CSS decente
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

Per l'ordine delle scadenze, il backend nasce per primo qui in
`WavesetAndroid` (non nel monorepo `waveset`, che ancora non esiste). Quando
si aprirà `waveset` per il progetto Fullstack, il codice backend verrà
portato lì e da quel momento sarà quella la versione di riferimento, incluso
il proprio `docker-compose.yml`.

## Stack tecnologico
- **Web**: React
- **Mobile**: React Native (NativeWind — Tailwind per React Native — al posto
  di React Native Paper: nessuno stile "Material" imposto, design tokens
  propri, vedi "Identità visiva" sotto)
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
- **Autenticazione**: sessioni lato server su tabella MySQL (non JWT — vedi
  sezione dedicata "Autenticazione")

## Identità visiva

Decisa dopo aver visto le prime schermate con React Native Paper (stile
Material di default, non convincente). Sostituito con NativeWind e questi
design token — nessun valore va inventato o "avvicinato", sono questi
esatti:

| Token | Valore | Uso |
|---|---|---|
| Sfondo | `#0B0B0F` | sfondo principale delle schermate |
| Superficie | `#16161D` | card, righe, elementi rilevati dallo sfondo |
| Accento primario | `#8B5CF6` | tab attiva, link, icone |
| Accento scuro | `#7C3AED` | sfondo bottone primario, pillola selezionata — introdotto perché `#8B5CF6` come sfondo con testo sopra non raggiunge 4.5:1 (contrasto WCAG AA per testo piccolo); `#8B5CF6` resta corretto per tab/link/icone perché lì non è sfondo di testo |
| Testo primario | `#F5F5F7` | titoli, testo principale |
| Testo secondario | `#9CA3AF` | metadati (durata, data, sottotitoli) |
| Bordi/divisori | `#2A2A33` | separatori, contorni card |
| Raggio card | `8px` | |
| Raggio bottoni | `12–14px` | |

Un solo accento cromatico (viola), niente colore diverso per genere o
categoria — resta monocromatico (viola + scale di grigio), coerente con un
aspetto da player musicale curato invece che decorativo. Niente ombre/
elevazioni in stile Material: profondità data da bordi sottili 1px e dal
contrasto superficie/sfondo, non da drop-shadow (rendono male su sfondo
scuro).

Icone: **Lucide** (SVG via `react-native-svg`), non più Material Design
Icons. Decisione presa durante la migrazione, non solo per coerenza visiva:
le icone a font (Text+fontFamily) sono risultate incompatibili con la
pipeline di stile di NativeWind (`react-native-css-interop` sovrascrive il
`fontFamily` impostato via `style` su qualunque `Text`, incluso quello
interno alle vector-icons) — Lucide, essendo SVG e non Text-based, evita
strutturalmente il problema.

### Logo — blob + wordmark

Ispirato a un riferimento video (blob organico animato, sfondo nero,
wordmark sovrapposto) ma **non incorporato come file video** — ricostruito
nativamente con `react-native-reanimated` + `react-native-svg` (già nel
progetto, nessuna dipendenza nuova tipo `react-native-video`).

Palette del blob — gradiente entro la famiglia viola/magenta, NON i colori
multi-tonalità (arancione/blu/rosa) del riferimento originale, per restare
coerente con l'accento unico dell'app:
- `#4408e7` — tono di base/ombra (il più scuro, poca luminosità su sfondo
  quasi nero: usarlo in profondità nel gradiente, non come punto più acceso)
- `#6a34ea` — tono intermedio, molto vicino all'accento primario `#8B5CF6`
  già in uso nel resto dell'app
- `#ad04fb` — punto più vivido/chiaro del gradiente
- `#8c008f` — accento profondo, uso sfumato

Animazione: **morphing organico del contorno** (come nel video di
riferimento), non solo scala/opacità — su **entrambe** le versioni (header
e intro), non solo sull'intro. Forma con **lobi/punte pronunciati**, non
un'ovale che respira appena, ma **senza risolversi in una forma geometrica
riconoscibile** (triangolo, esagono, stella regolare) — questo richiede
raggio indipendente per ciascun punto (niente pattern che si ripete tra un
punto e l'altro, es. corto-lungo-corto-lungo) E una piccola variazione
anche nell'angolo di ciascun punto (non perfettamente equidistanti): è la
combinazione delle due a rompere la simmetria, una sola delle due non
basta. Resta su curve (Bezier via Catmull-Rom), niente vertici/segmenti
dritti veri, quella è un'altra direzione (poligonale) scartata.

Durata: **minimo 8 secondi** per un ciclo completo prima di ricominciare.
Il ritorno alla forma di partenza a fine ciclo deve essere fluido, mai uno
scatto — la forma di partenza (A) deve essere un valore fisso e identico
a ogni ciclo (non rigenerato/ricalcolato ogni volta: se A cambia
leggermente da un ciclo all'altro, il punto di chiusura non combacia con
quello di partenza del ciclo successivo ed è quello a produrre lo scatto).

Tecnica: più forme-chiave con la stessa topologia del `<Path>`,
interpolazione animata tra le chiavi in loop continuo. Nessuna dipendenza
nuova.

**Wordmark**: "Waveset" va **sovrapposto** al blob, non impilato sopra nel
layout — stesso centro X/Y del blob, posizionamento assoluto, il testo in
un layer/z-index sopra la forma (come un titolo scritto su un'immagine di
sfondo, non un elemento che sta "prima" del blob nell'ordine verticale).

**Un solo componente**, riusato in due contesti, dimensioni diverse ma
**stesso comportamento di animazione** (morphing) su entrambe:
1. Top bar — versione piccola ma leggibile (non minuscola: deve reggere il
   confronto visivo con le icone della tab bar sotto), sostituisce il testo
   semplice "Waveset"
2. Schermata di intro — versione grande, mostrata dopo il caricamento
   dell'app e prima della Home (schermata React vera e propria, NON lo
   splash screen nativo del sistema operativo, che deve restare
   un'immagine statica — vincolo di piattaforma, non aggirabile)




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
- Dipendenze sempre all'ultima versione stabile disponibile al momento
  dell'installazione — non fissare versioni più vecchie senza un motivo
  esplicito. Ma le versioni già installate NON vanno aggiornate in blocco
  "tanto per aggiornare": un audit fatto una libreria alla volta (build +
  test dopo ciascuna, non un bump massivo tutto insieme) evita di rompere
  qualcosa che oggi funziona — vale soprattutto per le librerie con codice
  nativo (Reanimated, react-native-svg), dove un salto di versione major
  può richiedere una migrazione vera, non solo un aggiornamento di numero.

## Modello dati

Entità di base: **User**, **UserProfile** (1:1 con User), **Artist**,
**Song** (N:1 con Artist), **Event**, **Playlist** (N:1 con User, N:N con
Song), **Review**.

Modifiche rispetto allo spec iniziale, decise durante la progettazione:

| Entità/relazione | Decisione v1 |
|---|---|
| **Genere** | Nuova entità, N:N con Artist. Song NON ha un genere proprio — lo eredita filtrando tramite l'artista. |
| **Artist** | Aggiunto `immagine_url` — mai definito esplicitamente finora. Verrà popolato dal seed del catalogo reale quando fonte e strategia saranno decise (vedi "Integrazioni esterne" — non ancora Spotify con certezza); finché quella decisione non c'è, usare un URL placeholder stabile nel seed temporaneo, non lasciare il campo vuoto. |
| **PlaylistSong** | Join esplicito Playlist↔Song con campo `aggiunto_il` (timestamp). Ordine = cronologico. Niente campo `posizione`/riordino manuale in v1. |
| **Review** | Aggiunto vincolo di unicità (user_id, song_id). Serve supporto per la modifica, non solo la creazione. |
| **Album** (nuova) | `titolo`, `data_pubblicazione`, `artista_id` (N:1 Artist), `copertina_url` (da `album.images[0].url` su Spotify — anche i singoli su Spotify hanno un "album" wrapper con copertina, quindi il campo è quasi sempre popolabile). `Song.album_id` nullable — un brano può non appartenere a nessun album. `Song.data_pubblicazione` è un campo a sé, indipendente da quella dell'album. |
| **Song — immagine** | Nessun campo immagine proprio: eredita `copertina_url` dal suo Album quando esiste; se `album_id` è nullo (brano inserito a mano senza album), fallback sull'`immagine_url` dell'Artist lato frontend — non duplicare il dato nel DB. |
| **AlbumReview** (nuova) | Gemella di Review ma per Album (stessa struttura, stesso vincolo di unicità). Entità separata per non modificare Review, già scritta e testata nel backend Spring. |
| **Event** | Aggiunti `latitudine`/`longitudine` (numerici). Inseriti a mano dall'ADMIN per gli eventi non importati da Ticketmaster — vedi sezione Ticketmaster più sotto per l'automazione. Aggiunto anche `ora_evento` (TIME, nullable) separato da `data_evento` (DATE) — mai convertito da/a UTC, è sempre "l'ora locale del locale", non va interpretato rispetto al fuso del device che la visualizza. Aggiunti `fonte` (manuale/ticketmaster), `id_esterno`, `stato` (pubblicato/in_coda/scartato) e `motivo_revisione` per la coda di revisione ibrida — vedi "Integrazioni esterne". |
| **Artist** (2) | Aggiunto `id_ticketmaster`, impostato SOLO da una conferma esplicita dell'ADMIN (mai in automatico, nemmeno approvando un evento) — vedi "Integrazioni esterne". |
| **EventArtist (lineup)** (2) | Aggiunto `id_attraction_ticketmaster`, il candidato trovato dall'import in attesa di conferma; NULL per il lineup inserito a mano. |
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
   coda per revisione manuale (`stato = 'in_coda'`, `motivo_revisione` uno o
   più tra questi, uniti con `; `) SOLO quelli che falliscono una regola:
   - `coordinate_irrecuperabili`: 0.000000 *e* geocodifica di fallback fallita
   - `nessuna_attraction_riconosciuta`: nessuna attraction dell'evento, di
     nessun subType, combacia (nome esatto, case-insensitive, trim) con un
     artista del catalogo — **non si filtra più per `subType.name ===
     "Artist"`**: un test con un artista reale (Carl Cox) ha mostrato che
     Ticketmaster lo classifica `"Undefined"`, non `"Artist"` — quel filtro
     escludeva l'headliner stesso, non solo i nomi di festival che doveva
     escludere. Il subType non è quindi un segnale affidabile in nessuna
     delle due direzioni e non è più usato per decidere il matching in
     automatico: l'unica protezione resta l'uguaglianza esatta del nome più
     la conferma umana (vedi `id_artista_da_confermare` sotto) — un nome
     combinato tipo "Carl Cox & Eric Powell" non combacia con "Carl Cox" per
     questo stesso motivo (uguaglianza sull'intera stringa, mai una
     sottostringa)
   - `lineup_non_confermato`: almeno un'attraction combacia con un ALTRO
     artista del catalogo, ma nessuna combacia con l'artista che ha avviato
     la ricerca
   - `id_artista_da_confermare`: prima ricerca per nome per questo artista
     (nessun `id_ticketmaster` ancora confermato) — va in coda ANCHE se tutto
     il resto è pulito, apposta per una conferma umana prima di fidarsi
     dell'attraction per le ricerche successive (mitiga il rischio di
     omonimi: da quel momento si cerca per `attractionId`, non più per nome)
   - `possibile_doppione`: un altro evento (qualunque fonte/stato) con
     almeno un artista in comune, stessa data, stesso luogo, `id_esterno`
     diverso — non si scarta mai in automatico, resta una decisione ADMIN

   Schermate ADMIN dedicate (Android, dentro Profilo, protette anche lato
   backend con `richiediRuolo('ADMIN')`, non solo nascoste in UI): **Coda
   eventi Ticketmaster** (elenco, con motivo) e **Dettaglio evento in
   coda** (correggere i campi, confermare un collegamento artista↔attraction
   riga per riga, approvare o scartare). Approvare un evento NON conferma da
   solo nessun collegamento artista↔attraction: sono due azioni separate,
   apposta perché un evento può avere più artisti in lineup e l'ADMIN deve
   poter confermare ciascun collegamento singolarmente.

   Import: script manuale (`backend/scripts/importaTicketmaster.js`),
   nessuno scheduler interno al backend — scelta indipendente da quella,
   ancora aperta, per un eventuale import del catalogo reale (una tantum o
   continuo: non deciso, vedi "Integrazioni esterne"). Un `id_esterno` già
   presente in `evento` non viene MAI ritoccato da un import successivo,
   qualunque sia il suo stato: così un import ripetuto non annulla mai una
   correzione, un'approvazione o uno scarto già decisi dall'ADMIN.
4. **Correzione dati importati nel catalogo reale**, quando quell'import
   esisterà (es. genere sbagliato, bio incompleta) — **requisito futuro,
   non ancora implementato**: non presume che la fonte sarà Spotify né che
   l'import sarà una tantum, entrambe cose ancora da decidere (vedi
   "Integrazioni esterne").

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
- **Coda eventi Ticketmaster** (solo ADMIN, link da Profilo): elenco degli
  eventi importati in coda di revisione, con il motivo
- **Dettaglio evento in coda** (solo ADMIN): correzione campi, conferma di
  un collegamento artista↔attraction, approva/scarta — vedi "Cosa fa
  davvero l'ADMIN"
- **Anteprima Spotify** (solo ADMIN, link da Profilo): demo di sola lettura,
  artista/album fissi — vedi "Integrazioni esterne"
- **Anteprima Deezer** (solo ADMIN, link da Profilo): demo separata da
  quella Spotify, stesso principio — vedi "Integrazioni esterne"

## Autenticazione

**Niente JWT.** Sessioni lato server, stesso modello di Django (revoca
istantanea, stato vero sul server), ma trasportate come bearer token
nell'header `Authorization` invece che come cookie — React Native non ha
la gestione automatica dei cookie di un browser, quindi il token va
salvato in storage sicuro sul device e allegato a mano a ogni richiesta.

**Tabella `sessioni`**: `utente_id`, `hash_token` (MAI il token in chiaro),
`scadenza`, `device_id`.

- **Generazione token**: casuale (`crypto.randomBytes`), consegnato al
  client una sola volta al login — da quel momento esiste solo come hash
  nel DB.
- **Hash**: SHA-256 (veloce), NON bcrypt. Bcrypt è lento apposta per
  proteggere segreti a bassa entropia come le password; un token casuale a
  256 bit non ne ha bisogno, e bcrypt costerebbe 250-300ms in più su OGNI
  richiesta autenticata, non solo al login. Bcrypt resta riservato alle
  password.
- **Confronto**: `crypto.timingSafeEqual` sull'hash calcolato, non `===`.
- **`device_id`**: UUID generato dal client al primo avvio dell'app,
  salvato in storage sicuro sul device, inviato come header a ogni
  richiesta — identifica "questo telefono" per permettere il logout
  mirato.
- **Logout**: elimina la riga della sessione corrente. Endpoint aggiuntivo
  "esci da tutti i dispositivi": elimina tutte le righe per `utente_id`.

Test di isolamento tra due utenti reali sulle playlist (non solo verifica
del login) resta un requisito esplicito di questo step.

## Ricerca
Va costruita per davvero: schermata con risultati live (debounce ~300ms),
raggruppati in sezioni Artisti/Brani. **Prima verificare** se il backend
Spring esistente ha già un endpoint di ricerca con match parziale
(`LIKE`/`ILIKE`, non match esatto) — se sì, si riusa lo stesso comportamento
nel nuovo backend Node; se no, va scritto ex novo.

## Integrazioni esterne

**Fonte e strategia per il catalogo reale — non ancora decise.** Non è
deciso se si userà Spotify, Deezer, entrambi o nessuno dei due; non è
deciso se un eventuale import sarà una tantum o continuo; non è deciso come
sarà consentita/gestita la conservazione dei dati importati (attribuzione,
persistenza, limiti di ciascun servizio). **Finché questa decisione non
viene presa, il catalogo resta quello dimostrativo** (`backend/db/init/02_seed.sql`,
con i suoi placeholder) — nessuna modifica al seed è stata fatta in questa
esplorazione.

Sono state esplorate due integrazioni musicali, entrambe **live e di sola
lettura**, come anteprime **ADMIN** separate dal catalogo — non un seed, mai
scritte nel database:

**Spotify** — Client Credentials Flow (`/search`, `/tracks/{id}`,
`/artists/{id}`, `/albums/{id}`); se diventasse la fonte scelta, il bottone
"Ascolta su Spotify" resterebbe comunque un semplice link esterno
(`external_urls.spotify` da ogni Track), **niente OAuth, niente player
integrato, niente preview audio** (rimosse dall'API Spotify da novembre 2024,
permanente), **niente sync playlist**.

Esiste `backend/src/servizi/spotify.js` (Client Credentials, lookup
artista/album/brani, cache del token in memoria con margine di sicurezza) e
un endpoint **ADMIN di sola lettura**, `GET /api/admin/spotify/anteprima`,
che mostra dati reali (artista fisso "Carl Cox", 5 release, i brani di
"Electronic Generations") **senza scriverli mai nel database**: è una
dimostrazione/verifica, non collegata al catalogo o al seed dimostrativo.
Protetto sia da `richiediAutenticazione`+`richiediRuolo('ADMIN')` lato
backend sia dalla visibilità condizionata in Profilo — la protezione vera è
quella del backend, la voce in UI è solo un secondo filtro. Senza
`SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` risponde `503` in modo
controllato, il resto dell'app resta invariato. Verificato con dati reali
che `genres` è vuoto/assente (campo deprecato da Spotify) e che `/search`
restituisce corrispondenze larghe, non solo il nome esatto — entrambi da
tenere in conto **se e quando** si deciderà la fonte del seed vero.

**Logo Spotify** (`src/assets/spotify/Spotify_Full_Logo_RGB_{Black,White}.png`,
`src/componenti/LogoSpotify.tsx`): asset ufficiale scaricato invariato dal
media kit (`developer.spotify.com`, sezione "Using our logo"), mai
ridisegnato — versione nera o bianca scelta in base al tema chiaro/scuro
dell'app (Branding Guidelines: nero su sfondo chiaro, bianco su sfondo
scuro; mai la versione verde su uno sfondo che non sia nero o bianco puro).
Provato sul telefono, in entrambi i temi: leggibile e contrastato. Restano
due punti verificati solo per lettura del codice, non da un diagramma
ufficiale: l'altezza minima (70px, le linee guida non specificano se sia
l'altezza o un altro lato) e lo spazio di rispetto (metà dell'altezza
dell'icona — qui approssimato a metà dell'altezza del logo intero).

**Deezer** — seconda anteprima ADMIN di sola lettura, **schermata separata**
da quella Spotify (`GET /api/admin/deezer/anteprima`, artista Carl Cox id
Deezer `3951`, album "Electronic Generations" id `905333022`, fissi lato
server). Diversa da Spotify su un punto tecnico non banale: l'API pubblica
di Deezer non richiede token/credenziali (verificato con una sonda reale),
ma spesso risponde HTTP 200 con un corpo `{"error": {...}}` invece di uno
status non-2xx — `backend/src/servizi/deezer.js` controlla entrambi i casi.
L'artista è trattato come dato essenziale (se fallisce, 502 sull'intera
risposta); album e brani come dati che possono mancare (se falliscono, la
risposta resta 200 con `album: null, brani: []`, l'artista si vede
comunque). Mai il campo `preview` di Deezer (URL firmato dell'anteprima
audio) nella risposta. Nessuna cache applicativa, nessuna persistenza.
Logo (`src/assets/deezer/Logo-Horizontal-{Light,Dark}.png`,
`src/componenti/LogoDeezer.tsx`): asset ufficiali forniti già scaricati
(non ricercati né ridisegnati in questa sessione) — versione con scritta
bianca per il tema scuro, nera per il tema chiaro. Provato sul telefono,
funziona (percorso normale). Gestione separata di dato assente/guasto
(album/brani non trovati per davvero vs errore di rete o quota) verificata
solo con test automatici mockati, non a mano.

**Google Maps** — Maps JavaScript API (web) / `react-native-maps` (mobile),
marker personalizzati con logo artista. Usata per intero, senza versioni
semplificate, sia su Fullstack che su Android. Chiave API già ottenuta
(account Google Cloud con fatturazione attiva; free tier: 10.000
caricamenti mappa/mese, ampiamente sufficiente).

**Ticketmaster Discovery API** — unica fonte automatica per l'import eventi
(niente Bandsintown, richiede partnership commerciale; niente TicketOne,
nessuna API pubblica trovata). Credenziali già ottenute (self-service,
gratuita; piano gratuito: 5000 richieste/giorno, 5/secondo — l'import
mette 250ms di pausa tra un artista e l'altro, ampiamente sotto soglia).
Implementata in `backend/src/ticketmaster/importa.js`
(`backend/scripts/importaTicketmaster.js` è solo il punto d'ingresso da
terminale). Regole (v1, confermate):
- Query **per nome artista**, mai per genere (il filtro genere perde sia i
  festival grandi, classificati sotto "Miscellaneous", sia gran parte della
  scena underground italiana). Si itera sugli artisti del catalogo, non su
  una lista di festival a sé (non esiste un'entità Festival nel modello
  dati) — un festival con un nostro artista in lineup emerge comunque dalla
  ricerca per quell'artista, **ma senza garanzia di trovarli tutti**: un
  festival senza nessun nostro artista in cartellone (o con lineup non
  ancora annunciato al momento dell'import) non verrebbe trovato. Limite
  noto, da rivedere se serve una copertura più ampia.
- Prima ricerca per un artista: per nome (`keyword`). Dopo che l'ADMIN ha
  confermato esplicitamente un collegamento (vedi sotto), le ricerche
  successive per quell'artista usano `attractionId` — preciso, elimina il
  rischio di omonimi per tutti gli import successivi al primo.
- Un'attraction entra nel lineup SOLO con un nome esattamente identico
  (case-insensitive, trim) a un artista del catalogo, **su qualunque
  subType** — nessun match parziale o fuzzy: rischierebbe di aggiungere un
  omonimo, o un nome combinato ("Carl Cox & Eric Powell") come se fosse un
  solo artista. Il filtro `classifications[0].subType.name === "Artist"`
  previsto inizialmente è stato rimosso dopo un test con un artista reale:
  Ticketmaster classifica un headliner reale come `"Undefined"`, non
  `"Artist"` (verificato, non un'ipotesi) — quel filtro escludeva
  sistematicamente gli artisti veri, non solo i nomi di festival per cui era
  stato pensato. Il subType non è quindi affidabile in nessuna delle due
  direzioni: non è più usato per il matching automatico, l'unica protezione
  resta l'uguaglianza esatta del nome più la conferma umana obbligatoria
  (`id_artista_da_confermare` sotto).
- `id_ticketmaster` sull'artista si imposta SOLO con un'azione ADMIN
  esplicita ("Conferma collegamento", per singolo artista) — mai in
  automatico, nemmeno approvando l'intero evento. Il primo abbinamento per
  un artista va sempre in coda apposta per questa conferma (vedi "Cosa fa
  davvero l'ADMIN").
- Coordinate: usa `location.latitude`/`longitude` se diverse da
  `"0.000000"`; altrimenti fallback su **Google Geocoding API**, stesso
  progetto Google Cloud già usato per Maps ma con una **chiave separata**
  (`GOOGLE_GEOCODING_API_KEY`, ristretta alla sola Geocoding API — non la
  stessa `GOOGLE_MAPS_API_KEY` usata da Gradle) — se anche la geocodifica
  fallisce, l'evento resta con lat/lon `NULL` e va in coda.
- Un evento senza coordinate non può essere approvato (400 lato backend):
  la mappa (schermata Eventi) richiede lat/lon per il marker — l'ADMIN deve
  prima correggerle
- Pubblicazione automatica salvo i casi da mettere in coda — vedi "Cosa fa
  davvero l'ADMIN" sopra
- Un `id_esterno` (l'id evento Ticketmaster) già presente non viene mai
  ritoccato da un import successivo, qualunque sia il suo stato — uno scarto
  è un soft delete (`stato = 'scartato'`, riga non cancellata), apposta per
  questo

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
  Un commit per lavoro logico — se in una sessione hai completato più cose
  distinte (es. un fix + una migrazione di stile + una feature), proponi
  commit separati, anche se nessuno dei due è stato ancora eseguito. Non
  accumulare più step in un commit solo per comodità.

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
- [x] Schermate di catalogo (Home, Dettaglio artista/brano/album)
- [x] Playlist (multiple per utente, non una sola di default)
- [x] Migrazione stile: React Native Paper → NativeWind + identità visiva
      (vedi sezione dedicata) — completata su Home, header, tab bar
- [x] Logo blob+wordmark (componente unico, top bar + schermata di intro)
- [x] Autenticazione (sessioni lato server su tabella MySQL, ruoli
      USER/ADMIN — vedi sezione dedicata "Autenticazione"; test di
      isolamento tra due utenti reali verificati, sia automatici che a mano)
- [x] Ricerca
- [x] Eventi + mappa (Google Maps, marker, Dettaglio evento; tipo di mappa
      Standard/Scura/Satellite/Ibrida con preferenza salvata sul dispositivo
      e avatar utente nella top bar — verificati a mano: menu e quattro
      tipi, Standard chiara, persistenza dopo riavvio e logout, avatar nei
      vari stack e durante la ricerca)
- [x] Integrazione Ticketmaster (import + coda di revisione) — schema,
      import, endpoint ADMIN e schermate Android; regola di matching
      corretta dopo un test con un artista reale (Carl Cox): il subType di
      Ticketmaster non è affidabile, si combacia solo per nome esatto (vedi
      "Integrazioni esterne"). Dati di prova (artista temporaneo, 9 eventi)
      ricalcolati e poi rimossi con pulizia verificata in transazione,
      nessun residuo nel seed. Verificato a mano sul telefono: coda,
      correzione, conferma collegamento, approva, scarta
- [ ] Assistente AI per la coda di revisione (solo Fullstack)
- [ ] Bottone Spotify + seed catalogo via Spotify Client Credentials —
      **il seed vero non è ancora iniziato**. Esistono invece due anteprime
      ADMIN di sola lettura, indipendenti dal catalogo/seed, scritte e
      verificate a mano sul telefono: **Anteprima Spotify**
      (`GET /api/admin/spotify/anteprima`, richiede
      `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` — senza, risponde 503 in
      modo controllato, il resto dell'app resta invariato) e **Anteprima
      Deezer** (`GET /api/admin/deezer/anteprima`, API pubblica, nessuna
      chiave) — vedi "Integrazioni esterne"
- [ ] Impostazioni (tema chiaro/scuro + sezione Account)
- [ ] Recensioni brani/album (solo Fullstack)
- [ ] Localizzazione IT/EN (solo Fullstack, solo se avanza tempo)
- [ ] README (+ README_REACT_NATIVE.md su Android)
