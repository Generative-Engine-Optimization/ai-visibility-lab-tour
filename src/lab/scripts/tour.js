/* Comportamento delle pagine nel browser. Il testo è già tutto nell'HTML: qui ci sono solo
   gli aggiornamenti legati alla data di oggi, le animazioni, il menu e l'invio dei moduli. */
import { TAPPE, BY, MAIL, stati, oggiRoma, testiAttesa, fraseTappa, doveTappa, titoloMateriali, laTappa, esc, low } from "../lib/tour.js";
import { MAP_W, MAP_H } from "../lib/mappa.js";

/* ---------- invio delle richieste ----------
   I due moduli (Avvisami / proponi una città, e Contatti) mandano i dati in POST, come JSON,
   all'indirizzo FORM_ENDPOINT. Se il server risponde con uno stato 2xx il modulo mostra la conferma,
   altrimenti mostra un errore con l'indirizzo email. Campi inviati: vedi README.
   Fuori da lab.rankwit.ai (per esempio sull'anteprima su GitHub Pages) i moduli non inviano nulla
   e invitano a scrivere all'email. Dopo un invio riuscito parte l'evento "lab_richiesta" nel dataLayer. */
const FORM_ENDPOINT = "/api/richiesta";
const FORM_HOSTS = /^(lab\.rankwit\.ai|localhost|127\.0\.0\.1)$|\.pages\.dev$/;
function inviaRichiesta(rec){
  if (!FORM_ENDPOINT || !FORM_HOSTS.test(location.hostname)) return Promise.reject({ code: "no_db" });
  return fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rec) })
    .then(function(r){
      if (!r.ok) throw { code: "http", status: r.status };
      try { (window.dataLayer = window.dataLayer || []).push({ event: "lab_richiesta", tipo: rec.tipo, citta: rec.citta || "" }); } catch(e){}
    });
}

const BASE = (document.documentElement.dataset.base || "").replace(/\/+$/, "");
const url = (p) => BASE + p;
const S = stati(oggiRoma());
const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const $id = (id) => document.getElementById(id);

/* ---------- stato delle tappe secondo la data di oggi ----------
   Le pagine sono costruite con lo stato del giorno della pubblicazione (data-oggi su <html>): se nel frattempo
   una tappa si è conclusa, qui si aggiornano tabellone, mappa, elenchi dei moduli e pagina della tappa.
   Se lo stato è lo stesso non si tocca la pagina. */
