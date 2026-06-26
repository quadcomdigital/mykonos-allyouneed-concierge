// Static fallback prices scraped from allyouneedexperience.com
// Used when Supabase price_range is empty
export const villaPrices: Record<string, number> = {
  sophie: 700,
  moments: 1300,
  orus: 1500,
  yza: 1300,
  dana: 1300,
  anes: 1200,
  amaris: 1500,
};

// per person / night
export const apartmentPrices: Record<string, number> = {
  windy1: 55,
  windyup: 55,
  sunset: 60,
  sophia: 75,
  ocho: 95,
  mykocho: 42,
  miriam: 115,
  iza: 50,
  milena: 67,
  lunablu: 100,
  izares: 60,
  isabel: 65,
  hylas: 95,
  eirini: 65,
  dime: 65,
  beauty: 55,
  anthos: 45,
  aniel: 45,
  anamis: 95,
  alextown: 125,
  alexis: 45,
  agiosstudios: 40,
};

export const formatVillaPrice = (slug: string, dbRange?: string | null): string | null => {
  if (dbRange) {
    const m = dbRange.match(/€\s?([\d.,]+)/);
    if (m) return `€${m[1]}`;
  }
  const p = villaPrices[slug];
  return p ? `€${p.toLocaleString("it-IT")}` : null;
};

export const formatApartmentPrice = (slug: string, dbRange?: string | null): string | null => {
  if (dbRange) {
    const m = dbRange.match(/€\s?([\d.,]+)/);
    if (m) return `€${m[1]}`;
  }
  const p = apartmentPrices[slug];
  return p ? `€${p}` : null;
};
