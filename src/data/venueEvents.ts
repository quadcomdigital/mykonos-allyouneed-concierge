// Events associated with venues — Season 2026

export interface VenueEvent {
  id: string;
  date: string;
  dj: string;
  venue: string;
  venueSlug: string;
  description?: string;
  highlight?: boolean;
  tag?: string;
  time?: string;
}

export const venueEvents: VenueEvent[] = [
  // ─── SCORPIOS MAY 2026 ──────────────────────────────
  { id: "sc-0510", date: "2026-05-10", dj: "Reznik, Jean Claude Ades, Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Season Opening", description: "Our opening event sees Keinemusik's Reznik, Jean Claude Ades and Lannka take to the stage to lay down sonorous melodies, pulsating rhythms and euphoric vibes." },
  { id: "sc-0511", date: "2026-05-11", dj: "Kurup (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", description: "Beyond the sunset into a night of rhythm and connection with Kurup's signature blend of electronic and Downtempo-Latin influences." },
  { id: "sc-0513", date: "2026-05-13", dj: "Little D", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0515", date: "2026-05-15", dj: "Lannka Invites Nohr Feat. Afnan Prince (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0516", date: "2026-05-16", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0517", date: "2026-05-17", dj: "Jean Claude Ades, LE YORA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0518", date: "2026-05-18", dj: "RENATTA, Kid Bamboo", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0520", date: "2026-05-20", dj: "Cincity, LICA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0522", date: "2026-05-22", dj: "Lannka Invites Fejká Feat. Luma (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0523", date: "2026-05-23", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0524", date: "2026-05-24", dj: "Jean Claude Ades, Khenya", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0525", date: "2026-05-25", dj: "Clint Lee", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0527", date: "2026-05-27", dj: "Konvex, Elated Mind", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0529", date: "2026-05-29", dj: "Lannka Invites Two Lanes (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0530", date: "2026-05-30", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0531", date: "2026-05-31", dj: "WhoMadeWho (Hybrid DJ Set), Tripolism", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "Acclaimed for their flawless live performances and distinct combination of Electro-Pop with Jazz-inspired instrumentals, WhoMadeWho lift dancefloors towards euphoria." },

  // ─── SCORPIOS JUNE 2026 ──────────────────────────────
  { id: "sc-0601", date: "2026-06-01", dj: "Camilo Nu (Live), MURMUSICA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0602", date: "2026-06-02", dj: "Samm B2B Ajna, Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0603", date: "2026-06-03", dj: "JUNO(DE), Elated Mind", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0604", date: "2026-06-04", dj: "Satori (Live), Meera", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", description: "Satori re-interprets his blend of groove-laden electronica into live performance, with instruments building into climatic sound." },
  { id: "sc-0605", date: "2026-06-05", dj: "Lannka Invites Tonic Walter Feat. Nina Nst (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0606", date: "2026-06-06", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0607", date: "2026-06-07", dj: "MoBlack B2B Jean Claude Ades", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0608", date: "2026-06-08", dj: "Uli Viola (Live), Man With The Speaker", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0609", date: "2026-06-09", dj: "Kaz James, Meloko", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0610", date: "2026-06-10", dj: "Dennis Louvra, RENATTA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0611", date: "2026-06-11", dj: "Damian Lazarus, LICA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "Founder of Crosstown Rebels, Damian Lazarus brings a spellbinding approach to House and Techno that invokes moments of connection across the dancefloor." },
  { id: "sc-0612", date: "2026-06-12", dj: "Lannka Invites Agoria", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0613", date: "2026-06-13", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0614", date: "2026-06-14", dj: "Carlita, Jane Ryse", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, description: "Carlita draws inspiration from a global mood board of sound with every set full of infectious surprises." },
  { id: "sc-0615", date: "2026-06-15", dj: "GEJU, Kurup", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0616", date: "2026-06-16", dj: "Avangart Tabldot, Charmeine", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0617", date: "2026-06-17", dj: "Little D B2B DSF", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0618", date: "2026-06-18", dj: "Bedouin, ATSOU", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "Tamer Malki and Rami Abousabe, the enigmatic masterminds behind Bedouin, unite crowds worldwide with cross-cultural sonic melodies." },
  { id: "sc-0619", date: "2026-06-19", dj: "Lannka Invites Parra For Cuva (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0620", date: "2026-06-20", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0621", date: "2026-06-21", dj: "WhoMadeWho (Hybrid DJ Set), Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "Acclaimed for their flawless live performances and distinct combination of Electro-Pop with Jazz-inspired instrumentals." },
  { id: "sc-0622", date: "2026-06-22", dj: "ARKADYAN (Live), YEMANJO feat. Irene Rosalia (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0623", date: "2026-06-23", dj: "Tripolism, LICA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0624", date: "2026-06-24", dj: "UVITA & OSFUR (The Scripture), Deroos", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0625", date: "2026-06-25", dj: "Bedouin, Santiago Garcia", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, description: "Bedouin unite crowds with boundaryless beats that merge multi-cultural heritage and electronic influences." },
  { id: "sc-0626", date: "2026-06-26", dj: "Lannka Invites Henrik Schwarz (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0627", date: "2026-06-27", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0628", date: "2026-06-28", dj: "&ME, Ahmed Spins B2B Ankhoï", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Keinemusik", description: "Keinemusik's &ME, Ahmed Spins and ANKHOÏ join us for hypnotic builds and charged grooves from the golden hour into the nocturnal night." },
  { id: "sc-0629", date: "2026-06-29", dj: "El Búho Feat Sandra Bernardo (Live), RENATTA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0630", date: "2026-06-30", dj: "Samm B2B Ajna, Little D", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },

  // ─── SCORPIOS JULY 2026 ──────────────────────────────
  { id: "sc-0701", date: "2026-07-01", dj: "AWEN (Hybrid Set), Kaytek", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0702", date: "2026-07-02", dj: "Damian Lazarus, PAAX", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ" },
  { id: "sc-0703", date: "2026-07-03", dj: "Lannka Invites Âme Live Feat. JEANNEL", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Innervisions", description: "Lannka invites Innervisions' founder Frank Wiedemann and vocalist JEANNEL for a versatile live set." },
  { id: "sc-0704", date: "2026-07-04", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0705", date: "2026-07-05", dj: "Jean Claude Ades, Luch, Little D", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0706", date: "2026-07-06", dj: "Ghetto Kumbé (Live), Stories of Dharma", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0707", date: "2026-07-07", dj: "Desiree, Reznik", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Keinemusik" },
  { id: "sc-0708", date: "2026-07-08", dj: "Laolu, Drush", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0709", date: "2026-07-09", dj: "Jimi Jules, Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Innervisions" },
  { id: "sc-0710", date: "2026-07-10", dj: "Lannka Invites Thievery Corporation (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Live Act", description: "Thievery Corporation thread Dub, Acid Jazz, Reggae and Bossa Nova into a mosaic of rhythmic electronica." },
  { id: "sc-0711", date: "2026-07-11", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0712", date: "2026-07-12", dj: "Gordo, Yamagucci", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, description: "The artist formerly known as Carnage has built a reputation for high energy dance music that bridges Latin, House and Techno." },
  { id: "sc-0713", date: "2026-07-13", dj: "Dengue Dengue Dengue (Live), LICA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0714", date: "2026-07-14", dj: "Kaz James, Deer Jade", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0715", date: "2026-07-15", dj: "Scorpios Label Night — JCA B2B Ajna, Meloko B2B Konvex", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Label Night" },
  { id: "sc-0716", date: "2026-07-16", dj: "Dixon, Julya Karma", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Innervisions", description: "Founder of Innervisions, Dixon is a seasoned selector capable of transcendent dancefloor moments." },
  { id: "sc-0717", date: "2026-07-17", dj: "Lannka Invites WhoMadeWho (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Live Act" },
  { id: "sc-0718", date: "2026-07-18", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0719", date: "2026-07-19", dj: "PAWSA, Avangart Tabldot", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0720", date: "2026-07-20", dj: "Alex Serra & Totidub (Live), RENATTA", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0721", date: "2026-07-21", dj: "Peggy Gou, Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "Global icon Peggy Gou arrives at Scorpios to effortlessly bridge House, Techno, and '90s-inflected euphoria." },
  { id: "sc-0722", date: "2026-07-22", dj: "Lee Burridge, Elated Mind", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true },
  { id: "sc-0723", date: "2026-07-23", dj: "Bedouin, Little D", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true },
  { id: "sc-0724", date: "2026-07-24", dj: "Lannka Invites Howling", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0725", date: "2026-07-25", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0726", date: "2026-07-26", dj: "Carlita, Jean Claude Ades", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true },
  { id: "sc-0727", date: "2026-07-27", dj: "Da Mike", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0728", date: "2026-07-28", dj: "&ME, Charmeine", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Keinemusik" },
  { id: "sc-0729", date: "2026-07-29", dj: "Magnifik Showcase — Samm B2B Ajna Feat. Chelsea Como, Mosoo", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Label Night" },
  { id: "sc-0730", date: "2026-07-30", dj: "Innervisions Mykonos — Âme, Dixon, Jimi Jules, Julya Karma, Trikk", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Innervisions Takeover", description: "Berlin's legendary label join us for a special B2B showcase — an evening of buoyant energy from masters of the craft." },
  { id: "sc-0731", date: "2026-07-31", dj: "Lannka Invites Satori (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },

  // ─── SCORPIOS AUGUST 2026 ────────────────────────────
  { id: "sc-0801", date: "2026-08-01", dj: "Valeron & Band (Live)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0802", date: "2026-08-02", dj: "ANOTR, Bella Backe", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true },
  { id: "sc-0803", date: "2026-08-03", dj: "Rico Loop (Live), Carly Sant", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0804", date: "2026-08-04", dj: "Rampa, Lannka", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "Keinemusik", description: "Keinemusik's Rampa brings joyful, nuanced selections and rhythms." },
  { id: "sc-0805", date: "2026-08-05", dj: "Little D, Deroos", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM" },
  { id: "sc-0806", date: "2026-08-06", dj: "Michael Bibi, Yamagucci", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, description: "Michael Bibi charges the dancefloor with groove-heavy House and rolling minimal rhythms." },
  { id: "sc-0807", date: "2026-08-07", dj: "Lannka Invites RY X (DJ)", venue: "Scorpios", venueSlug: "scorpios", time: "5:00 PM", highlight: true, tag: "International DJ", description: "RY X steps into Scorpios for a rare DJ set, weaving Berlin-rooted House music with cross-cultural sonic textures." },

  // ─── LIO 2026 ────────────────────────────────────────
  { id: "lio01", date: "2026-05-29", dj: "Opening Night — SPECTACULARRR", venue: "Lio", venueSlug: "lio", highlight: true, tag: "Season Opening" },

  // ─── TOY ROOM (daily events) ─────────────────────────
  { id: "tr01", date: "2026-06-01", dj: "Resident DJ", venue: "Toy Room", venueSlug: "toy-room", tag: "Ogni sera" },
];

export const eventMonths = [
  { value: "all", label: "Mese", labelEn: "Month" },
  { value: "05", label: "Maggio", labelEn: "May" },
  { value: "06", label: "Giugno", labelEn: "June" },
  { value: "07", label: "Luglio", labelEn: "July" },
  { value: "08", label: "Agosto", labelEn: "August" },
  { value: "09", label: "Settembre", labelEn: "September" },
];