const B = stati(document.documentElement.dataset.oggi || "");
const CAMBIATO = B.NEXT !== S.NEXT || TAPPE.some(function(t){
  return B.cls(t) !== S.cls(t) || B.label(t) !== S.label(t) || !B.shown[t.id] !== !S.shown[t.id];
});
function aggiornaStati(){
  if (!CAMBIATO) return;
  document.querySelectorAll(".board-grid .dep[data-id]").forEach(function(row){
    const t = BY[row.dataset.id]; if (!t) return;
    row.classList.remove("is-past", "is-next", "is-sched", "is-tbd");
    row.classList.add("is-" + S.cls(t));
    row.classList.toggle("extra", !S.shown[t.id]);
    const st = row.querySelector(".d-st");
    if (st){ st.className = "d-st " + S.stCls(t); st.textContent = S.label(t); }
    row.setAttribute("aria-label", t.citta + ", " + t.data + ", " + (t.edizione || "formato da definire") + ", " + S.label(t));
  });
  const nHidden = TAPPE.filter(function(t){ return !S.shown[t.id]; }).length;
  const nEl = $id("board-more-n"); if (nEl) nEl.textContent = nHidden;
  const more = $id("board-more");
  if (more && !nHidden){ more.hidden = true; const b = $id("board"); if (b) b.classList.remove("collapsed"); }

  const nd = $id("next-dep"), N = S.NEXT;
  if (nd){
    if (!N) nd.hidden = true;
    else {
      nd.href = url("/tappe/" + N.id + "/");
      nd.innerHTML = '<span class="nd-dot" aria-hidden="true"></span><span class="nd-k">' + (S.isToday(N) ? "Oggi" : "Prossima tappa") + '</span><span class="nd-city">' + esc(N.citta) + "<small>" + esc(N.dataISO ? N.data : low(N.data)) + '</small></span><span class="arr" aria-hidden="true">→</span>';
    }
  }

  document.querySelectorAll(".map-pins .city[data-id]").forEach(function(g){
    const t = BY[g.dataset.id]; if (!t) return;
    g.classList.remove("past", "next", "sched", "tbd"); g.classList.add(S.cls(t));
    const a = g.querySelector("a"); if (a) a.setAttribute("aria-label", t.citta + ", " + t.data + ", " + S.label(t));
  });
  const mh = document.querySelector("#map-hero .map-pins");
  if (mh) mh.setAttribute("aria-label", "Mappa delle tappe: " + TAPPE.map(function(c){ return c.citta + " (" + S.label(c).toLowerCase() + ")"; }).join(", "));
  document.querySelectorAll(".map-pins .leg[data-a]").forEach(function(p){
    const a = BY[p.dataset.a], b = BY[p.dataset.b]; if (!a || !b) return;
    p.classList.remove("past", "next", "future");
    p.classList.add(S.isPast(b) ? "past" : (S.isPast(a) ? "next" : "future"));
  });

  /* negli elenchi delle città restano solo le tappe non concluse */
  document.querySelectorAll("option[data-date]").forEach(function(o){
    if (o.dataset.date && o.dataset.date < S.oggi) o.remove();
  });

  /* pagina di una tappa */
  const main = document.querySelector("[data-tappa]"); if (!main) return;
  const t = BY[main.dataset.tappa]; if (!t) return;
  const passata = S.isPast(t);
  main.querySelectorAll("[data-pill]").forEach(function(p){
    p.textContent = S.label(t);
    if (p.closest(".t-hero")) p.style.color = passata ? "var(--lilac)" : "var(--mint)";
  });
  const h1 = main.querySelector(".t-city"); if (h1) h1.classList.toggle("outline", !passata);
  /* tappa con programma che si è conclusa dopo la pubblicazione: al posto del modulo, il riquadro "conclusa" */
  const card = main.querySelector('.side-card[data-se="futuro"]');
  if (card && passata){
    card.outerHTML = '<div class="side-card"><span class="st-pill">Conclusa</span><h3>Tappa conclusa il ' + esc(t.data) + '</h3>'
      + '<p>Vuoi partecipare alla prossima? Lascia i tuoi dati e ti scriviamo quando apriamo le candidature.</p>'
      + '<a class="btn btn-primary" href="' + url("/#avvisami") + '">Avvisami per la prossima tappa <span class="arr" aria-hidden="true">→</span></a>'
      + (t.link ? '<a class="link" href="' + esc(t.link) + '" target="_blank" rel="noopener">Pagina dell\'edizione su lab.rankwit.ai ↗</a>' : "") + "</div>";
  }
  main.querySelectorAll('[data-se="futuro"]').forEach(function(el){ el.hidden = passata; });
  const fr = main.querySelector("[data-frase]"); if (fr) fr.textContent = fraseTappa(t, S);
  const dv = main.querySelector("[data-dove]"); if (dv) dv.textContent = doveTappa(t, S);
  const ma = main.querySelector("[data-materiali]"); if (ma) ma.textContent = titoloMateriali(t, S);
  const att = testiAttesa(t, S);
  const at = main.querySelector('[data-attesa="titolo"]'); if (at) at.textContent = att.titolo;
  const ax = main.querySelector('[data-attesa="testo"]'); if (ax) ax.textContent = att.testo;
  const mt = main.querySelector("[data-modulo-titolo]");
  if (mt){
    const citta = passata ? (S.NEXT ? S.NEXT.citta : "") : t.citta;
    mt.textContent = citta ? "Avvisami per " + citta : "Avvisami per le prossime tappe";
    const hid = $id("side-citta"); if (hid && hid.tagName === "INPUT" && citta) { hid.value = citta; hid.setAttribute("value", citta); }
  }
}
aggiornaStati();

