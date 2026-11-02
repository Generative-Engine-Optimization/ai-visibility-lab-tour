/* Consenso ai cookie. La scelta sta in localStorage ("rw-consenso", 6 mesi) e viene passata a Google Tag Manager
   con il Consent Mode (gtag('consent','update')) e con l'evento "consenso" nel dataLayer.
   Il valore predefinito (tutto negato) è nello script in testa a Base.astro, prima che parta Tag Manager. */
const CHIAVE = "rw-consenso";
const GIORNI = 180;

export function leggiConsenso(){
  try {
    const c = JSON.parse(localStorage.getItem(CHIAVE));
    if (c && c.data && Date.now() - Date.parse(c.data) <= GIORNI * 864e5) return c;
  } catch(e){}
  return null;
}

function applica(c){
  const m = c.marketing ? "granted" : "denied";
  try { if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: c.statistiche ? "granted" : "denied", ad_storage: m, ad_user_data: m, ad_personalization: m }); } catch(e){}
  try { (window.dataLayer = window.dataLayer || []).push({ event: "consenso", consenso_statistiche: !!c.statistiche, consenso_marketing: !!c.marketing }); } catch(e){}
}

function salva(statistiche, marketing){
  const c = { versione: 1, statistiche: !!statistiche, marketing: !!marketing, data: new Date().toISOString() };
  try { localStorage.setItem(CHIAVE, JSON.stringify(c)); } catch(e){}
  applica(c);
  return c;
}

export function avviaConsenso(){
  const box = document.getElementById("ck"); if (!box) return;
  const opts = document.getElementById("ck-opts"), custom = document.getElementById("ck-custom");
  const stat = document.getElementById("ck-stat"), mkt = document.getElementById("ck-mkt");
  let ultimo = null;

  const mostra = function(conOpzioni){
    const c = leggiConsenso();
    if (stat) stat.checked = !!(c && c.statistiche);
    if (mkt) mkt.checked = !!(c && c.marketing);
    apriOpzioni(!!conOpzioni);
    ultimo = document.activeElement;
    box.hidden = false;
    const primo = box.querySelector("button"); if (primo) primo.focus({ preventScroll: true });
  };
  const chiudi = function(){
    box.hidden = true;
    if (ultimo && ultimo.focus) ultimo.focus({ preventScroll: true });
  };
  const apriOpzioni = function(aperte){
    if (!opts || !custom) return;
    opts.hidden = !aperte;
    custom.setAttribute("aria-expanded", String(aperte));
    custom.dataset.ck = aperte ? "salva" : "personalizza";
    custom.textContent = aperte ? "Salva le preferenze" : "Personalizza";
  };

  box.addEventListener("click", function(e){
    const b = e.target.closest("[data-ck]"); if (!b) return;
    const cosa = b.dataset.ck;
    if (cosa === "personalizza"){ apriOpzioni(true); if (stat) stat.focus(); return; }
    if (cosa === "tutti") salva(true, true);
    else if (cosa === "nessuno") salva(false, false);
    else if (cosa === "salva") salva(stat && stat.checked, mkt && mkt.checked);
    chiudi();
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !box.hidden){ salva(false, false); chiudi(); } });

  /* "Preferenze cookie" nel footer e nella cookie policy riapre il banner con le opzioni */
  document.querySelectorAll("[data-ck-apri]").forEach(function(a){
    a.addEventListener("click", function(e){ e.preventDefault(); mostra(true); });
  });

  if (!leggiConsenso()) mostra(false);
}
