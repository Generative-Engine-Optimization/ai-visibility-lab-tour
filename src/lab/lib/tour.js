/* Dati e logica del tour, usati sia per costruire le pagine (Astro) sia nel browser.
   Per aggiungere o modificare una tappa basta cambiare l'elenco TAPPE qui sotto. */

export const MAIL = "info@rankwit.ai";
export const SITO = "https://lab.rankwit.ai";

/* TAPPE, in ordine di percorso.
   - dataISO: giorno della tappa, AAAA-MM-GG. Dal giorno dopo la tappa risulta "Conclusa" da sola.
     Se la tappa dura più giorni, usa l'ultimo giorno.
   - Senza dataISO la tappa risulta "Prossimamente". Facoltativo: periodo (es. "Primavera 2027").
   - lat e lon: posizione sulla mappa. Per i nomi lunghi: breve (etichetta sulla mappa) e tabellone (massimo 11 caratteri).
   - Una tappa senza "intro" mostra la pagina "Informazioni disponibili a breve" con il modulo Avvisami.
   - collab: chi organizza la tappa con noi, scritto come "In collaborazione con ..." nel tabellone e nella pagina della tappa.
   - regione, e quando sono noti luogo (nome della sede), indirizzo e comune: finiscono nei dati strutturati
     dell'evento, letti da Google e dagli assistenti AI. Senza comune si usa il nome della città.
   - prezzo { lowPrice, highPrice } in euro, oppure gratuito:true, se il costo è noto. ivaEsclusa:true se il prezzo è + IVA.
   - prep:"in" per le zone (in Casentino, in Garfagnana); senza, si scrive "a Firenze".
   Firenze e Rimini: dati da lab.rankwit.ai. Le città senza data sono segnaposto. */