/* ---------- tabellone a palette ---------- */
const board = $id("board");
if (board){
  const more = $id("board-more");
  if (more) more.addEventListener("click", function(){
    const open = board.classList.toggle("collapsed") === false;
    more.setAttribute("aria-expanded", String(open));
    $id("board-more-act").textContent = open ? "Mostra meno ↑" : "Mostra tutte ↓";
    if (!open) board.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  });
  const spin = function(){
    if (reduce) return;
    const L = "ABCDEFGILMNOPRSTUVZ0123456789";
    Array.prototype.filter.call(board.querySelectorAll(".dep"), function(row){ return row.offsetParent !== null; }).forEach(function(row, r){
      row.querySelectorAll(".flap").forEach(function(f, k){
        const target = f.dataset.c; if (!target) return;
        const steps = 6 + Math.min(r, 4) + (k % 5); let n = 0;
        const tick = function(){
          n++;
          f.classList.remove("turn"); void f.offsetWidth; f.classList.add("turn");
          f.textContent = n >= steps ? target : L[Math.floor(Math.random() * L.length)];
          if (n < steps) setTimeout(tick, 70);
        };
        setTimeout(tick, r * 55 + k * 22);
      });
    });
  };
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ spin(); io.disconnect(); } }); }, { threshold: .25 });
    io.observe(board);
  }
}
const clock = $id("clock");
if (clock){
  const tickClock = function(){ try { clock.textContent = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" }).format(new Date()); } catch(e){} };
  tickClock(); setInterval(tickClock, 20000);
}

/* ---------- aloni delle fasce scure che seguono lo scroll ---------- */
const glows = Array.prototype.slice.call(document.querySelectorAll(".band-night"));
if (!reduce && glows.length){
  let queued = false;
  const paint = function(){
    queued = false;
    const vh = window.innerHeight || 800;
    glows.forEach(function(el){
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (vh - r.top) / (vh + r.height);
      el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    });
  };
  const queue = function(){ if (!queued){ queued = true; requestAnimationFrame(paint); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  paint();
}

/* ---------- mappa della home: domanda di esempio e nome della tappa al passaggio del mouse ---------- */
const heroMap = $id("map-hero");
if (heroMap){
  const hcQ = $id("hc-q"), hcCity = $id("hc-city"), tip = $id("map-tip");
  const pins = function(){ return heroMap.querySelector(".map-pins"); };
  const showTip = function(t){
    const svg = pins(); if (!svg || !tip) return;
    const r = svg.getBoundingClientRect(), host = heroMap.parentNode.getBoundingClientRect();
    $id("map-tip-name").textContent = t.citta;
    $id("map-tip-when").textContent = t.dataISO ? t.data + " · " + S.label(t).toLowerCase() : "Prossimamente";
    tip.style.left = (r.left - host.left + t.pt[0] / MAP_W * r.width) + "px";
    tip.style.top = (r.top - host.top + t.pt[1] / MAP_H * r.height) + "px";
    tip.hidden = false;
  };
  const showQ = function(id){
    const t = BY[id]; if (!t) return;
    hcQ.textContent = "«" + t.domanda + "»";
    hcCity.textContent = "Domanda di esempio · " + t.citta;
    heroMap.querySelectorAll(".city").forEach(function(g){ g.classList.toggle("on", g.dataset.id === id); });
    showTip(t);
  };
  const hideTip = function(){ if (tip) tip.hidden = true; heroMap.querySelectorAll(".city.on").forEach(function(g){ g.classList.remove("on"); }); };
  /* in Toscana i punti sono vicini: si attiva la tappa più vicina al puntatore */
  const nearest = function(e){
    const svg = pins(); if (!svg) return null;
    const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * MAP_W, y = (e.clientY - r.top) / r.height * MAP_H;
    let best = null, bd = 18 * 18;
    TAPPE.forEach(function(t){ const dx = t.pt[0] - x, dy = t.pt[1] - y, d = dx * dx + dy * dy; if (d < bd){ bd = d; best = t; } });
    return best;
  };
  let current = null;
  heroMap.addEventListener("mousemove", function(e){
    const t = nearest(e);
    if (t === current) return;
    current = t;
    if (t) showQ(t.id); else hideTip();
    heroMap.style.cursor = t ? "pointer" : "";
  });
  heroMap.addEventListener("click", function(e){
    const t = nearest(e); if (!t) return;
    e.preventDefault(); location.href = url("/tappe/" + t.id + "/");
  });
  heroMap.addEventListener("mouseleave", function(){ current = null; hideTip(); });
  heroMap.addEventListener("focusin", function(e){ const g = e.target.closest(".city[data-id]"); if (g) showQ(g.dataset.id); });
  heroMap.addEventListener("focusout", hideTip);
}

/* ---------- report: sfoglia le pagine ---------- */
const fan = $id("fan");
if (fan){
  const cycle = function(){
    fan.querySelectorAll(".pg").forEach(function(p){
      const k = p.classList.contains("p0") ? 0 : p.classList.contains("p1") ? 1 : 2;
      p.classList.remove("p0", "p1", "p2"); p.classList.add("p" + ((k + 2) % 3));
    });
  };
  fan.addEventListener("click", cycle);
  fan.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); cycle(); } });
}

