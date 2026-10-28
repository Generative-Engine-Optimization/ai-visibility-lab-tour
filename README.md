# AI Visibility Lab · sito del tour (lab.rankwit.ai)

Sito del roadshow di RankWit AI, fatto in Astro. Anteprima: https://generative-engine-optimization.github.io/ai-visibility-lab-tour/

## Pagine

| Indirizzo | Contenuto |
|---|---|
| `/` | Home: mappa, tabellone delle tappe, video, report, programma, partner, domande frequenti, moduli |
| `/hotel/` | Il Lab per gli hotel |
| `/destinations/` | Il Lab per le destinazioni |
| `/tappe/<id>/` | Una pagina per ogni tappa (`/tappe/firenze/`, `/tappe/pistoia/`…) |
| `/llms.txt` | Riassunto del sito per gli assistenti AI, generato a ogni build |
| `/sitemap-index.xml` | Sitemap, generata a ogni build |

Tutto il testo è già nell'HTML: JavaScript serve solo per animazioni, menu, invio dei moduli e per aggiornare lo stato delle tappe se il sito non è stato ricostruito dopo una data.

## SEO e GEO

- Ogni pagina ha title, description, canonical (sempre su `https://lab.rankwit.ai`), Open Graph e immagine per i social (`public/og/`).
- Dati strutturati JSON-LD: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`; nella home `EventSeries` con tutte le tappe e `FAQPage`; in ogni tappa con data un `EducationEvent` (date, orari con fuso italiano, luogo, organizzatori, prezzo quando è noto).
- Le tappe senza data hanno `noindex` e non sono nella sitemap: la pagina esiste (si apre da mappa e tabellone), ma data e sede non ci sono ancora.
- Nell'HTML c'è solo lo stato del giorno della pubblicazione (in programma o conclusa): niente testi nascosti in contraddizione tra loro.
- `robots.txt` lascia entrare motori e assistenti AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) ed esclude `/api/`.
- I vecchi link della pagina unica continuano a funzionare: `/#pistoia` porta a `/tappe/pistoia/`, `/#hotel` a `/hotel/`. `/tappe/san-marcello/` va a `/tappe/pistoia/` (301 in `public/_redirects`).

## Struttura

```
src/pages/                 pagine: index, hotel, destinations, tappe/[id], llms.txt
src/lab/lib/tour.js        le tappe (per aggiungerne o modificarne una si cambia solo qui)
src/lab/lib/faq.js         domande frequenti (pagina e dati strutturati)
src/lab/lib/contenuti.js   testi usati in più pagine (sessioni, report, passi)
src/lab/lib/seo.js         dati strutturati
src/lab/components/        testata, footer, mappa, tabellone, moduli
src/lab/layouts/Base.astro <head> comune: SEO, JSON-LD, tracciamento
src/lab/scripts/tour.js    JavaScript del browser
src/lab/styles/tour.css    stili
public/assets/             mappa dell'Italia e loghi
public/og/                 immagini per i social (1200×630)
scripts/og.mjs             rigenera le immagini di public/og
```

## Comandi

Node 22.12 o successivo.

```
npm install
npm run dev               # sviluppo su http://localhost:4321
npm run build             # sito per lab.rankwit.ai in dist/
npm run build:anteprima   # copia per GitHub Pages (sotto /ai-visibility-lab-tour/, noindex, senza tracciamento)
npm run og                # rigenera public/og (serve: npm i -D playwright && npx playwright install chromium)
```

## Messa online su lab.rankwit.ai

Dal sito attuale risulta un progetto Astro su Cloudflare. Il modo più semplice è copiare questi file nel progetto esistente.

**Prima, se nel progetto c'è già la versione precedente (la pagina unica)**, va tolta, altrimenti copre le pagine nuove:
- cancellare `public/index.html` (Astro servirebbe quello al posto di `src/pages/index.astro`) e `public/og-tour.png`;
- togliere da `public/_redirects` le quattro righe di `/hotel`, `/hotel/`, `/destinations`, `/destinations/` (su Cloudflare i redirect hanno la precedenza sui file e manderebbero quelle pagine alla home).

Poi:

1. La cartella `src/lab/` così com'è.
2. Le pagine: `src/pages/index.astro` (sostituisce la home attuale), `hotel.astro`, `destinations.astro`, `tappe/[id].astro`, `llms.txt.js`. Hanno `export const prerender = true`, quindi restano statiche anche se il progetto è in modalità server.
3. `public/assets/mappa-italia.svg`, `public/assets/loghi/`, `public/og/`.
4. Le righe di `public/robots.txt` e `public/_redirects`, da unire ai file che ci sono già.
5. In `astro.config.mjs`, se si vuole la sitemap: `@astrojs/sitemap` con il filtro che esclude le tappe senza data (vedi `astro.config.mjs` di questo repository).

Indirizzi con la barra finale (`/hotel/`, `/tappe/pistoia/`): canonical, link interni e filtro della sitemap li danno per scontati. Nel progetto vanno bene le impostazioni predefinite di Astro (`build.format: "directory"`); con `build.format: "file"` le pagine finirebbero in `/hotel.html` e i canonical non corrisponderebbero.

In alternativa il repository si può pubblicare da solo su Cloudflare Pages (build `npm run build`, cartella `dist`, variabile `NODE_VERSION=22`), ma allora vanno riportate qui le altre pagine del sito attuale.

Le pagine usano il loro layout (`src/lab/layouts/Base.astro`), che contiene già il tracciamento. Non si somma a quello del layout attuale, perché ogni pagina usa un solo layout.

### Pagine e file del sito attuale da non togliere

