/* Immagini di anteprima per i social (1200×630) in public/og/: una per la home, Hotel, Destinazioni e ogni tappa.
   Si rigenerano con:  npm run og
   Serve Playwright con Chromium:  npm i -D playwright && npx playwright install chromium
   Da rifare quando si aggiunge una tappa o cambia una data. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TAPPE, stati, oggiRoma, dove, esc } from "../src/lab/lib/tour.js";
import { MAP_W, MAP_H } from "../src/lab/lib/mappa.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch (e) { console.error("Manca Playwright: npm i -D playwright && npx playwright install chromium"); process.exit(1); }

/* font del sito: dal pacchetto @fontsource-variable/host-grotesk se c'è (o da OG_FONT_DIR), altrimenti da Google Fonts */
const fontDir = process.env.OG_FONT_DIR || join(root, "node_modules/@fontsource-variable/host-grotesk/files");
const fontFace = ["normal", "italic"].map((st) => {
  const f = join(fontDir, `host-grotesk-latin-wght-${st}.woff2`);
  return existsSync(f) ? `@font-face{font-family:"Host Grotesk";font-style:${st};font-weight:300 800;src:url(data:font/woff2;base64,${readFileSync(f).toString("base64")}) format("woff2")}` : "";
}).join("");

const base = "data:image/svg+xml;base64," + readFileSync(join(root, "public/assets/mappa-italia.svg")).toString("base64");
const S = stati(oggiRoma());

function arc(a, b, k){
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  return "M" + a[0] + "," + a[1] + " Q" + (mx - dy * k).toFixed(1) + "," + (my + dx * k).toFixed(1) + " " + b[0] + "," + b[1];
}
function pins(highlight){
  const dated = TAPPE.filter((t) => t.dataISO);
  let s = "";
  for (let i = 0; i < dated.length - 1; i++){
    const a = dated[i], b = dated[i + 1];
    s += `<path class="leg ${S.isPast(b) ? "past" : (S.isPast(a) ? "next" : "future")}" d="${arc(a.pt, b.pt, i % 2 ? -.18 : .18)}"/>`;
  }
  TAPPE.forEach((t) => {
    const [x, y] = t.pt, c = S.cls(t);
    if (highlight && highlight !== t.id){ s += `<g class="city ${c}"><circle class="pin" cx="${x}" cy="${y}" r="4.5" opacity=".55"/></g>`; return; }
    if (highlight) s += `<circle class="halo" cx="${x}" cy="${y}" r="22"/>`;
    s += `<g class="city ${c}"><circle class="pin" cx="${x}" cy="${y}" r="${highlight ? 9 : (t.dataISO ? 6.5 : 5)}"/></g>`;
  });
  return `<div class="map"><img src="${base}" alt=""><svg viewBox="0 0 ${MAP_W} ${MAP_H}">${s}</svg></div>`;
}
const MARK = `<svg class="mark" viewBox="190 846 287 228"><polygon fill="currentColor" points="320.83 1008.17 308.11 1036.22 292.98 1069.56 292.97 1069.56 277.84 1036.22 221.9 912.9 252.16 912.9 292.97 1002.86 305.69 974.84 320.83 1008.17"/><polygon fill="currentColor" points="472.65 850.44 400.58 1009.3 385.44 975.95 442.39 850.44 472.65 850.44"/><polygon fill="currentColor" points="373.24 1002.86 388.37 1036.21 373.24 1069.56 373.23 1069.56 358.11 1036.21 333.11 981.11 317.97 947.76 333.11 914.4 349.77 877.67 205.91 877.67 193.56 850.44 392.39 850.44 380.03 877.67 348.24 947.76 373.24 1002.86"/></svg>`;
const CSS = `${fontFace}
*{box-sizing:border-box}body{margin:0}
.og{position:relative;width:1200px;height:630px;overflow:hidden;background:radial-gradient(ellipse 70% 80% at 18% 10%,rgba(110,58,235,.45),transparent 60%),radial-gradient(ellipse 60% 70% at 95% 100%,rgba(214,40,130,.22),transparent 60%),#1B0B3A;color:#fff;display:grid;grid-template-columns:660px 1fr;align-items:center;font-family:Inter,system-ui,sans-serif}
.txt{padding:0 0 0 72px;display:grid;gap:22px}
.brand{display:flex;align-items:center;gap:12px;font-family:"Host Grotesk","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:24px}
.mark{width:38px;color:#C4B5FD}
h1{font-family:"Host Grotesk","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:72px;line-height:1;letter-spacing:-.04em;margin:0}
h1 em{display:block;font-style:italic;font-weight:500;font-size:46px;line-height:1.05;letter-spacing:-.03em;color:#C4B5FD;margin-top:14px}
h1.city{font-weight:700;letter-spacing:-.055em;line-height:.9}
.when{font-family:"Host Grotesk","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:34px;letter-spacing:-.02em;color:#B5F5E2}
.sub{font-size:22px;line-height:1.4;color:#E3DCFB;max-width:30ch}
.url{font-weight:600;font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:#B5F5E2}
.map{position:relative;height:600px;aspect-ratio:600/720;justify-self:center;-webkit-mask-image:radial-gradient(ellipse 78% 72% at 52% 50%,#000 66%,transparent 100%)}
.map img,.map svg{position:absolute;inset:0;width:100%;height:100%}
.leg{fill:none;stroke-width:2.2;stroke-linecap:round}.leg.past{stroke:#C4B5FD}.leg.next{stroke:#B5F5E2;stroke-dasharray:6 7}.leg.future{stroke:rgba(255,255,255,.45);stroke-dasharray:2 7}
.city .pin{stroke-width:2.5}.city.past .pin{fill:#C4B5FD;stroke:#1B0B3A}.city.next .pin{fill:#B5F5E2;stroke:#1B0B3A}.city.tbd .pin{fill:#1B0B3A;stroke:rgba(255,255,255,.75);stroke-width:2}.city.sched .pin{fill:#fff;stroke:#1B0B3A}
.halo{fill:rgba(181,245,226,.18);stroke:#B5F5E2;stroke-width:1.5}`;
const page = (body) => `<!doctype html><html lang="it"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,400..800;1,400..800&display=swap"><style>${CSS}</style></head><body><div class="og">${body}</div></body></html>`;
const brand = `<div class="brand">${MARK}<span>AI Visibility Lab · RankWit AI</span></div>`;