/* ---------- video della prima edizione (ospitato su lab.rankwit.ai) ---------- */
const vid = $id("vid"), vfb = $id("vid-fallback");
if (vid && vfb){
  const fail = function(){ vid.hidden = true; vfb.hidden = false; };
  vid.addEventListener("error", fail);
  setTimeout(function(){ if (vid.readyState === 0 && vid.networkState === 3) fail(); }, 4000);
}

/* ---------- menu su mobile ---------- */
const menuBtn = $id("menu-btn"), mnav = $id("mnav");
if (menuBtn && mnav){
  const setMenu = function(open){ mnav.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu"); };
  menuBtn.addEventListener("click", function(){ setMenu(mnav.hidden); });
  mnav.addEventListener("click", function(e){ if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !mnav.hidden){ setMenu(false); menuBtn.focus(); } });
  window.addEventListener("hashchange", function(){ setMenu(false); });
}

/* ---------- moduli ---------- */
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function campi(f, p){
  const $ = function(k){ return f.querySelector("#" + p + "-" + k); };
  const v = function(k){ const el = $(k); return (el ? el.value : "").trim(); };
  const setErr = function(k, msg){
    const el = $(k), er = $(k + "-err");
    if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (er){ er.textContent = msg || ""; er.hidden = !msg; if (el && msg) el.setAttribute("aria-describedby", p + "-" + k + "-err"); }
  };
  /* tolgono l'errore appena si corregge il campo */
  f.addEventListener("input", function(e){ if (e.target.getAttribute && e.target.getAttribute("aria-invalid") === "true") setErr(e.target.id.replace(p + "-", ""), ""); });
  f.addEventListener("change", function(e){ if (e.target.tagName === "SELECT" && e.target.getAttribute("aria-invalid") === "true") setErr(e.target.id.replace(p + "-", ""), ""); });
  return { $: $, v: v, setErr: setErr };
}
function errore(alert, err, cosa){
  alert.innerHTML = (err && err.code === "no_db")
    ? "Da questa pagina non è possibile inviare " + cosa + ". Scrivici a <code>" + MAIL + "</code>" + (cosa === "la richiesta" ? " indicando città e nome della struttura." : ".")
    : "Invio non riuscito. Riprova tra qualche minuto oppure scrivici a <code>" + MAIL + "</code>.";
  alert.hidden = false;
}