Le pagine puntano a `/firenze`, `/eventi`, `/privacy`, `/cookie-policy`, `/assets/rankwit-symbol.png`, `/assets/evento-rimini.mp4`, `/assets/evento-rimini-poster.jpg` e a try.rankwit.ai/report-gratuito.

## Moduli

I due moduli (Avvisami / proponi una città, e Contatti) mandano una richiesta `POST` con corpo JSON a `/api/richiesta` (costante `FORM_ENDPOINT` in `src/lab/scripts/tour.js`). Serve un endpoint gemello di `/api/candidatura` che risponda con uno stato 2xx: il modulo mostra la conferma solo in quel caso, altrimenti un errore con info@rankwit.ai.

| Campo | Avvisami / proposta | Contatti |
|---|---|---|
| `tipo` | `"avvisami"` o `"proposta"` | `"contatto"` |
| `citta` | città scelta o proposta | – |
| `argomento`, `messaggio` | – | sì |
| `nome`, `email` | obbligatori | obbligatori |
| `struttura` | obbligatorio | facoltativo |
| `tipoStruttura` | obbligatorio | – |
| `sito`, `telefono` | facoltativi | `telefono` facoltativo |
| `consensoPrivacy` | `true` | `true` |
| `pagina` | `"home"` o `"tappa-<id>"` | `"contatti"` |
| `inviatoIl` | data ISO | data ISO |

Esempio minimo come route di Astro, accanto a quella di `/api/candidatura` (`src/pages/api/richiesta.ts`):

```ts
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const r = await request.json();
  if (!r.nome || !r.email || r.consensoPrivacy !== true) return new Response("Dati mancanti", { status: 400 });
  // qui: mandare la richiesta dove arrivano già le candidature (email, CRM, foglio)
  return Response.json({ ok: true });
};
```

Se invece le API sono Pages Function (cartella `functions/`), lo stesso codice va in `functions/api/richiesta.js` come `export async function onRequestPost({ request })`. Con l'adapter Cloudflare di Astro la cartella `functions/` viene ignorata, quindi conviene la route di Astro.

Dopo un invio riuscito la pagina mette nel `dataLayer` l'evento `lab_richiesta` (con `tipo` e `citta`), utilizzabile in Tag Manager. I moduli inviano solo da lab.rankwit.ai, `localhost`, `127.0.0.1` e `*.pages.dev`; altrove (per esempio nell'anteprima) invitano a scrivere a info@rankwit.ai.

## Tracciamento

Gli stessi strumenti del sito attuale: Google Tag Manager `GTM-PN8TJ9QX`, Google Analytics 4 `G-3B6T2Q6QEW`, Microsoft Clarity `y0sqnp0606` (il pixel di Meta lo carica Tag Manager). Sono in `src/lab/layouts/Base.astro` e si attivano solo su lab.rankwit.ai.

## Aggiornare le tappe

Tutto in `TAPPE`, in `src/lab/lib/tour.js`:

- `dataISO` (AAAA-MM-GG): nel giorno della tappa lo stato è "Oggi", dal giorno dopo "Conclusa" (ora italiana). Senza `dataISO` la tappa è "Prossimamente" e la pagina non è indicizzata.
- `lat`, `lon`: posizione sulla mappa. `regione` e, quando sono noti, `luogo` (nome della sede), `indirizzo` e `comune` finiscono nei dati strutturati; senza `comune` si usa il nome della città. `prep: "in"` per le zone (in Casentino).
- `collab`: chi organizza la tappa con RankWit ("In collaborazione con …").
- Senza `intro` la pagina è "Informazioni disponibili a breve" con il modulo. Con `intro`, `edizione`, `orario`, `sede`, `formato`, `posti`, `costo`, `programma` e `agenda` diventa una pagina completa (vedi Firenze e Rimini). `prezzo` (con `ivaEsclusa: true` se è + IVA) o `gratuito` vanno nei dati strutturati.
- Dopo aver aggiunto una tappa: `npm run og` per la sua immagine (finché non c'è si usa quella del tour).

Stato delle tappe, sitemap, `llms.txt` e dati strutturati si calcolano alla build. Conviene ricostruire il sito una volta al giorno, per esempio con un deploy hook di Cloudflare Pages chiamato da un cron. Nel frattempo il browser corregge comunque lo stato.

## Da sapere

- **Cookie**: il sito attuale non ha un banner cookie e queste pagine fanno lo stesso. Se serve un banner o il Consent Mode, va aggiunto in `Base.astro`.
- **Font Bukra**: il titolo della home usa Bukra, che non è su Google Fonts. Chi non ce l'ha vede Host Grotesk. Per mostrarlo a tutti serve il file `.woff2` con licenza web (istruzioni in `tour.css`, cerca "Bukra").
- **Anteprima**: `.github/workflows/anteprima.yml` pubblica `npm run build:anteprima` su GitHub Pages a ogni modifica e una volta al giorno. Non serve per lab.rankwit.ai e si può togliere. Nell'anteprima i moduli non inviano nulla (inviano solo da lab.rankwit.ai, `localhost` e `*.pages.dev`).
- **Video**: la sezione "Com'è andata a Firenze" usa `/assets/evento-rimini.mp4` del sito attuale, come la versione precedente.

## Controlli dopo la pubblicazione

1. Aprire `/`, `/hotel/`, `/destinations/`, `/tappe/firenze/`, `/tappe/pistoia/`, `/llms.txt`, `/sitemap-index.xml`.
2. Inviare i due moduli e verificare che le richieste arrivino; in Tag Manager controllare l'evento `lab_richiesta`.
3. Passare home e `/tappe/firenze/` nel Test dei risultati multimediali di Google e inviare la sitemap in Search Console.
