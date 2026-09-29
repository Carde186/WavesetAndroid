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
| **Artist** (3) | Aggiunti `immagine_autore`, `immagine_licenza`, `immagine_fonte_url`, `immagine_modificata` (`backend/db/init/11_credito_immagine_schema.sql`) — credito per una foto a licenza libera (Wikimedia Commons). NULL/false per il seed dimostrativo (placeholder senza licenza da citare); popolati solo per le foto reali verificate — vedi "Catalogo reale" sotto "Integrazioni esterne". Il frontend mostra il credito (`CreditoFoto.tsx`, solo in Dettaglio artista) solo quando `immagine_autore` non è NULL. |
| **Song** (2) | Aggiunto `collaboratori` (VARCHAR nullable, `backend/db/init/12_collaboratori_brano_schema.sql`, **proposta scritta, migrazione non ancora eseguita**) — testo libero per un artista accreditato ma assente dal titolo ufficiale (es. "In the Name of Love" di Martin Garrix, feat. Bebe Rexha solo nel campo artista di Apple/Spotify). Mai una relazione N:N: `Song.artista_id` resta l'unico titolare (N:1, invariato) — il collaboratore non ha una propria pagina/follow/discografia. Popolata SOLO se il nome non compare già nel titolo (altrimenti resta NULL — mai un doppione con un "(feat. ...)" già nel titolo). Scrittura riservata a uno script a sé (`backend/scripts/popolaCollaboratoriBrani.js`, stesso principio "mai un UPDATE automatico" di `correggiLotto1.js`), mai un effetto collaterale dell'import principale. Frontend: riga aggiuntiva non tappabile "Con {collaboratori}" in `IntestazioneDettaglio` (solo Dettaglio brano), con lo stesso controllo anti-duplicazione lato client. |

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
  nessuno, o per utenti anonimi); in fondo, solo per chi ha fatto accesso,
  "In evidenza su Deezer" (artista/album fissi, sola lettura, live — vedi
  "Integrazioni esterne"); da anonimo, al suo posto un invito ad accedere
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

**Catalogo reale — curato a mano, non importato da Spotify/Deezer.** Decisione
presa dopo aver verificato i Termini ufficiali di entrambi (storage/caching
delle immagini vietato o non chiarito, vedi commit precedenti): niente
import di massa, niente immagini Spotify/Deezer nel catalogo. Fonte scelta
per identità/discografia: **MusicBrainz** (dati aperti, licenza CC0),
verificata voce per voce (MBID, non il primo risultato per nome — rischio
omonimi reale: sia "Carl Cox" sia "Paul Kalkbrenner" hanno un secondo
artista omonimo su MusicBrainz). Fonte per le foto artista:
**Wikimedia Commons**, solo file con licenza libera verificata
singolarmente (pagina del file, autore, licenza, soggetto — mai un'immagine
presa da una ricerca senza controllare la licenza). Copertine album: se
nessuna ha una licenza libera verificata (caso frequente: l'artwork
commerciale ufficiale quasi mai lo è, e la Cover Art Archive di MusicBrainz
non è usata per questo motivo), `copertina_url` resta NULL — fallback già
gestito da `Immagine.tsx` (icona nota musicale), nessun codice nuovo
necessario.

**Primo lotto (Carl Cox, Charlotte de Witte)** — script idempotente
`backend/scripts/importaCatalogoRealeLotto1.js` (anteprima di default,
`--applica` per scrivere; stesso pattern di
`ricalcolaLineupEventiEsistenti.js`): cerca ogni artista per nome prima di
inserire, non tocca mai una riga già presente, sicuro sia su un DB nuovo sia
su uno già avviato, mai un `UPDATE`. Richiede prima lo schema di
`backend/db/init/11_credito_immagine_schema.sql` (colonne di credito foto
su `artista`, vedi "Modello dati"). **Applicato** al database in uso (Carl
Cox e Charlotte de Witte presenti, id assegnati dall'auto-increment — mai
dati per scontati altrove, sempre cercati per nome). Per ogni traccia di un
album si è verificato l'artist-credit singolo, non dedotto dall'album: la
release omonima di Charlotte de Witte include anche brani con featuring
(XSALT, Comma Dee, Lisa Gerrard, Alice Evermore) — esclusi, lo schema
Brano→Artista è N:1 e un featuring non ci entra senza travisare la
paternità.