/* Avvisami / proponi una città */
function wireAvvisami(f){
  const p = f.dataset.p, pagina = f.dataset.pagina || "", originale = f.innerHTML;
  const c = campi(f, p);
  f.addEventListener("change", function(e){
    if (e.target.id !== p + "-citta" || e.target.tagName !== "SELECT") return;
    const altra = e.target.value === "__altra";
    c.$("altra-wrap").hidden = !altra;
    if (altra) c.$("altra").focus();
  });
  f.addEventListener("click", function(e){
    if (!e.target.closest || !e.target.closest("[data-again]")) return;
    f.innerHTML = originale;
    const n = c.$("nome"); if (n) n.focus();
  });
  f.addEventListener("submit", function(e){
    e.preventDefault();
    const sel = c.$("citta");
    const fisso = sel && sel.tagName === "INPUT" ? sel.value : "";
    let first = null;
    const mark = function(k, msg){ c.setErr(k, msg); if (msg && !first) first = c.$(k); };
    const altra = !fisso && sel && sel.value === "__altra";
    const citta = fisso || (altra ? c.v("altra") : (sel ? sel.value : ""));
    if (!fisso) mark("citta", sel && sel.value ? "" : "Scegli una città.");
    if (altra) mark("altra", c.v("altra") ? "" : "Scrivi la città che proponi.");
    mark("nome", c.v("nome") ? "" : "Scrivi nome e cognome.");
    mark("email", EMAIL_OK.test(c.v("email")) ? "" : "Scrivi un indirizzo email valido.");
    mark("struttura", c.v("struttura") ? "" : "Scrivi il nome della struttura.");
    mark("tipo", c.v("tipo") ? "" : "Scegli il tipo di struttura.");
    let sito = c.v("sito");
    if (sito && !/^https?:\/\//i.test(sito)) sito = "https://" + sito;
    mark("sito", !sito || /^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(sito) ? "" : "Controlla l'indirizzo del sito.");
    const priv = c.$("privacy").checked;
    c.$("privacy-wrap").classList.toggle("invalid", !priv);
    if (!priv && !first) first = c.$("privacy");
    const alert = c.$("alert");
    if (first){ alert.textContent = "Controlla i campi evidenziati."; alert.hidden = false; first.focus(); return; }
    alert.hidden = true;
    const proposta = !S.upcoming.some(function(t){ return t.citta.toLowerCase() === citta.toLowerCase(); });
    const rec = { tipo: proposta ? "proposta" : "avvisami", citta: citta, nome: c.v("nome"), email: c.v("email"),
                  struttura: c.v("struttura"), tipoStruttura: c.v("tipo"), sito: sito, telefono: c.v("tel"),
                  consensoPrivacy: true, pagina: pagina, inviatoIl: new Date().toISOString() };
    const btn = c.$("submit"); btn.disabled = true; btn.textContent = "Invio in corso";
    inviaRichiesta(rec).then(function(){
      const nome = esc(rec.nome.split(" ")[0]);
      f.innerHTML = '<div class="form-done" role="status" tabindex="-1"><span class="ok" aria-hidden="true">✓</span><h3>Richiesta inviata</h3><p>'
        + (proposta
            ? "Grazie, " + nome + ". Abbiamo registrato la tua proposta per " + esc(citta) + ". Se decidiamo di organizzare una tappa lì, ti scriviamo a " + esc(rec.email) + "."
            : "Grazie, " + nome + ". Ti scriviamo a " + esc(rec.email) + " quando apriamo le candidature per " + esc(laTappa(citta)) + ".")
        + '</p><button type="button" data-again>Invia un\'altra richiesta</button></div>';
      f.querySelector(".form-done").focus();
    }, function(err){
      btn.disabled = false; btn.innerHTML = 'Invia la richiesta <span class="arr" aria-hidden="true">→</span>';
      errore(alert, err, "la richiesta");
    });
  });
}

/* Contatti */
function wireContatti(f){
  const p = "ct", originale = f.innerHTML;
  const c = campi(f, p);
  f.addEventListener("click", function(e){
    if (!e.target.closest || !e.target.closest("[data-again]")) return;
    f.innerHTML = originale;
    const n = c.$("nome"); if (n) n.focus();
  });
  f.addEventListener("submit", function(e){
    e.preventDefault();
    let first = null;
    const mark = function(k, msg){ c.setErr(k, msg); if (msg && !first) first = c.$(k); };
    mark("nome", c.v("nome") ? "" : "Scrivi nome e cognome.");
    mark("email", EMAIL_OK.test(c.v("email")) ? "" : "Scrivi un indirizzo email valido.");
    mark("arg", c.v("arg") ? "" : "Scegli un argomento.");
    mark("msg", c.v("msg").length >= 5 ? "" : "Scrivi il messaggio.");
    const priv = c.$("privacy").checked;
    c.$("privacy-wrap").classList.toggle("invalid", !priv);
    if (!priv && !first) first = c.$("privacy");
    const alert = c.$("alert");
    if (first){ alert.textContent = "Controlla i campi evidenziati."; alert.hidden = false; first.focus(); return; }
    alert.hidden = true;
    const rec = { tipo: "contatto", argomento: c.v("arg"), messaggio: c.v("msg").slice(0, 4000), nome: c.v("nome"), email: c.v("email"),
                  struttura: c.v("org"), telefono: c.v("tel"), consensoPrivacy: true, pagina: "contatti", inviatoIl: new Date().toISOString() };
    const btn = c.$("submit"); btn.disabled = true; btn.textContent = "Invio in corso";
    inviaRichiesta(rec).then(function(){
      f.innerHTML = '<div class="form-done" role="status" tabindex="-1"><span class="ok" aria-hidden="true">✓</span><h3>Messaggio inviato</h3><p>Grazie, ' + esc(rec.nome.split(" ")[0]) + ". Ti rispondiamo a " + esc(rec.email) + '.</p><button type="button" data-again>Scrivi un altro messaggio</button></div>';
      f.querySelector(".form-done").focus();
    }, function(err){
      btn.disabled = false; btn.innerHTML = 'Invia il messaggio <span class="arr" aria-hidden="true">→</span>';
      errore(alert, err, "il messaggio");
    });
  });
}
document.querySelectorAll('form[data-form="avvisami"]').forEach(wireAvvisami);
document.querySelectorAll('form[data-form="contatti"]').forEach(wireContatti);

/* ---------- home: #avvisami sceglie la prossima tappa, #proponi apre "Un'altra città" ---------- */
function ancora(){
  const h = location.hash.slice(1), sel = $id("ask-citta");
  if (!sel || sel.tagName !== "SELECT") return;
  if (h === "avvisami" && !sel.value && S.NEXT){ sel.value = S.NEXT.citta; }
  if (h === "proponi"){
    sel.value = "__altra"; sel.dispatchEvent(new Event("change", { bubbles: true }));
    const a = $id("ask-altra"); if (a) setTimeout(function(){ a.focus({ preventScroll: true }); }, reduce ? 0 : 400);
  }
}
ancora();
window.addEventListener("hashchange", ancora);
/* un clic su un'ancora già aperta (es. #proponi due volte) rifà la stessa cosa */
document.addEventListener("click", function(e){
  const a = e.target.closest && e.target.closest('a[href*="#"]'); if (!a) return;
  const h = a.getAttribute("href"), i = h.indexOf("#");
  if (h.slice(i) !== location.hash) return;
  const path = h.slice(0, i);
  if (path && path.replace(/\/+$/, "") !== location.pathname.replace(/\/+$/, "")) return;
  const el = $id(location.hash.slice(1)); if (!el) return;
  e.preventDefault(); el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); ancora();
});

/* ---------- pagina della tappa: "Avvisami" porta al modulo e mette il cursore sul nome ---------- */
document.querySelectorAll('a[href="#tappa-form"]').forEach(function(a){
  a.addEventListener("click", function(){
    const n = $id("side-nome");
    if (n) setTimeout(function(){ n.focus({ preventScroll: true }); }, reduce ? 0 : 500);
  });
});
