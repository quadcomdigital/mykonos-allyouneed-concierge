// Event data for Mykonos summer season
import imgScorpios from "@/assets/locations/scorpios.jpg";
import imgNammos from "@/assets/locations/nammos.jpg";
import imgSantanna from "@/assets/locations/santanna.jpg";
import imgToyroom from "@/assets/locations/toyroom.jpg";
import imgTropicana from "@/assets/locations/tropicana.jpg";

export type EventType = "special" | "weekly" | "holiday";

export interface SpecialEvent {
  id: string;
  date: string;
  title: string;
  dj: string;
  venue: string;
  venueSlug: string;
  venueImage: string;
  type: EventType;
  description: string;
  highlight?: boolean;
  tag?: string;
}

export interface WeeklyLineup {
  venue: string;
  venueSlug: string;
  venueImage: string;
  category: "beachclub" | "club";
  days: {
    day: string;
    resident: string;
    genre: string;
  }[];
}

// ─── SPECIAL EVENTS & GUEST ─────────────────────────────────────────────────

export const specialEvents: SpecialEvent[] = [
  {
    id: "e1",
    date: "2025-06-21",
    title: "Opening Party",
    dj: "Solomun",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "Il leggendario Solomun apre la stagione estiva con un set esclusivo al tramonto.",
    highlight: true,
    tag: "Season Opening",
  },
  {
    id: "e2",
    date: "2025-06-28",
    title: "Afro House Night",
    dj: "Black Coffee",
    venue: "Scorpios",
    venueSlug: "scorpios",
    venueImage: imgScorpios,
    type: "special",
    description: "Black Coffee porta i suoi ritmi afro-house nell'atmosfera unica di Scorpios.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e3",
    date: "2025-07-05",
    title: "Melodic Techno Night",
    dj: "Boris Brejcha",
    venue: "Tropicana",
    venueSlug: "tropicana",
    venueImage: imgTropicana,
    type: "special",
    description: "Il genio mascherato della techno torna a Mykonos per una notte memorabile.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e4",
    date: "2025-07-12",
    title: "Deep Sessions",
    dj: "Adriatique",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "Il duo svizzero Adriatique con un set deep e melodico al tramonto.",
    tag: "International DJ",
  },
  {
    id: "e5",
    date: "2025-07-19",
    title: "ARTBAT x Massano",
    dj: "ARTBAT & Massano",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "Il duo ucraino ARTBAT insieme a Massano per una notte di techno melodica.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e6",
    date: "2025-07-26",
    title: "Hugel Live",
    dj: "Hugel",
    venue: "Tropicana",
    venueSlug: "tropicana",
    venueImage: imgTropicana,
    type: "special",
    description: "Hugel porta la sua energia esplosiva e i suoi hit al Tropicana per una festa indimenticabile.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e7",
    date: "2025-08-02",
    title: "Afterlife Mykonos",
    dj: "Tale Of Us",
    venue: "Nammos",
    venueSlug: "nammos",
    venueImage: imgNammos,
    type: "special",
    description: "L'iconica esperienza Afterlife sbarca a Mykonos con Tale Of Us.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e8",
    date: "2025-08-09",
    title: "Summer Vibes",
    dj: "Fisher",
    venue: "Nammos",
    venueSlug: "nammos",
    venueImage: imgNammos,
    type: "special",
    description: "Fisher con il suo tech-house esplosivo alla location più iconica dell'isola.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e9",
    date: "2025-08-13",
    title: "Hugel Returns",
    dj: "Hugel",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "Hugel torna per un secondo show esclusivo nella location più elegante dell'isola.",
    tag: "International DJ",
  },
  {
    id: "e10",
    date: "2025-08-14",
    title: "Vigilia di Ferragosto",
    dj: "Vintage Culture",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "holiday",
    description: "La notte più attesa dell'estate con Vintage Culture. Party esclusivo.",
    highlight: true,
    tag: "Ferragosto Eve",
  },
  {
    id: "e11",
    date: "2025-08-15",
    title: "Ferragosto Party",
    dj: "Marco Carola",
    venue: "Scorpios",
    venueSlug: "scorpios",
    venueImage: imgScorpios,
    type: "holiday",
    description: "Ferragosto a Mykonos con Marco Carola. La notte più speciale dell'anno.",
    highlight: true,
    tag: "🔥 Ferragosto",
  },
  {
    id: "e12",
    date: "2025-08-16",
    title: "Keinemusik Night",
    dj: "Keinemusik",
    venue: "Scorpios",
    venueSlug: "scorpios",
    venueImage: imgScorpios,
    type: "special",
    description: "Il collettivo berlinese più amato al mondo in un evento imperdibile.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e13",
    date: "2025-08-23",
    title: "Peggy Gou Live",
    dj: "Peggy Gou",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "La star coreana torna a Mykonos con il suo sound unico.",
    highlight: true,
    tag: "International DJ",
  },
  {
    id: "e14",
    date: "2025-08-30",
    title: "Closing Month Kick-off",
    dj: "Damian Lazarus",
    venue: "Scorpios",
    venueSlug: "scorpios",
    venueImage: imgScorpios,
    type: "special",
    description: "Damian Lazarus inaugura il mese finale con un tramonto mistico a Scorpios.",
    tag: "International DJ",
  },
  {
    id: "e15",
    date: "2025-09-06",
    title: "Grand Closing",
    dj: "Dixon",
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    type: "special",
    description: "Dixon chiude la stagione di SantAnna con un set leggendario.",
    highlight: true,
    tag: "Season Closing",
  },
];