**Featuring nascosto su 2 brani Carl Cox, trovato solo incrociando le
fonti** — "Short Black" e "We Rob Together" erano stati importati come
"solo Carl Cox": corretto controllando anche il singolo `recording`
MusicBrainz (non solo la tracklist della release), che per queste due
tracce **non ha mai avuto il featuring registrato** — non un errore di
lettura, un dato genuinamente meno completo di MusicBrainz rispetto ai
metadati ufficiali usati da Apple ("feat. Juanita Timpanaro" / "feat. The
Digital Primate" nel titolo) e Spotify (stesso featuring nell'array
`artists`). Lezione: MusicBrainz da solo non basta nemmeno quando sembra
concludente, va sempre incrociato con almeno un'altra fonte prima di
escludere un featuring. Corretto con lo schema attuale (Brano→Artista
resta N:1): il featuring entra nel titolo, come fa Apple —
`"Short Black (feat. Juanita Timpanaro)"`,
`"We Rob Together (feat. The Digital Primate)"`. Correzione **coordinata**
in tre punti, per lo stesso motivo per cui `assicuraBrano` non fa mai un
`UPDATE` automatico su una riga già presente (rinominare senza coordinare
rischierebbe un duplicato al prossimo `--applica`):
1. `LOTTO` in `importaCatalogoRealeLotto1.js` porta già i titoli corretti,
   con `titoliPrecedenti: ['Short Black']` / `['We Rob Together']` —
   `assicuraBrano` cerca sia il titolo nuovo sia quelli precedenti, così
   riconosce la riga già presente indipendentemente dall'ordine in cui
   questo script e la correzione sotto vengono lanciati, senza mai
   duplicare.
