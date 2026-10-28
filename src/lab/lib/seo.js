/* Dati strutturati (schema.org, JSON-LD) condivisi dalle pagine.
   Gli indirizzi puntano sempre al sito vero (lab.rankwit.ai), anche nell'anteprima. */
import { SITO, MAIL, dove, low } from "./tour.js";
import { ogTappa } from "./og.js";

export const ORG_ID = "https://www.rankwit.ai/#organization";
export const SITE_ID = SITO + "/#website";
export const TOUR_ID = SITO + "/#tour";

export const ORGANIZZAZIONE = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "RankWit AI",
  legalName: "RANKWIT SRL SOCIETÀ BENEFIT",
  url: "https://www.rankwit.ai/",
  logo: SITO + "/assets/rankwit-symbol.png",
  email: MAIL,
  vatID: "IT06209300877",
  sameAs: ["https://www.linkedin.com/company/rankwit-ai/"]
};

export const SITO_WEB = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITO + "/",
  name: "AI Visibility Lab",
  inLanguage: "it-IT",
  publisher: { "@id": ORG_ID }
};

export function pagina({ path, titolo, descrizione, immagine }){
  return {
    "@type": "WebPage",
    "@id": SITO + path + "#pagina",
    url: SITO + path,
    name: titolo,
    description: descrizione,
    inLanguage: "it-IT",
    isPartOf: { "@id": SITE_ID },
    primaryImageOfPage: immagine ? { "@type": "ImageObject", url: immagine } : undefined
  };
}

export function briciole(voci){
  return {
    "@type": "BreadcrumbList",
    itemListElement: voci.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.nome, item: SITO + v.path }))
  };
}

/* fuso orario italiano: +02:00 dall'ultima domenica di marzo all'ultima di ottobre, altrimenti +01:00 */
function offsetRoma(iso){
  const [y, m, d] = iso.split("-").map(Number);
  const ultimaDomenica = (mese) => { const x = new Date(Date.UTC(y, mese + 1, 0)); return x.getUTCDate() - x.getUTCDay(); };
  const dopoInizio = m > 3 || (m === 3 && d >= ultimaDomenica(2));
  const primaFine = m < 10 || (m === 10 && d < ultimaDomenica(9));
  return dopoInizio && primaFine ? "+02:00" : "+01:00";
}
function orari(t){
  const m = /(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/.exec(t.orario || "");
  if (!m) return { start: t.dataISO, end: t.dataISO };
  const z = offsetRoma(t.dataISO), p = (h) => h.padStart(5, "0");
  return { start: `${t.dataISO}T${p(m[1])}:00${z}`, end: `${t.dataISO}T${p(m[2])}:00${z}` };
}

export function evento(t, { url, immagine, descrizione }){
  const o = orari(t);
  const ev = {
    "@type": "EducationEvent",
    "@id": url + "#evento",
    name: "AI Visibility Lab " + dove(t) + (t.edizione ? " · " + t.edizione : ""),
    description: descrizione,
    url,
    image: immagine ? [immagine] : undefined,
    startDate: o.start,
    endDate: o.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "it-IT",
    location: {
      "@type": "Place",
      name: t.luogo || t.sede || t.citta,
      address: {
        "@type": "PostalAddress",
        streetAddress: t.indirizzo || undefined,
        addressLocality: t.comune || t.citta,
        addressRegion: t.regione || undefined,
        addressCountry: "IT"
      }
    },
    organizer: [{ "@id": ORG_ID }].concat(t.collab ? [{ "@type": "Organization", name: t.collab }] : []),
    superEvent: { "@id": TOUR_ID },
    audience: { "@type": "Audience", audienceType: "Hotel, strutture ricettive, DMO e destinazioni turistiche" },
    about: ["Visibilità negli assistenti AI", "Generative Engine Optimization", "Marketing turistico"]
  };
  if (t.prezzo){
    ev.offers = Object.assign({ "@type": "AggregateOffer", priceCurrency: "EUR", url }, t.prezzo);
    if (t.ivaEsclusa) ev.offers.priceSpecification = { "@type": "PriceSpecification", priceCurrency: "EUR", valueAddedTaxIncluded: false };
  }
  if (t.gratuito){ ev.isAccessibleForFree = true; ev.offers = { "@type": "Offer", price: "0", priceCurrency: "EUR", url }; }
  return ev;
}

/* la serie di eventi (il tour). eventi: le tappe con data, complete (home) o solo come riferimento (altre pagine) */
export function serie(tappe, completo = false){
  return {
    "@type": "EventSeries",
    "@id": TOUR_ID,
    name: "AI Visibility Lab Tour",
    description: "Il tour di RankWit AI per hotel e destinazioni: incontri di formazione in diverse città italiane sulla visibilità negli assistenti AI, con un report preparato sulla struttura di ogni partecipante.",
    url: SITO + "/",
    image: [SITO + "/og/tour.png"],
    organizer: { "@id": ORG_ID },
    inLanguage: "it-IT",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Country", name: "Italia" },
    subEvent: tappe.filter((t) => t.dataISO).map((t) => (completo ? eventoTappa(t) : { "@id": SITO + "/tappe/" + t.id + "/#evento" }))
  };
}

/* descrizione breve di una tappa (dati strutturati e meta description) */
export function descrTappa(t){
  if (t.intro) return t.intro[0];
  return "Tappa dell'AI Visibility Lab " + dove(t) + (t.dataISO ? " il " + t.data : "") + (t.collab ? ", in collaborazione con " + t.collab : "")
    + ": formazione sulla visibilità negli assistenti AI per hotel, strutture ricettive e destinazioni.";
}
/* meta description della pagina di una tappa (non dipende dalla data di oggi, così resta valida anche dopo la tappa) */
export function metaTappa(t){
  if (t.intro) return t.edizione + " dell'AI Visibility Lab " + dove(t) + ", " + t.data + ": " + low(t.formato) + " · " + t.sedeBreve + ". Programma e partner.";
  if (!t.dataISO) return t.citta + " è tra le città in cui pensiamo di portare l'AI Visibility Lab. Data e sede da definire: lascia i tuoi dati per essere avvisato.";
  return "AI Visibility Lab " + dove(t) + ", " + t.data + (t.collab ? ", in collaborazione con " + t.collab : "") + ": formazione sulla visibilità negli assistenti AI per hotel e destinazioni.";
}
export function eventoTappa(t){
  const url = SITO + "/tappe/" + t.id + "/";
  return evento(t, { url, immagine: SITO + ogTappa(t.id), descrizione: descrTappa(t) });
}

export function faqPage(faq, path){
  return {
    "@type": "FAQPage",
    "@id": SITO + path + "#faq",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  };
}

/* toglie i campi vuoti prima di scrivere il JSON-LD */
export function grafo(nodi){
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodi }, (k, v) => (v === undefined ? undefined : v));
}