export const TAPPE = [
  { id:"firenze", citta:"Firenze", regione:"Toscana", prezzo:{ lowPrice:"249", highPrice:"349" }, ivaEsclusa:true, edizione:"Travel Edition", dataISO:"2026-09-23",
    orario:"dalle 10:00 alle 16:00",
    formato:"Giornata intera", sede:"Innovation Center di Fondazione CR Firenze", sedeBreve:"Innovation Center, Fondazione CR Firenze",
    posti:"60", costo:"Da 249 a 349 € + IVA", lat:43.7696, lon:11.2558,
    domanda:"migliori hotel a Firenze",
    intro:["La prima edizione del Lab si è svolta il 23 settembre 2026 all'Innovation Center di Fondazione CR Firenze, ed era aperta a hotel, DMO, tour operator e travel brand.",
           "Ogni partecipante ha ricevuto il proprio report alle 10:45. Il resto della giornata è stato dedicato a tre laboratori pratici, durante i quali le modifiche al sito venivano pubblicate in giornata."],
    programma:"La giornata",
    agenda:[{ora:"10:00",t:"Inizio dei lavori",d:""},{ora:"10:45",t:"Consegna dei report",d:"Uno per struttura, stampato"},{ora:"",t:"Tre laboratori pratici",d:"Le modifiche al sito si pubblicano in giornata"},{ora:"16:00",t:"Chiusura",d:""}],
    partner:[{nome:"Nana Bianca Startup Studio",ruolo:"sede",logo:"nana-bianca"},{nome:"Stellar",ruolo:"pranzo",logo:"stellar"},{nome:"Officina Turistica",ruolo:"media partner",logo:"officina-turistica"},{nome:"Teamwork Hospitality",ruolo:"formazione",logo:"teamwork-hospitality"}], link:"https://lab.rankwit.ai/firenze" },
  { id:"rimini", citta:"Rimini", regione:"Emilia-Romagna", luogo:"Palacongressi di Rimini", indirizzo:"Via della Fiera 23", gratuito:true, edizione:"Hospitality Day Edition", dataISO:"2026-10-13",
    orario:"dalle 15:00 alle 16:30",
    formato:"90 minuti, tre sessioni", sede:"Palacongressi di Rimini, Via della Fiera 23, durante Hospitality Day", sedeBreve:"Palacongressi, durante Hospitality Day",
    posti:"30", postiNota:"uno per struttura", costo:"Gratuito, su candidatura", lat:44.0678, lon:12.5695,
    domanda:"hotel per famiglie a Rimini vicino al mare",
    intro:["Il 13 ottobre 2026 il Lab si è svolto al Palacongressi di Rimini, durante Hospitality Day. I posti erano trenta, uno per struttura, assegnati su candidatura.",
           "I report sono stati consegnati alle 14:45. Dalle 15:00 alle 16:30 si sono tenute tre sessioni da mezz'ora, ognuna condotta da una persona del team RankWit."],
    programma:"90 minuti, dalle 15:00 alle 16:30",
    agenda:[{ora:"14:45",t:"Accoglienza e consegna dei report",d:""},{ora:"15:00",t:"Cosa è cambiato, e cosa funziona ancora",d:"Mirko Lalli, 30 minuti"},{ora:"15:30",t:"Mettere in ordine quello che il sito deve dire",d:"Dario Valastro, 30 minuti"},{ora:"16:00",t:"Le domande su cui vuoi essere misurato",d:"Davide Filiaggi, 30 minuti"},{ora:"16:30",t:"Chiusura",d:"Hospitality Day prosegue"}],
    porta:[{quando:"Alle 14:45",t:"Il report sulla propria struttura",p:"Come gli assistenti AI descrivono la struttura e i tre concorrenti indicati.",tag:"500 € di listino"},
           {quando:"Negli allegati",t:"I template compilati",p:"Dati strutturati, llms.txt e regole per i bot AI, pronti da inserire nel sito.",tag:"3 file"},
           {quando:"Alle 16:30",t:"Le priorità",p:"La pagina da riscrivere, l'intervento tecnico da richiedere, le domande da monitorare.",tag:"1 pagina"},
           {quando:"Nei 30 giorni successivi",t:"Un mese di RankWit",p:"Misurazioni settimanali e confronto con i concorrenti, senza rinnovo automatico.",tag:"Incluso"}],
    partner:[{nome:"Hospitality Day",ruolo:"evento",logo:"hospitality-day"},{nome:"Officina Turistica",ruolo:"media partner",logo:"officina-turistica"},{nome:"Teamwork Hospitality",ruolo:"formazione",logo:"teamwork-hospitality"}],
  },
  /* Prossime tappe con data. Pagina "Informazioni disponibili a breve" finché non si aggiungono intro, sede e programma. */
  { id:"casentino", citta:"Casentino", prep:"in", regione:"Toscana", collab:"ANCI Toscana", dataISO:"2026-10-27", lat:43.6966, lon:11.8146, domanda:"dove dormire in Casentino vicino a Camaldoli" },
  { id:"pistoia", citta:"Pistoia", regione:"Toscana", collab:"ANCI Toscana", dataISO:"2026-10-30", lat:43.9330, lon:10.9170, domanda:"hotel per famiglie sulla Montagna Pistoiese" },
  { id:"follonica", citta:"Follonica", regione:"Toscana", collab:"ANCI Toscana", dataISO:"2026-11-23", lat:42.9187, lon:10.7616, domanda:"hotel a Follonica sul mare con spiaggia privata" },
  { id:"garfagnana", citta:"Garfagnana", prep:"in", regione:"Toscana", collab:"ANCI Toscana", dataISO:"2026-12-03", lat:44.1093, lon:10.4110, domanda:"agriturismo in Garfagnana per un weekend" },
  /* Prossimamente: città senza data (SEGNAPOSTO). Per fissarle, aggiungi dataISO. */
  { id:"bologna", citta:"Bologna", regione:"Emilia-Romagna", lat:44.4949, lon:11.3426, domanda:"hotel a Bologna vicino alla fiera" },
  { id:"milano", citta:"Milano", regione:"Lombardia", lat:45.4642, lon:9.1900, domanda:"hotel vicino a Fiera Milano Rho" },
  { id:"torino", citta:"Torino", regione:"Piemonte", lat:45.0703, lon:7.6869, domanda:"hotel a Torino vicino a Porta Nuova" },
  { id:"venezia", citta:"Venezia", regione:"Veneto", lat:45.4408, lon:12.3155, domanda:"hotel a Venezia con vista sul Canal Grande" },
  { id:"roma", citta:"Roma", regione:"Lazio", lat:41.9028, lon:12.4964, domanda:"dove dormire a Roma vicino a San Pietro" },
  { id:"napoli", citta:"Napoli", regione:"Campania", lat:40.8518, lon:14.2681, domanda:"hotel a Napoli vicino al porto per i traghetti" }
];

