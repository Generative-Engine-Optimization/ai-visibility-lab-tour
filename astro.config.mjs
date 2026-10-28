import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { TAPPE, ALIAS } from "./src/lab/lib/tour.js";

/* ANTEPRIMA=1 costruisce la copia per GitHub Pages (sotto /ai-visibility-lab-tour/, non indicizzata).
   Senza variabile si costruisce il sito vero per lab.rankwit.ai. */
const ANTEPRIMA = process.env.ANTEPRIMA === "1";
const BASE = ANTEPRIMA ? "/ai-visibility-lab-tour" : "";

/* pagine da non mettere nella sitemap: tappe senza data (hanno solo il modulo Avvisami e non sono indicizzate) */
const SENZA_SITEMAP = TAPPE.filter((t) => !t.dataISO).map((t) => `/tappe/${t.id}/`);

/* vecchi indirizzi delle tappe (la tappa di Pistoia si chiamava San Marcello) */
const REDIRECTS = Object.fromEntries(Object.entries(ALIAS).map(([vecchio, id]) => [`/tappe/${vecchio}/`, `${BASE}/tappe/${id}/`]));

export default defineConfig({
  site: ANTEPRIMA ? "https://gherybeans-rankwit.github.io" : "https://lab.rankwit.ai",
  base: BASE || "/",
  trailingSlash: "always",
  build: { format: "directory" },
  redirects: REDIRECTS,
  integrations: ANTEPRIMA ? [] : [
    sitemap({ filter: (page) => !SENZA_SITEMAP.some((p) => page.endsWith(p)) })
  ]
});
