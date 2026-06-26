// Map keyword (case-insensitive) → portrait asset URL.
// First keyword that appears in a DJ string wins.
import damianlica from "@/assets/djs/damianlica.webp.asset.json";
import nfrtiti from "@/assets/djs/nfrtiti1-2.webp.asset.json";
import tijax12 from "@/assets/djs/tijax-12.webp.asset.json";
import tijax13 from "@/assets/djs/tijax-13.webp.asset.json";
import valeron from "@/assets/djs/valeron7-3.webp.asset.json";
import yamila from "@/assets/djs/yamilamorales-14.webp.asset.json";
import dennisRenatta from "@/assets/djs/dennislouvrarenatta.webp.asset.json";
import lannkaAgoria from "@/assets/djs/lannkaagoriakaytek.webp.asset.json";
import satori from "@/assets/djs/satori.webp.asset.json";
import blanca from "@/assets/djs/blancapuebla-4.webp.asset.json";
import bedouin from "@/assets/djs/bedouinatsou1_1004b030f2d01cc69a6fb2f.png.webp.asset.json";
import ahmedSpins from "@/assets/djs/meahmedspinsb2bankhoi_2004b03202d01cc69b1414f.png.webp.asset.json";
import peggyGou from "@/assets/djs/peggygou-2_2004b03202d01cc699d7833.png.webp.asset.json";
import thievery from "@/assets/djs/thieverycorporation_d04b030d2d01cc6996f073.png.webp.asset.json";
import alecMonopoly from "@/assets/djs/alec_monopoly.jpeg.asset.json";
import mahmutOrhan from "@/assets/djs/mahmut_orhan.png.avif.asset.json";
import staffordBros from "@/assets/djs/staffod_brothers.jpeg.asset.json";
import guyGerber from "@/assets/djs/guygerber11.jpg.webp.asset.json";

// Order matters: more specific first.
const portraitMap: { keywords: string[]; url: string }[] = [
  { keywords: ["bedouin", "atsou"], url: bedouin.url },
  { keywords: ["ahmed spins", "ankhoï", "ankhoi", "&me"], url: ahmedSpins.url },
  { keywords: ["peggy gou"], url: peggyGou.url },
  { keywords: ["thievery corporation", "lannka invites thievery"], url: thievery.url },
  { keywords: ["alec monopoly"], url: alecMonopoly.url },
  { keywords: ["mahmut orhan"], url: mahmutOrhan.url },
  { keywords: ["stafford"], url: staffordBros.url },
  { keywords: ["guy gerber"], url: guyGerber.url },
  { keywords: ["damian lazarus", "lica"], url: damianlica.url },
  { keywords: ["dennis louvra", "renatta"], url: dennisRenatta.url },
  { keywords: ["lannka invites agoria", "agoria", "kaytek"], url: lannkaAgoria.url },
  { keywords: ["valeron"], url: valeron.url },
  { keywords: ["satori"], url: satori.url },
  { keywords: ["nefertiti", "nfrtiti"], url: nfrtiti.url },
  { keywords: ["tijax"], url: tijax12.url },
  { keywords: ["yamila"], url: yamila.url },
  { keywords: ["blanca puebla", "blanca"], url: blanca.url },
];

// Secondary pool for variation (cycled across cards) when a venue has many DJs without specific matches
const portraitPool = [tijax12.url, tijax13.url, blanca.url, satori.url, yamila.url, valeron.url];

export function getDjPortrait(dj: string, fallbackIndex = 0): string | undefined {
  const s = (dj || "").toLowerCase();
  for (const m of portraitMap) {
    if (m.keywords.some((k) => s.includes(k))) return m.url;
  }
  return undefined;
}

export function getPooledPortrait(index: number): string {
  return portraitPool[index % portraitPool.length];
}