export const TIPI = ["Hotel balneare o stagionale","Hotel di città o business","Gruppo o catena","Struttura extralberghiera","DMO o ente del turismo","Tour operator o travel brand"];
export const ARGOMENTI = ["Informazioni sul Lab", "Partecipare a una tappa", "Organizzare una tappa nel mio territorio", "Collaborazioni e sponsor", "Stampa", "Altro"];

/* vecchi indirizzi delle tappe: la tappa di Pistoia si chiamava San Marcello */
export const ALIAS = { "san-marcello": "pistoia" };

export const MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const MESI3 = ["GEN","FEB","MAR","APR","MAG","GIU","LUG","AGO","SET","OTT","NOV","DIC"];
const STAGIONI = {Inverno:"INV",Primavera:"PRI",Estate:"EST",Autunno:"AUT"};

/* "a Firenze", "in Casentino" */
export function dove(t){ return (t.prep || "a") + " " + t.citta; }
export function low(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
export function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }

/* oggi, nel fuso orario italiano, come AAAA-MM-GG */
export function oggiRoma(d){
  d = d || new Date();
  try { return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(d); }
  catch(e){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
}

/* proiezione della mappa: da longitudine e latitudine a coordinate del disegno (errore < 0,1 px) */
const FIT = {"cx": [291.348272, 43.576868, -0.000137, 1.3e-05, -0.686172, -7e-06, 0.00028, 2.4e-05, -0.006658, -4e-06], "cy": [318.19379, 0.000265, -58.637681, -0.253124, -3.3e-05, 0.002264, 6e-06, -0.001061, -3.1e-05, 3e-06]};
export function proj(lon, lat){
  var a = lon - 12.6, b = lat - 42, T = [1, a, b, a*a, a*b, b*b, a*a*a, a*a*b, a*b*b, b*b*b], x = 0, y = 0;
  for (var k = 0; k < 10; k++){ x += FIT.cx[k]*T[k]; y += FIT.cy[k]*T[k]; }
  return [+x.toFixed(1), +y.toFixed(1)];
}
function gradi(v, pos, neg){ return Math.abs(v).toFixed(4).replace(".", ",") + "° " + (v >= 0 ? pos : neg); }

/* campi calcolati che non dipendono dal giorno */
TAPPE.forEach(function(t){
  t.pt = proj(t.lon, t.lat);
  t.coord = gradi(t.lat, "N", "S") + " · " + gradi(t.lon, "E", "O");
  if (t.dataISO){
    var q = t.dataISO.split("-");
    t.data = (+q[2]) + " " + MESI[+q[1]-1] + " " + q[0];
    t.dataCorta = (+q[2]) + " " + MESI[+q[1]-1];
    t.board = q[2] + " " + MESI3[+q[1]-1];
  } else {
    t.data = t.periodo || "Data da definire";
    t.dataCorta = t.periodo ? low(t.periodo) : "prossimamente";
    var w = (t.periodo || "").split(" ");
    t.board = (w.length === 2 && STAGIONI[w[0]]) ? STAGIONI[w[0]] + " " + w[1].slice(-2) : "--";
  }
});
export const BY = {};
TAPPE.forEach(function(t){ BY[t.id] = t; });

/* stato delle tappe in un certo giorno: conclusa, oggi, in programma, prossimamente */
export function stati(oggi){
  var isPast = function(t){ return !!t.dataISO && oggi > t.dataISO; };
  var isToday = function(t){ return t.dataISO === oggi; };
  var upcoming = TAPPE.filter(function(t){ return !isPast(t); });
  var NEXT = upcoming[0] || null;
  var cls = function(t){ return isPast(t) ? "past" : (t === NEXT ? "next" : (t.dataISO ? "sched" : "tbd")); };
  var label = function(t){ return isPast(t) ? "Conclusa" : (isToday(t) ? "Oggi" : (t.dataISO ? "In programma" : "Prossimamente")); };
  var stCls = function(t){ return isPast(t) ? "st-conclusa" : (t === NEXT || isToday(t) ? "st-next" : "st-tbd"); };
  /* da chiuso il tabellone mostra le prime due tappe in programma e la prima "Prossimamente" */
  var shown = {};
  upcoming.filter(function(t){ return t.dataISO; }).slice(0, 2).forEach(function(t){ shown[t.id] = 1; });
  upcoming.filter(function(t){ return !t.dataISO; }).slice(0, 1).forEach(function(t){ shown[t.id] = 1; });
  if (!Object.keys(shown).length) TAPPE.forEach(function(t){ shown[t.id] = 1; });
  return { oggi: oggi, isPast: isPast, isToday: isToday, upcoming: upcoming, NEXT: NEXT, cls: cls, label: label, stCls: stCls, shown: shown };
}

/* testi della pagina di una tappa senza programma, secondo lo stato */
export function testiAttesa(t, s){
  if (s.isPast(t)) return {
    titolo: "Tappa conclusa il " + t.data,
    testo: "Il resoconto della tappa " + (t.prep ? "in " : "di ") + t.citta + " sarà pubblicato su questa pagina. Lascia i tuoi dati e ti avvisiamo quando apriamo le candidature della prossima."
  };
  if (t.dataISO) return {
    titolo: "Informazioni disponibili a breve",
    testo: "La tappa " + (t.prep ? "in " : "di ") + t.citta + (s.isToday(t) ? " è oggi, " : " è in programma il ") + t.data + ". Sede e programma saranno pubblicati su questa pagina. Lascia i tuoi dati e ti avvisiamo appena apriamo le candidature."
  };
  return {
    titolo: "Informazioni disponibili a breve",
    testo: "Data, sede e programma della tappa " + (t.prep ? "in " : "di ") + t.citta + " saranno pubblicati su questa pagina. Lascia i tuoi dati e ti avvisiamo appena apriamo le candidature."
  };
}

/* altri testi della pagina di una tappa che cambiano quando la tappa si conclude
   (la pagina li scrive per il giorno della pubblicazione, il browser li aggiorna se serve) */
export function fraseTappa(t, s){
  const con = t.collab ? ", in collaborazione con " + t.collab : "";
  if (!t.dataISO) return t.citta + " è tra le città in cui pensiamo di portare l'AI Visibility Lab: data e sede sono ancora da definire.";
  return "Il " + t.data + " l'AI Visibility Lab " + (s.isPast(t) ? "ha fatto" : "fa") + " tappa " + dove(t) + con + ".";
}
export function doveTappa(t, s){
  return t.citta + (t.regione ? ", " + t.regione : "") + (s.isPast(t) ? "" : " · sede da definire");
}
export function titoloMateriali(t, s){ return s.isPast(t) ? "Cosa hanno ricevuto i partecipanti" : "Cosa ricevono i partecipanti"; }
/* "la tappa di Pistoia", "la tappa in Casentino" (anche per città scritte in un modulo) */
export function laTappa(citta){
  const t = TAPPE.find(function(x){ return x.citta.toLowerCase() === String(citta).toLowerCase(); });
  return "la tappa " + (t && t.prep ? "in " : "di ") + citta;
}
/* 28 ottobre 2026 */
export function dataEstesa(iso){ const q = iso.split("-"); return (+q[2]) + " " + MESI[+q[1]-1] + " " + q[0]; }

/* una tappa ha una pagina completa quando ha intro, sede e programma */
export function completa(t){ return !!t.intro; }
/* le tappe senza data non vanno indicizzate: data e sede non ci sono ancora */
export function indicizzabile(t){ return !!t.dataISO; }