const immagini = [
  { nome: "tour", html: page(`<div class="txt">${brand}<h1>L'AI sceglie<br>pochi nomi.<em>Ti mostriamo come<br>essere tra questi.</em></h1><p class="sub">Il tour per hotel e destinazioni, una tappa alla volta.</p><p class="url">lab.rankwit.ai</p></div>${pins()}`) },
  { nome: "hotel", html: page(`<div class="txt">${brand}<h1>L'AI descrive<br>il tuo hotel.<em>Con i dati degli altri.</em></h1><p class="sub">Il Lab per gli hotel: cosa dicono gli assistenti AI e cosa cambiare sul sito.</p><p class="url">lab.rankwit.ai/hotel</p></div>${pins()}`) },
  { nome: "destinations", html: page(`<div class="txt">${brand}<h1>L'AI parla del<br>tuo territorio.<em>Spesso sbagliando.</em></h1><p class="sub">Il Lab per DMO, consorzi, comuni e uffici turistici.</p><p class="url">lab.rankwit.ai/destinations</p></div>${pins()}`) }
].concat(TAPPE.map((t) => {
  const size = Math.min(132, Math.floor(560 / (t.citta.length * 0.56)));
  const dettaglio = t.intro ? t.edizione + " · " + t.sedeBreve : (t.collab ? "In collaborazione con " + t.collab : "Data e sede da definire");
  return { nome: t.id, html: page(`<div class="txt">${brand}<h1 class="city" style="font-size:${size}px">${esc(t.citta)}</h1><p class="when">${t.dataISO ? esc(t.data) : "Prossimamente"}</p><p class="sub">${esc(dettaglio)}</p><p class="url">lab.rankwit.ai/tappe/${t.id}</p></div>${pins(t.id)}`) };
}));

const out = join(root, "public/og");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const im of immagini){
  await p.setContent(im.html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(out, im.nome + ".png"), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log("og/" + im.nome + ".png");
}
await browser.close();