// ─── WEEKLY LINEUPS ─────────────────────────────────────────────────────────

export const weeklyLineups: WeeklyLineup[] = [
  {
    venue: "Tropicana",
    venueSlug: "tropicana",
    venueImage: imgTropicana,
    category: "beachclub",
    days: [
      { day: "Lunedì", resident: "Ludwig", genre: "Deep House" },
      { day: "Martedì", resident: "Nikos Diamantopoulos", genre: "Afro House" },
      { day: "Mercoledì", resident: "DJ Thanos", genre: "House" },
      { day: "Giovedì", resident: "Angelo Ferreri", genre: "Funky House" },
      { day: "Venerdì", resident: "Special Guest", genre: "Vari" },
      { day: "Sabato", resident: "Hugel / Rotating", genre: "Tech House" },
      { day: "Domenica", resident: "Beach Party Resident", genre: "House" },
    ],
  },
  {
    venue: "SantAnna",
    venueSlug: "santanna",
    venueImage: imgSantanna,
    category: "beachclub",
    days: [
      { day: "Lunedì", resident: "Audiofly", genre: "Deep / Melodic" },
      { day: "Martedì", resident: "Fideles", genre: "Melodic Techno" },
      { day: "Mercoledì", resident: "Massano", genre: "Afro / Melodic" },
      { day: "Giovedì", resident: "Innellea", genre: "Melodic Techno" },
      { day: "Venerdì", resident: "ARTBAT / Guest", genre: "Melodic Techno" },
      { day: "Sabato", resident: "Special Guest", genre: "Vari" },
      { day: "Domenica", resident: "Sunset Sessions", genre: "Deep House" },
    ],
  },
  {
    venue: "Scorpios",
    venueSlug: "scorpios",
    venueImage: imgScorpios,
    category: "beachclub",
    days: [
      { day: "Lunedì", resident: "Red Axes", genre: "Indie Dance" },
      { day: "Martedì", resident: "Oceanvs Orientalis", genre: "Organic House" },
      { day: "Mercoledì", resident: "Parallells", genre: "Melodic" },
      { day: "Giovedì", resident: "Acid Pauli", genre: "Experimental" },
      { day: "Venerdì", resident: "Damian Lazarus", genre: "Deep / Tribal" },
      { day: "Sabato", resident: "Keinemusik / Guest", genre: "House" },
      { day: "Domenica", resident: "Ritual Sunset", genre: "Downtempo" },
    ],
  },
  {
    venue: "Toyroom",
    venueSlug: "toyroom",
    venueImage: imgToyroom,
    category: "club",
    days: [
      { day: "Lunedì", resident: "Hip Hop Monday", genre: "Hip Hop / R&B" },
      { day: "Mercoledì", resident: "Ladies Night", genre: "Commercial" },
      { day: "Venerdì", resident: "Club Night", genre: "House / Hip Hop" },
      { day: "Sabato", resident: "Main Event", genre: "House" },
    ],
  },
];

export const months = [
  { value: "all", label: "Tutti" },
  { value: "06", label: "Giugno" },
  { value: "07", label: "Luglio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Settembre" },
];
