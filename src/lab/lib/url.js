/* indirizzi interni: funzionano sia su lab.rankwit.ai sia nell'anteprima su GitHub Pages (che sta in una sottocartella) */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
export function u(path){ return BASE + (path.startsWith("/") ? path : "/" + path); }
export const ANTEPRIMA = import.meta.env.BASE_URL !== "/" && import.meta.env.BASE_URL !== "";
