export type CountryCode = "KE" | "TZ" | "RW";
export type StageId = "early" | "primary" | "secondary" | "sixth";

export interface StageInfo {
  id: StageId;
  label: string;
  ages: string;
  min: number;
  max: number;
}

export interface School {
  id: string;
  name: string;
  short: string;
  town: string;
  country: string;
  code: CountryCode;
  flag: string;
  ages: [number, number];
  boarding: boolean;
  curriculum: string[];
  identity: string;
  motif: string;
  image: string;
  /** Position on the stylised East Africa map (x = lon×10, y = −lat×10). */
  pin: [number, number];
  currency: string;
  feeFrom: string;
  progression?: string;
  contact: { name: string; role: string; whatsapp: string };
  route?: string;
}

export const STAGES: StageInfo[] = [
  { id: "early", label: "Early Years", ages: "2–5", min: 2, max: 4 },
  { id: "primary", label: "Primary", ages: "5–11", min: 5, max: 10 },
  { id: "secondary", label: "Secondary", ages: "11–16", min: 11, max: 15 },
  { id: "sixth", label: "Sixth Form", ages: "16–18", min: 16, max: 18 },
];

export const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
];

/* Placeholder campus data — ages, boarding and fee figures are indicative
   and must be confirmed with each school during discovery. */
export const SCHOOLS: School[] = [
  {
    id: "nairobi",
    name: "Braeburn School",
    short: "Braeburn Nairobi",
    town: "Lavington, Nairobi",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level", "BTEC"],
    identity:
      "Our founding campus on leafy Gitanga Road: a garden school with a strong creative-arts tradition and an A Level & BTEC Sixth Form.",
    motif: "Savannah wildlife",
    image: "images/nairobi-hero.jpg",
    pin: [366, 12],
    currency: "KES",
    feeFrom: "KES 395,000 / term",
    contact: { name: "Grace Wanjiru", role: "Admissions Registrar", whatsapp: "254700000001" },
    route: "/campus/nairobi",
  },
  {
    id: "garden-estate",
    name: "Braeburn Garden Estate School",
    short: "Garden Estate",
    town: "Garden Estate, Nairobi",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "IB Diploma"],
    identity:
      "Nairobi's IB World School: an inquiry-led pathway from Early Years to the IB Diploma on a spacious, green campus.",
    motif: "Giraffe & fever trees",
    image: "images/hero.jpg",
    pin: [371, 9],
    currency: "KES",
    feeFrom: "KES 410,000 / term",
    contact: { name: "Peter Kamau", role: "Admissions Manager", whatsapp: "254700000002" },
  },
  {
    id: "braeside-lavington",
    name: "Braeside School",
    short: "Braeside Lavington",
    town: "Lavington, Nairobi",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level"],
    identity:
      "A neighbourhood school with a big heart — known for performing arts, inclusion and a close-knit Sixth Form.",
    motif: "Sunbird & bougainvillea",
    image: "images/early-years.jpg",
    pin: [363, 15],
    currency: "KES",
    feeFrom: "KES 330,000 / term",
    contact: { name: "Naomi Achieng'", role: "Admissions Officer", whatsapp: "254700000003" },
  },
  {
    id: "braeside-thika",
    name: "Braeside School Thika",
    short: "Braeside Thika",
    town: "Thika",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: true,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level", "BTEC"],
    identity:
      "Space to run: a wide, green day-and-boarding campus outside Thika with a proud sporting tradition and BTEC pathways.",
    motif: "Chania falls & pineapple fields",
    image: "images/arusha.jpg",
    pin: [375, 6],
    currency: "KES",
    feeFrom: "KES 310,000 / term",
    contact: { name: "Samuel Mwangi", role: "Admissions Registrar", whatsapp: "254700000004" },
  },
  {
    id: "mombasa",
    name: "Braeburn Mombasa International School",
    short: "Braeburn Mombasa",
    town: "Nyali, Mombasa",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level"],
    identity:
      "Learning by the Indian Ocean: marine science, sailing and a warm island-coast community in Nyali.",
    motif: "Dhow sails & coral",
    image: "images/mombasa.jpg",
    pin: [397, 40],
    currency: "KES",
    feeFrom: "KES 300,000 / term",
    contact: { name: "Fatma Ali", role: "Admissions Officer", whatsapp: "254700000005" },
  },
  {
    id: "kisumu",
    name: "Braeburn Kisumu International School",
    short: "Braeburn Kisumu",
    town: "Kisumu",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 16],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE"],
    identity:
      "Lakeside on Victoria's shore: small classes, water sports and a guided route to our Nairobi Sixth Forms.",
    motif: "Lake & water forms",
    image: "images/kisumu.jpg",
    pin: [348, 1],
    currency: "KES",
    feeFrom: "KES 260,000 / term",
    progression: "Braeburn Nairobi or Garden Estate for Sixth Form",
    contact: { name: "Beatrice Adhiambo", role: "Admissions Officer", whatsapp: "254700000006" },
  },
  {
    id: "nanyuki",
    name: "Braeburn Nanyuki International School",
    short: "Braeburn Nanyuki",
    town: "Nanyuki, Laikipia",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 16],
    boarding: true,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE"],
    identity:
      "In the foothills of Mount Kenya: outdoor learning, conservation partnerships and a clear progression to Garden Estate, Thika and Hillcrest.",
    motif: "Mountain forms",
    image: "images/nanyuki.jpg",
    pin: [371, 0],
    currency: "KES",
    feeFrom: "KES 285,000 / term",
    progression: "Garden Estate, Braeside Thika or Hillcrest for Sixth Form",
    contact: { name: "James Kariuki", role: "Admissions Registrar", whatsapp: "254700000007" },
  },
  {
    id: "hillcrest",
    name: "Hillcrest International Schools",
    short: "Hillcrest",
    town: "Karen, Nairobi",
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    ages: [2, 18],
    boarding: true,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level", "BTEC"],
    identity:
      "Our flagship boarding campus in Karen: forest-edge grounds and specialist Secondary and Sixth Form pathways.",
    motif: "Forest edge & colobus",
    image: "images/boarding.jpg",
    pin: [367, 17],
    currency: "KES",
    feeFrom: "KES 480,000 / term",
    contact: { name: "Sarah Njeri", role: "Head of Admissions", whatsapp: "254700000008" },
  },
  {
    id: "arusha",
    name: "Braeburn Arusha International School",
    short: "Braeburn Arusha",
    town: "Arusha",
    country: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    ages: [2, 18],
    boarding: true,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level"],
    identity:
      "Tanzania's Braeburn, in the shadow of Mount Meru: boarding from Year 4, safari-country expeditions and a truly international community.",
    motif: "Mount Meru & baobab",
    image: "images/arusha.jpg",
    pin: [367, 34],
    currency: "TZS",
    feeFrom: "TZS 7.9M / term",
    contact: { name: "Neema Mushi", role: "Admissions Registrar", whatsapp: "255700000009" },
  },
  {
    id: "dar",
    name: "Braeburn Dar es Salaam International School",
    short: "Braeburn Dar",
    town: "Dar es Salaam",
    country: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    ages: [2, 18],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum", "IGCSE", "A Level"],
    identity:
      "A city day school with an ocean breeze: bilingual confidence, enterprise clubs and a family feel in the heart of Dar.",
    motif: "Ocean & mangrove",
    image: "images/mombasa.jpg",
    pin: [393, 68],
    currency: "TZS",
    feeFrom: "TZS 7.2M / term",
    contact: { name: "Joseph Mbwana", role: "Admissions Officer", whatsapp: "255700000010" },
  },
  {
    id: "kigali",
    name: "The Earth School",
    short: "Earth School Kigali",
    town: "Kigali",
    country: "Rwanda",
    code: "RW",
    flag: "🇷🇼",
    ages: [2, 11],
    boarding: false,
    curriculum: ["EYFS", "English National Curriculum"],
    identity:
      "Braeburn in the land of a thousand hills: a nature-first Early Years and Primary school with Kinyarwanda and French woven through the day.",
    motif: "A thousand hills",
    image: "images/early-years.jpg",
    pin: [301, 19],
    currency: "RWF",
    feeFrom: "RWF 2.4M / term",
    progression: "Braeburn Arusha or our Nairobi schools for Secondary",
    contact: { name: "Aline Uwase", role: "Admissions Lead", whatsapp: "250700000011" },
  },
];

