/* POST /api/richiesta: riceve i moduli del sito (Avvisami / proponi una città, Contatti) e inoltra tutto
   al webhook di Make. Pages Function di Cloudflare: la cartella functions/ viene caricata con "wrangler pages deploy".
   Il webhook sta nella variabile MAKE_WEBHOOK (secret del progetto Pages; in locale in .dev.vars). */

const MAX = 4000;
const pulisci = (v) => (typeof v === "string" ? v.trim().slice(0, MAX) : v);

export async function onRequest({ request, env }){
  if (request.method !== "POST") return risposta({ ok: false, errore: "usare POST" }, 405, { Allow: "POST" });
  if (!env.MAKE_WEBHOOK) return risposta({ ok: false, errore: "webhook non configurato" }, 500);

  let dati;
  try { dati = await request.json(); } catch(e){ return risposta({ ok: false, errore: "corpo non valido" }, 400); }
  if (!dati || typeof dati !== "object") return risposta({ ok: false, errore: "corpo non valido" }, 400);

  const rec = {};
  for (const k of Object.keys(dati)) rec[k] = pulisci(dati[k]);
  if (!rec.nome || !rec.email || rec.consensoPrivacy !== true) return risposta({ ok: false, errore: "dati mancanti" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rec.email)) return risposta({ ok: false, errore: "email non valida" }, 400);

  /* quello che vede solo il server: rete, posizione stimata, browser */
  const h = request.headers, cf = request.cf || {};
  const lead = Object.assign({}, rec, {
    ricevutoIl: new Date().toISOString(),
    sito: new URL(request.url).hostname,
    ip: h.get("CF-Connecting-IP") || "",
    paese: cf.country || h.get("CF-IPCountry") || "",
    regione: cf.region || "",
    citta_ip: cf.city || "",
    cap_ip: cf.postalCode || "",
    fusoOrario: cf.timezone || "",
    userAgent: h.get("User-Agent") || "",
    lingua: h.get("Accept-Language") || "",
    refererHttp: h.get("Referer") || ""
  });

  try {
    const r = await fetch(env.MAKE_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!r.ok) return risposta({ ok: false, errore: "webhook " + r.status }, 502);
  } catch(e){
    return risposta({ ok: false, errore: "webhook non raggiungibile" }, 502);
  }
  return risposta({ ok: true });
}

function risposta(corpo, stato = 200, extra = {}){
  return new Response(JSON.stringify(corpo), { status: stato, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, extra) });
}
