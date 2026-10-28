/* /llms.txt: riassunto del sito in testo semplice, per gli assistenti AI (formato llmstxt.org).
   Si genera da solo a ogni pubblicazione, con le stesse tappe e le stesse domande delle pagine. */
import { TAPPE, SITO, MAIL, stati, oggiRoma, dove, low, dataEstesa } from "../lab/lib/tour.js";
import { FAQ } from "../lab/lib/faq.js";
import { SESSIONI, REPORT, PASSI, ASSISTENTI } from "../lab/lib/contenuti.js";

export const prerender = true;

export function GET(){
  const oggi = oggiRoma(), s = stati(oggi);
  const conData = TAPPE.filter((t) => t.dataISO), senzaData = TAPPE.filter((t) => !t.dataISO);
  const riga = (t) => {
    const stato = s.label(t).toLowerCase();
    const extra = t.intro
      ? `${t.edizione}. ${t.formato}, ${t.orario}. Sede: ${t.sede}. Posti: ${t.posti}${t.postiNota ? ", " + t.postiNota : ""}. Costo: ${t.costo}.`
      : (t.collab ? `In collaborazione con ${t.collab}. ` : "") + (s.isPast(t) ? "Resoconto da pubblicare." : "Sede e programma da pubblicare.");
    return `- [AI Visibility Lab ${dove(t)}, ${t.data}](${SITO}/tappe/${t.id}/): ${stato}. ${extra}`;
  };
  const testo = `# AI Visibility Lab

> Il tour di formazione di RankWit AI per hotel, strutture ricettive e destinazioni turistiche in Italia. In ogni tappa i partecipanti ricevono un report preparato a mano su come ${ASSISTENTI.slice(0, -1).join(", ")} e ${ASSISTENTI.at(-1)} descrivono la loro struttura, quali concorrenti citano al loro posto e cosa cambiare sul sito, e lo usano durante le sessioni di formazione sulla visibilità negli assistenti AI. Durata e formato dipendono dalla tappa.

Organizzato da RankWit AI (RANKWIT SRL SOCIETÀ BENEFIT, P. IVA 06209300877, ${MAIL}). La prima edizione si è tenuta a Firenze il 23 settembre 2026. Informazioni aggiornate al ${dataEstesa(oggi)}.

## Tappe

${conData.map(riga).join("\n")}
- Città possibili per le prossime tappe, con data e sede ancora da definire: ${senzaData.map((t) => t.citta).join(", ")}.
- Altre città: si possono proporre dal modulo nella home (${SITO}/#proponi).

## Pagine

- [Home del tour](${SITO}/): calendario delle tappe, contenuto del report, programma delle sessioni, domande frequenti e contatti.
- [Il Lab per gli hotel](${SITO}/hotel/): perché gli assistenti AI descrivono gli hotel con dati presi da OTA e recensioni vecchie, cosa analizza il report per un hotel, domande di esempio.
- [Il Lab per le destinazioni](${SITO}/destinations/): per DMO, consorzi, comuni e uffici turistici; errori degli assistenti AI sul territorio, fonti, cosa analizza il report.

## Come si partecipa

${PASSI.map((p, i) => `${i + 1}. ${p.t} (${p.big} ${p.unit}): ${low(p.p)}`).join("\n")}

## Cosa c'è nel report

${REPORT.map((r) => `- ${r.t}: ${low(r.d)}`).join("\n")}

Il valore del primo audit è di 500 €, incluso nel biglietto di ogni partecipante. Il report si basa sul questionario e su ciò che gli assistenti AI dicono pubblicamente della struttura: non servono accessi al sito.

## Programma delle sessioni

Gli argomenti del Lab. Quali si affrontano, e per quanto tempo, dipende dal formato della tappa.

${SESSIONI.map((x) => `${+x.n}. ${x.t}: ${low(x.d)} Si porta a casa: ${low(x.out)}`).join("\n")}

## Domande frequenti

${FAQ.map((f) => `### ${f.q}\n\n${f.a.replace("con il modulo in questa pagina", "con il modulo nella home del sito")}`).join("\n\n")}

## Contatti

- Email: ${MAIL}
- Modulo contatti: ${SITO}/#contatti
- Avvisami per le prossime tappe: ${SITO}/#avvisami

## Optional

- [RankWit AI](https://www.rankwit.ai/it): la piattaforma per misurare la visibilità negli assistenti AI.
- [Report a distanza](https://try.rankwit.ai/report-gratuito): per chi non vuole aspettare una tappa.
- [LinkedIn di RankWit AI](https://www.linkedin.com/company/rankwit-ai/)
`;
  return new Response(testo, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