2. `backend/scripts/correggiLotto1.js` (one-off, **separato** dall'import
   normale, stesso principio "mai un UPDATE automatico" per l'import ma
   qui è esattamente l'azione ADMIN a sé che quel principio rimanda):
   rinomina le 2 righe già presenti nel database in uso e popola
   `url_spotify` sui 6 brani reali (oggi tutti `NULL`) — non sovrascrive
   mai un `url_spotify` già presente. Anteprima di default, `--applica` per
   scrivere, verifica esplicita che il titolo nuovo non esista già prima di
   rinominare, ricontrollo a freddo immediatamente prima di ogni
   `UPDATE`. **Verificato in anteprima, non ancora applicato** — vedi
   "Stato di avanzamento".
3. `assicuraBrano` non aggiorna **mai** `url_spotify` su un brano già
   presente (stesso principio "mai un UPDATE" di `assicuraArtista`): lo
   popola solo sull'`INSERT` di un brano nuovo (DB nuovo/clonato). Per un
   DB già avviato, popolarlo sui brani già importati è compito esclusivo
   dello script di correzione sopra.

**Link Apple Music (traccia) e Spotify (album)** — offerti insieme dove
verificati, mai un link simulato: `backend/src/itunes/linkBrano.js` e
`backend/src/spotify/linkAlbum.js`, mappature **statiche** (nome artista +
titolo → link), mai una chiamata Apple/Spotify a runtime per "ritrovare" un
link già noto e verificato in precedenza — a differenza della copertina
Apple (`copertina.js`), che resta dal vivo perché l'immagine non è mai
salvata. Id di traccia Apple fissi (mai cercati per somiglianza del titolo
in una tracklist live: rischierebbe di abbinare il brano sbagliato).
Endpoint `GET /album/:id/link-spotify` e `GET /brani/:id/link-apple`,
entrambi scoped (solo id locali già esistenti, mai un id Apple/Spotify a
piacere del client) e con nomi di campo diversi apposta
(`link_store` vs `link_traccia`) per non poter confondere un link album con
un link brano nemmeno a livello di tipo. Componenti frontend
`AnteprimaLinkSpotifyAlbum`/`AnteprimaLinkAppleBrano` (Dettaglio
album/brano): se il backend non risponde con un link, non rendono nulla —
mai un badge isolato senza una destinazione verificata. Nelle righe di
tracklist (liste, non il Dettaglio dedicato) resta solo il bottone Spotify
già esistente: un badge Apple Music intero non entra in una riga da 48px,
niente da "simulare" riusando il link dell'album per una singola traccia.

**Pulizia url_spotify fittizi del seed dimostrativo** — i 4 brani demo con
`url_spotify` inventato (id `0000000000000000000001`..`004`, mai stati veri)
corretti a `NULL` in `02_seed.sql` (per un DB nuovo/clonato) e con
`backend/scripts/pulisciUrlSpotifyFittizioSeed.js` per il database in uso
(anteprima di default, mira solo a quei 4 valori esatti, nessun altro
`url_spotify` toccato). **Applicato** al database in uso (`npm test`:
121/121 all'epoca, verificato).

**Lotti 2-5 (Avicii, Alesso, Fred again.., ODESZA, Calvin Harris, David
Guetta, Martin Garrix, Kygo)** — stessi 10 artisti reali concordati (i due
del lotto 1 restano invariati), stesso principio di idempotenza, ma con tre
casi che il lotto 1 non aveva, gestiti da una nuova infrastruttura
condivisa `backend/scripts/catalogoRealeCondiviso.js` (il lotto 1 resta
com'è, non ne dipende):

- **Un artista con più di un album**: Kygo ("KYGO" 2024 e "Cloud Nine"
  2016) e David Guetta ("Just a Little More Love" 2002 e "Nothing But the
  Beat Ultimate" 2011) — voce lotto con `albums: [...]`, non più un
  singolo `album` come nel lotto 1.
- **Un brano senza album** (`album_id` NULL): i 2 singoli di Martin Garrix
  ("Animals", "Ocean (feat. Khalid)" — non ha, ad oggi, un album Spotify/
  Apple con brani a paternità singola o rappresentativa) e "Marea (we've
  lost dancing)" di Fred again.. — voce lotto con `singoli: [...]`. I link
  Apple/Spotify di questi brani dipendono solo dal brano stesso (chiave
  naturale artista+titolo in `linkBrano.js`, colonna `url_spotify` sul
  brano), mai da un album locale: la UI già gestiva questo caso
  (`{brano.album && (...)}` in `DettaglioBranoSchermata.tsx`), nessuna
  modifica frontend necessaria.
- **Creazione di un genere non ancora esistente**: "Elettronica"
  (approvato per Fred again.. e ODESZA — "House", l'unico genere
  elettronico già presente, li descrive solo per approssimazione; gli
  altri 6 artisti restano "House"). `assicuraGenereCreaSeMancante()` lo
  crea, se manca, **dentro la stessa transazione** del lotto che lo usa
  (lotto 3, Fred again..+ODESZA) — mai come genere vuoto inserito a sé:
  Home mostrerebbe una pillola "Esplora per genere" senza nessun artista
  finché il lotto non viene applicato per intero.

Caso particolare: l'album "Cloud Nine" di Kygo **non ha un prodotto Apple
corrispondente** (ricerca "Kygo Cloud Nine" sullo store IT: zero
risultati) — ha solo una voce in `spotify/linkAlbum.js` (link Spotify
all'album), nessuna in `itunes/copertina.js`: il Dettaglio album mostra
solo il pulsante Spotify. Il brano "Firestone", nel proprio Dettaglio
brano, mostra comunque entrambi i link (Apple al singolo — l'unico
prodotto Apple esistente per questo brano — e Spotify), perché
`linkBrano.js` non dipende dall'album.

Featuring reali mostrati nel titolo del brano solo dove **l'edizione Apple
lo usa davvero a livello di singolo brano** (mai inventato, e mai dedotto
dal solo array `artists` di Spotify, che spesso elenca un featuring senza
che il titolo lo dica): es. "Titanium (feat. Sia)" (entrambe le
piattaforme), "Heroes (we could be) (feat. Tove Lo)" e "Say My Name (feat.
Zyra)" e "Firestone (feat. Conrad Sewell)" (solo Apple, adottato comunque
— stessa asimmetria già vista per "Short Black" di Carl Cox). Scartato
invece "In the Name of Love" di Martin Garrix (feat. Bebe Rexha secondo
l'array artisti di entrambe le piattaforme, ma **nessuna delle due mette
mai "feat." nel titolo del brano**, nemmeno a livello di singolo brano) —
sostituito con "Ocean (feat. Khalid)", dove il "feat." è reale nel titolo
su entrambe le piattaforme.

**Scritto e testato** (`backend/scripts/importaCatalogoRealeLotto{2,3,4,5}.js`,
`backend/test/catalogoRealeCondiviso.test.js`,
`backend/test/linkEsterniLotti2345.test.js` — intera suite backend 181/181),
**non ancora applicato al database in uso**: anteprima di ciascun lotto
mostrata e confermata riga per riga prima di ogni `--applica`, come per il
lotto 1.

Due proprietà di sicurezza verificate con test dedicati
(`backend/test/catalogoRealeLotto1.test.js`), non solo assunte: (1) nessuna
delle tabelle coinvolte ha un vincolo UNIQUE sulla chiave naturale (nome
artista; titolo+artista per album/brano — vedi `01_schema.sql`), quindi se
la stessa chiave combacia con più righe lo script **si ferma con un
errore**, non ne sceglie una arbitrariamente; (2) `applicaLotto` apre e
chiude la propria transazione (non il chiamante): un errore a metà annulla
tutto il lotto già scritto in quella chiamata, non solo la voce fallita —
e un crash del processo lascia comunque il database invariato (rollback
automatico di MySQL sulla connessione interrotta, anche se il `catch` di
questo script non fa in tempo a girare).

Distinzione da tenere sempre a mente, tre categorie diverse nello stesso
catalogo: **seed dimostrativo** (`02_seed.sql`, dati/nomi inventati,
placeholder picsum.photos — mai definitivo); **catalogo reale curato** (Carl
Cox/Charlotte de Witte **applicati**; Avicii, Alesso, Fred again.., ODESZA,
Calvin Harris, David Guetta, Martin Garrix, Kygo **scritti e testati, non
ancora applicati** — stessi principi, dati verificati uno per uno, foto con
credito visibile); **anteprime Deezer** (ADMIN e "In evidenza su Deezer" in
Home, sotto — dal vivo, sola lettura, mai scritte nel database, indipendenti
dal catalogo che si sfoglia).

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

**"In evidenza su Deezer" in Home** — terza superficie Deezer, distinta
dall'anteprima ADMIN sopra: sezione nella Home stessa (non in Profilo),
visibile a **qualunque utente autenticato**, non solo ADMIN.
`GET /api/deezer/scopri` (`backend/src/routes/deezer.js`, dietro
`richiediAutenticazione` ma senza `richiediRuolo`) riusa la stessa
orchestrazione dell'anteprima ADMIN, estratta in
`backend/src/deezer/anteprima.js` per non duplicarla, ma con lo stesso
artista/album fissi e **senza campi immagine** nella risposta (mai
copertina/foto, solo nome, titolo, durata, link) — reso in Home come testo
e link "Ascolta"/"Apri" su Deezer, mai come card di ricerca: niente
Segui/Aggiungi a playlist (questi risultati non hanno un id del catalogo
locale). Da anonimo, al suo posto compare `CartaAccediDeezer` (invito ad
accedere, bottone verso il tab Profilo) — nessuna chiamata a Deezer finché
non c'è una sessione. Catalogo locale, follow e playlist restano del tutto
separati e invariati in entrambi i casi.

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
      correzione, conferma collegamento, approva, scarta. **Stato attuale
      del database (verificato via query diretta)**: 4 eventi, tutti
      `fonte = 'manuale'` — sono i 4 eventi demo di `06_eventi_seed.sql`
      (date 2027 scelte per superare il filtro "Prossimi eventi >= oggi",
      titoli inventati), **non un residuo di un import Ticketmaster**: al
      momento non c'è alcun evento con `fonte = 'ticketmaster'` nel
      database — l'integrazione è pronta e testata, ma la coda è vuota
- [ ] Assistente AI per la coda di revisione (solo Fullstack)
- [x] Bottone Spotify + copertina/link Apple — vedi "Integrazioni esterne".
      Esistono anche due anteprime ADMIN di sola lettura, indipendenti dal
      catalogo/seed: **Anteprima Spotify** (`GET
      /api/admin/spotify/anteprima`, richiede
      `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` — senza, risponde 503 in
      modo controllato) e **Anteprima Deezer** (`GET
      /api/admin/deezer/anteprima`, API pubblica, nessuna chiave). In più,
      in Home per chi ha fatto accesso, **"In evidenza su Deezer"** (`GET
      /api/deezer/scopri`, testo e link, niente immagini) — vedi
      "Integrazioni esterne".
      - **Lotto 1** (Carl Cox, Charlotte de Witte): **applicato** al
        database in uso — schema credito foto, artisti/album/brani,
        correzione featuring, `url_spotify` sui 6 brani, pulizia dei 4
        `url_spotify` fittizi del seed demo. Copertina Apple dal vivo +
        badge, link Apple/Spotify a livello brano/album: **implementati e
        verificati** (121/121 test).
      - **Lotti 2-5** (Avicii, Alesso, Fred again.., ODESZA, Calvin Harris,
        David Guetta, Martin Garrix, Kygo — 10 artisti reali in totale con
        Carl Cox/Charlotte de Witte): script e mappature Apple/Spotify
        **scritti e testati** (intera suite backend, 181 test, tutti
        verdi), **non ancora
        applicati al database in uso** — in attesa di conferma esplicita
        lotto per lotto. Introducono tre casi nuovi rispetto al lotto 1,
        gestiti da `scripts/catalogoRealeCondiviso.js` (infrastruttura
        condivisa dai lotti 2+, lotto 1 resta invariato): un artista con
        più di un album (Kygo, David Guetta), un brano senza album — `
        album_id` NULL (i 2 singoli di Martin Garrix, "Marea" di Fred
        again..) — e la creazione di un genere non ancora esistente
        (**"Elettronica"**, per Fred again.. e ODESZA: gli altri 6 restano
        "House", approssimazione più vicina fra i generi esistenti;
        "Elettronica" viene creato — mai come genere vuoto — solo insieme
        al lotto 3, dentro la stessa transazione dei due artisti che lo
        usano). Caso particolare: l'album "Cloud Nine" di Kygo non ha un
        prodotto Apple corrispondente (verificato: nessun risultato sullo
        store IT) — ha solo il link Spotify all'album; il singolo
        "Firestone" mostra comunque entrambi i link (Apple e Spotify) nel
        proprio Dettaglio brano. Featuring reali mostrati nel titolo del
        brano solo dove l'edizione Apple lo usa davvero (mai inventato) —
        vedi "Integrazioni esterne" per i dettagli verificati brano per
        brano.
- [ ] Impostazioni (tema chiaro/scuro + sezione Account)
- [ ] Recensioni brani/album (solo Fullstack)
- [ ] Localizzazione IT/EN (solo Fullstack, solo se avanza tempo)
- [ ] README (+ README_REACT_NATIVE.md su Android)
