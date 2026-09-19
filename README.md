# Free Space Factory — sito web

Rebuild del sito dello studio di architettura Free Space Factory, con [Astro](https://astro.build).
Sostituisce il vecchio sito WordPress (tema Inspiro + Elementor) con un sito statico: molto più
veloce, più facile da mantenere e ottimizzato per la SEO.

> **Prima di continuare il lavoro su questo progetto**, leggi [HANDOFF.md](HANDOFF.md): elenca lo
> stato attuale, cosa manca (in attesa di input dal cliente) e alcune scelte/vincoli tecnici non
> ovvi dal solo codice.

## Perché Astro

- **Nessun WordPress/PHP/database da aggiornare o mettere in sicurezza.**
- Output statico: pagine leggerissime, ottimi punteggi Core Web Vitals / Lighthouse, il che aiuta
  direttamente il posizionamento su Google.
- I contenuti dei progetti vivono in semplici file Markdown (`src/content/projects/*.md`): per
  aggiungere un progetto basta creare un nuovo file, senza toccare il codice delle pagine.

## Setup iniziale (una tantum)

Node.js (LTS, installato tramite winget) e le dipendenze del progetto sono già a posto su questa
macchina. Su una macchina nuova:

1. Installa [Node.js LTS](https://nodejs.org/) (versione 20 o superiore).
2. Da questa cartella, installa le dipendenze:

```bash
npm install
```

### Problema noto su questa macchina: "Application Control policy has blocked this file"

Astro usa internamente alcuni componenti nativi scritti in Rust (per l'elaborazione di Markdown).
Su questa macchina, una policy di sicurezza Windows ("Application Control") blocca l'esecuzione di
questi file `.node`, quindi `npm run dev` / `npm run build` falliscono con un errore che cita
"Application Control policy has blocked this file".

La soluzione è far usare ad Astro una versione WebAssembly (WASM) degli stessi componenti invece
del binario nativo bloccato:

1. Se serve (dopo aver cancellato `node_modules` e rifatto `npm install`), esegui:

   ```bash
   npm run fix:native-blocked
   ```

   Questo scarica e posiziona manualmente i pacchetti WASM di fallback, che npm normalmente non
   installa da solo su Windows/x64.

2. Avvia il sito con lo script `run-dev.cmd` (invece di `npm run dev` diretto), che imposta la
   variabile d'ambiente necessaria (`NAPI_RS_FORCE_WASI=true`) prima di avviare Astro:

   ```bash
   run-dev.cmd
   ```

   Per una build di produzione, imposta la stessa variabile prima di lanciare `npm run build`:

   ```bash
   set NAPI_RS_FORCE_WASI=true && npm run build
   ```

Questo è un problema specifico di questa macchina (dovuto alla policy di sicurezza installata), non
del progetto: su un altro computer, o su qualsiasi servizio di hosting/CI, `npm run dev`/`build`
funzionano normalmente senza bisogno di questi passaggi.

## Comandi

```bash
npm run dev       # avvia il sito in locale su http://localhost:4321
npm run build     # genera il sito statico in dist/
npm run preview   # serve la build di produzione in locale, per un ultimo controllo
```

## Struttura del progetto

```
src/
  content/projects/*.md   -> un file per ogni progetto (testo, crediti, galleria)
  content.config.ts       -> schema/validazione dei dati di progetto
  layouts/BaseLayout.astro-> <head> SEO, dati strutturati, header/footer comuni
  components/             -> Header, Footer, ProjectCard, Gallery
  pages/                  -> una pagina per ogni URL del sito
  lib/constants.ts        -> nome studio, email, città, fondatrici, voci di menu
public/                   -> file statici (favicon, robots.txt)
```

## Come aggiungere un nuovo progetto

Crea un file `src/content/projects/nome-progetto.md` seguendo lo schema di un progetto
esistente (es. `nomentano.md`): titolo, quartiere, stato, immagine di copertina, crediti,
galleria e testo descrittivo nel corpo del file. La pagina `/progetti/nome-progetto/` viene
generata automaticamente, così come la sua voce nella pagina `/progetti/`.

## Immagini e logo

Le immagini segnaposto sono state sostituite con le foto reali scaricate dal vecchio sito
(`public/images/projects/*`, `public/images/hero/`, `public/images/team/`) e con il vero logo
dello studio (`public/images/logo/`). Per ogni progetto sono state scelte 1 copertina + 3-4 foto
rappresentative tra quelle disponibili sul sito precedente, non l'intera galleria originale
(che per alcuni progetti conta decine di scatti tra render/cantiere/finito): se volete aggiungere
altre foto a un progetto, basta metterle in `public/images/projects/<slug>/` e aggiungerle
all'array `gallery` nel relativo file `src/content/projects/<slug>.md`.

Il colore del brand (`brand-*` in `src/styles/global.css`) è stato estratto a partire dal vero
logo (teal `#0f8a90`), al posto del verde salvia inventato inizialmente.

## Casella messaggi (form di Contatti)

Il form in `/contatti/` usa [Web3Forms](https://web3forms.com) per inviare i messaggi via email
senza bisogno di un backend: **non serve creare un account con password**, basta inserire
`info@freespacefactory.it` sul loro sito per ricevere una "Access Key" gratuita via email.

1. Vai su https://web3forms.com, inserisci `info@freespacefactory.it` e copia la Access Key che
   ricevi.
2. Incollala in `src/lib/constants.ts`, sostituendo `YOUR_WEB3FORMS_ACCESS_KEY` con la chiave
   reale.
3. Finché la chiave non è impostata, il form non recapita i messaggi.

Per far sì che i messaggi arrivino sia a Flavia che a Laura ("mail globale"), impostate presso il
vostro provider email un **inoltro automatico** dalla casella `info@freespacefactory.it` verso gli
indirizzi personali di entrambe: è un'impostazione lato provider di posta (es. Gmail/Aruba/altro),
non qualcosa che si configura nel codice del sito.

## SEO: cosa è stato migliorato rispetto al sito precedente

- Ogni pagina ha ora un `<title>` e una `<meta description>` **unici** (nel sito WordPress tutte
  le pagine condividevano lo stesso titolo "Liberi di spaziare").
- Tag Open Graph / Twitter Card su ogni pagina, per anteprime corrette quando il sito viene
  condiviso sui social o via chat.
- Dati strutturati JSON-LD (schema.org `Architect`) nell'header di ogni pagina, per aiutare Google
  a capire chi è lo studio, dove opera e chi lo ha fondato.
- `sitemap-index.xml` generata automaticamente ad ogni build (integrazione `@astrojs/sitemap`) e
  dichiarata in `public/robots.txt`.
- Markup semantico (`header`, `nav`, `main`, `footer`, un solo `<h1>` per pagina) e testo
  alternativo su ogni immagine.
- Pagina Contatti ampliata: il vecchio sito mostrava solo un indirizzo email senza contesto.

Sono stati inoltre aggiunti dati strutturati `Person` per Flavia Rosano e Laura Gramaccini nella
pagina Architetti, e il testo di più pagine (home, architetti, footer) è stato rivisto per includere
naturalmente le parole chiave richieste: nomi delle architette, "Roma", "architetti Roma",
"ristrutturazioni".

### Da fare per completare la SEO locale

- **Indirizzo fisico dello studio**: se lo studio riceve clienti in sede, aggiungere l'indirizzo
  reale in `src/lib/constants.ts` (`addressLocality`/`addressRegion`) e nel componente Contatti,
  e creare/collegare una scheda Google Business Profile con lo stesso indirizzo.
- Dopo il primo deploy, registrare il sito su Google Search Console e inviare la sitemap.

## Pacchetti "Chiavi in Mano"

I tre pacchetti in `/chiavi-in-mano/` (Base € 2.000, Intermedio € 4.500, Luxury € 6.000) e le
relative esclusioni sono presi dal documento "PREVENTIVI PACCHETTI_17092026.docx" (versione
semplificata più recente). Come segnalato, questi importi sono provvisori e vanno aggiornati in
`src/pages/chiavi-in-mano.astro` (array `packages`) quando saranno confermati.

## Da fare — in sospeso

- **Articolo su Clitunno**: da integrare nella pagina del progetto Clitunno appena viene fornito il
  testo/link dell'articolo.
- **Ispirazione da 02a.it**: dal sito di riferimento sono stati ripresi alcuni piccoli elementi
  (titoli in maiuscolo con barra sottolineata, dove applicati). Il sito 02a.it usa anche uno stile
  fotografico "a griglia" molto più denso in home e testi di progetto molto più narrativi ("il
  racconto" del progetto): non li ho copiati automaticamente perché richiederebbero contenuti reali
  (materiali, scelte progettuali) che non ho per i progetti di Free Space Factory — se volete
  quello stile più editoriale, ditemi quali progetti approfondire e con quali dettagli.

## Deploy

**In locale, con Docker**: il sito gira containerizzato su questa macchina.

```bash
docker build -t freespacefactory .
docker run -d --name freespacefactory --restart unless-stopped -p 8081:80 freespacefactory
```

Il sito è raggiungibile su http://localhost:8081. Il container serve una build statica (via
nginx): per vedere una modifica bisogna rifare `docker build` e ricreare il container (`docker rm
-f freespacefactory` poi i due comandi sopra). Per lo sviluppo attivo (con ricaricamento
automatico) continuate a usare `npm run dev` / `run-dev.cmd` come descritto sopra.

**Online**: il sito è comunque statico e può essere pubblicato anche su qualsiasi hosting per siti
statici (Netlify, Vercel, Cloudflare Pages, GitHub Pages, ecc.), oltre che via Docker su un
server/VPS. Comando di build: `npm run build`, cartella di output: `dist/`.
