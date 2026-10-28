/* Immagine per i social di una tappa (public/og/<id>.png, creata con "npm run og").
   Se non c'è ancora si usa quella del tour. Solo per la costruzione delle pagine, non per il browser. */
import { existsSync } from "node:fs";
import { join } from "node:path";

export function ogTappa(id){
  return existsSync(join(process.cwd(), "public/og", id + ".png")) ? "/og/" + id + ".png" : "/og/tour.png";
}