export const INTERESTS: { id: string; label: string; blurb: string }[] = [
  { id: "boarding", label: "Boarding", blurb: "Houses, houseparents and weekend life" },
  { id: "sport", label: "Sport & athletics", blurb: "Fixtures, swimming, athletics, leagues" },
  { id: "arts", label: "Performing arts", blurb: "Music, drama, dance and the big production" },
  { id: "stem", label: "STEM & innovation", blurb: "Labs, coding, robotics and design" },
  { id: "outdoor", label: "Outdoor learning", blurb: "Forest school, expeditions, conservation" },
  { id: "university", label: "University guidance", blurb: "Pathways, destinations and applications" },
  { id: "support", label: "Learning support", blurb: "Inclusion, EAL and individual plans" },
  { id: "languages", label: "Languages & culture", blurb: "Kiswahili, French, Kinyarwanda" },
];

export const stageForAge = (age: number): StageInfo =>
  STAGES.find((s) => age >= s.min && age <= s.max) ?? STAGES[STAGES.length - 1];

export const offersStage = (school: School, stage: StageInfo) =>
  school.ages[1] > stage.min && school.ages[0] <= stage.max;

export const yearGroupFor = (age: number) => {
  if (age <= 2) return "Playgroup";
  if (age === 3) return "Nursery";
  if (age === 4) return "Reception";
  if (age >= 17) return "Year 13";
  return `Year ${age - 4}`;
};

export const schoolById = (id?: string | null) => SCHOOLS.find((s) => s.id === id);
