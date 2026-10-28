/* Testi usati in più pagine (home, pagine delle tappe, llms.txt). */

/* le quattro sessioni della giornata */
export const SESSIONI = [
  { n: "01", t: "Dove sta andando il turismo", chips: ["Viaggiatori", "Ricerca AI", "Industria"],
    d: "Come stanno cambiando le scelte dei viaggiatori, come si muovono motori di ricerca, assistenti AI, OTA e catene, e cosa vuol dire per chi lavora nel turismo.",
    out: "Un quadro chiaro di cosa sta cambiando e di cosa aspettarsi nei prossimi anni." },
  { n: "02", t: "Come ragionano gli assistenti AI", chips: ["Fonti", "Citazioni", "SEO e AI"],
    d: "Da quali fonti prendono le informazioni, perché citano alcune strutture e non altre, e quali attività di marketing restano utili e quali contano meno.",
    out: "I criteri per capire cosa conta oggi e dove investire tempo e budget." },
  { n: "03", t: "Il sito, letto da un'AI", chips: ["Contenuti", "Dati strutturati", "llms.txt"],
    d: "La parte tecnica spiegata senza codice: contenuti che rispondono alle domande degli ospiti, dati strutturati, llms.txt e accesso dei bot AI.",
    out: "Una lista di controllo da applicare al tuo sito o da girare a chi lo gestisce." },
  { n: "04", t: "Misurare nel tempo", chips: ["Domande", "Quota di voce", "Report"],
    d: "Come si misura la visibilità AI: quali domande tenere d'occhio, come leggere la quota di voce e ogni quanto controllare. Si chiude guardando i report.",
    out: "Un metodo per seguire la tua visibilità nel tempo, con il report come punto di partenza." }
];

/* cosa è previsto in ogni tappa */
export const PREVISTO = [
  { quando: "Prima", t: "Candidatura e questionario", p: "Online, senza accessi al sito." },
  { quando: "In sala", t: "Il report sulla tua struttura", p: "Con il confronto con tre concorrenti scelti da te.", tag: "500 € di listino" },
  { quando: "Negli allegati", t: "Template già compilati", p: "Da inserire nel sito o da inviare a chi lo gestisce." },
  { quando: "Durante la tappa", t: "Le sessioni di formazione", p: "Dal quadro generale del turismo agli strumenti per misurare la visibilità AI. Durata e orari dipendono dal formato." }
];

/* le parti del report */
export const REPORT = [
  { t: "Quota di voce", d: "Quante volte gli assistenti citano la tua struttura rispetto ai concorrenti, assistente per assistente." },
  { t: "Concorrenti reali", d: "Le strutture che gli assistenti AI citano davvero nelle risposte sulla tua zona, anche quando non sono quelle che consideri concorrenti." },
  { t: "Punti forti e deboli", d: "I temi in cui gli assistenti ti citano più dei concorrenti e quelli in cui ti citano meno: posizione, servizi, camere, prezzo, tipo di ospite." },
  { t: "Contenuti", d: "Se le pagine del sito rispondono alle domande che gli ospiti fanno prima di prenotare." },
  { t: "Aspetti tecnici", d: "Sitemap, redirect, pagine duplicate, versioni in lingua e velocità del sito." },
  { t: "Autorevolezza", d: "Quali siti, guide e portali parlano della tua struttura e quanto contano." },
  { t: "Allegati", d: "Dati strutturati già compilati, file llms.txt e regole per i bot AI, da passare a chi gestisce il sito." }
];

/* i passi per partecipare */
export const PASSI = [
  { big: "2", unit: "minuti", t: "Candidatura", p: "Indichi struttura, sito, zona e tre concorrenti. Ti rispondiamo entro due giorni lavorativi." },
  { big: "10", unit: "minuti", t: "Questionario", p: "Lo compili online quando ti è comodo. Non chiediamo accessi al sito né ai tuoi strumenti." },
  { big: "1", unit: "report", t: "Il giorno della tappa", p: "Trovi il report stampato al tuo posto e lo usi durante le sessioni come esempio concreto sulla tua struttura." }
];

/* gli assistenti AI analizzati */
export const ASSISTENTI = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI Overviews"];
