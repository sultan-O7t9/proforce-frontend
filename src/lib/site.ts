import IconFacebook from "@/components/icons/IconFacebook.astro";
import IconInstagram from "@/components/icons/IconInstagram.astro";
import IconTiktok from "@/components/icons/IconTiktok.astro";
import IconYoutube from "@/components/icons/IconYoutube.astro";

export const SITE = {
  name: "Proforce Frontend",
  description: "A minimal, best-practice Astro + Tailwind starter project.",
  url: "https://example.com",
} as const;

export const BREAKPOINTS = {
  md: 768,
} as const;

export const ROUTES = {
  HOME: { id: "1", name: "Proforce Home", href: "/" },
  PRODUCTS: (productSlug: string, productName: string) => ({
    id: "2" + productSlug,
    name: productName,
    href: "/products/" + productSlug,
  }),
  INSTALLERS: { id: "3", name: "Find Installers", href: "/installers" },
  PRIVACY: { id: "4", name: "Privacy Policy", href: "/privacy-policy" },
  TERMS: { id: "5", name: "Terms & Conditions", href: "/terms" },
  SUPPORT: { id: "6", name: "Warranty & Support", href: "/support" },
  DEALER_LOGIN: { id: "7", name: "Dealer Portal", href: "/dealer/login" },
  DEALER_FORGOT_PASSWORD: {
    id: "8",
    name: "Dealer Portal Login - Forgot Password?",
    href: "/dealer/forgot-password",
  },
  DEALER_REGISTER: {
    id: "9",
    name: "Dealer Portal - Become a Patner",
    href: "/dealer/register",
  },
} as const;
export const NAV_LINKS = [
  { ...ROUTES.SUPPORT },
  { ...ROUTES.DEALER_LOGIN },
] as const;

export const FOOTER_LINKS = [
  { id: 1, name: "OneFilmUSA", href: "" },
  { ...ROUTES.PRIVACY },
  { ...ROUTES.TERMS },
];

export const SOCIAL_LINKS = [
  { id: 1, name: "Facebook", icon: IconFacebook, href: "" },
  { id: 1, name: "Instagram", icon: IconInstagram, href: "" },
  { id: 1, name: "Youtube", icon: IconYoutube, href: "" },
  { id: 1, name: "Tiktok", icon: IconTiktok, href: "" },
];

interface LegalInfoInterface {
  id: number;
  heading: string;
  description: string;
  bullets?: { id: number; heading: string; description: string }[];
}

export const PRIVACY_POLICY: LegalInfoInterface[] = [
  {
    id: 1,
    heading: "Introduction",
    description:
      "At Proforce (engineered by OneFilm USA), protecting your privacy is our priority. This policy explains how we collect, use, and protect your data when you interact with our website and products. By using our platform, you agree to these practices.",
  },
  {
    id: 2,
    heading: "Information We Collect",
    description: "We gather information in two primary ways:",
    bullets: [
      {
        id: 1,
        heading: "Directly Provided Data",
        description:
          " Name, email, and business details when you submit inquiries or apply for our global distributor network",
      },
      {
        id: 2,
        heading: "Automated Data",
        description:
          " Non-identifiable information like browser type and site interaction through cookies to enhance your browsing experience.",
      },
    ],
  },
  {
    id: 3,
    heading: "How We Use Your Data",
    description: "The information we collect is strictly used to:",
    bullets: [
      {
        id: 1,
        heading: "",
        description:
          "Respond to your requests and manage distributor applications efficiently.",
      },
      {
        id: 2,
        heading: "",
        description:
          "Improve the performance of our website and our Paint Protection Film (PPF) offerings.",
      },
      {
        id: 3,
        heading: "",
        description:
          "Send relevant updates regarding our products, such as the Phantom series, or policy changes.",
      },
    ],
  },
  {
    id: 4,
    heading: "Data Sharing and Protection",
    description:
      "We respect your privacy and do not sell your personal data. We only share information with our parent company, authorized distributors, or trusted service providers strictly to fulfill your requests. We employ industry-standard security protocols to keep your data safe from unauthorized access.",
  },
  {
    id: 5,
    heading: "Your Rights and Contact",
    description:
      "You retain full control over your personal information. You may request to access, update, or delete your data at any time. For any privacy-related questions or requests, please reach out through the contact section on our website.",
  },
] as const;

export const TERMS: LegalInfoInterface[] = [
  {
    id: 1,
    heading: "Introduction",
    description:
      "Welcome to Proforce. These Terms and Conditions govern your use of the Proforce website and the purchase or use of our Paint Protection Film (PPF) products and services. By accessing our website or engaging with our business, you agree to be bound by these terms. If you do not agree with any part of these terms, please refrain from using our website.",
  },
  {
    id: 2,
    heading: "Intellectual Property",
    description:
      "All content on this website, including but not limited to text, graphics, logos, images, product names (e.g., Proforce, Phantom), and digital downloads, is the property of Proforce or its content suppliers and is protected by international copyright and trademark laws. Unauthorized use, reproduction, or distribution of this material is strictly prohibited.",
  },
  {
    id: 3,
    heading: "Product Information and Application",
    description:
      "Proforce specializes in high-performance Paint Protection Films engineered for ultimate defense.",
    bullets: [
      {
        id: 1,
        heading: "Professional Installation",
        description:
          " To ensure the highest quality results and to maintain the validity of any product warranties, Proforce products should be installed by certified and authorized Proforce distributors or detailers",
      },
      {
        id: 2,
        heading: "Accuracy of Information",
        description:
          " While we strive to ensure that all product descriptions, specifications, and features (such as self-healing, hydrophobic properties, and impact resistance) are accurate, Proforce does not warrant that the content is entirely error-free.",
      },
    ],
  },
  {
    id: 4,
    heading: "Warranty Policy",
    description:
      "Proforce stands behind the quality of its products. Our flagship PPF lines, such as the Phantom series, come with a specific warranty 6 years against cracking, bubbling, or yellowing under normal use.",
    bullets: [
      {
        id: 1,
        heading: "",
        description:
          "This warranty is only valid if the installation was performed by an authorized Proforce installer.",
      },
      {
        id: 2,
        heading: "",
        description:
          "The warranty does not cover damage resulting from accidents, collisions, intentional misuse, or improper maintenance.",
      },
      {
        id: 3,
        heading: "",
        description:
          "Claims must be submitted with original proof of purchase and installation.",
      },
    ],
  },
  {
    id: 5,
    heading: "Limitation of Liability",
    description:
      "To the fullest extent permitted by law, Proforce and its affiliates, directors, or employees shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of our website, products, or services. Our liability in any claim related to the purchase of a product shall not exceed the purchase price of the product in question.",
  },
  {
    id: 6,
    heading: "Business Partnerships and Distributor Network",
    description:
      "For businesses aligning with Proforce as certified detailers or distributors, additional B2B agreements and terms will apply. The information provided on this website regarding our global network (e.g., 60+ distributors across 12 countries) is for informational purposes and does not constitute a binding partnership agreement until formal contracts are signed.",
  },
  {
    id: 7,
    heading: "Third-Party Links",
    description:
      "Our website may contain links to third-party websites or services that are not owned or controlled by Proforce. We hold no responsibility for the content, privacy policies, or practices of any third-party websites.",
  },
  {
    id: 8,
    heading: "Contact Us",
    description:
      "If you have any questions regarding these Terms and Conditions, please contact us through our dedicated support channels provided on the website",
  },
] as const;

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

// export const COUNTRY_OPTIONS = Object.entries(
//   countries.getNames("en", { select: "official" }),
// )
//   .map(([code, name]) => ({
//     label: name,
//     value: code.toLowerCase(),
//   }))
//   .sort((a, b) => a.label.localeCompare(b.label));

export const COUNTRY_OPTIONS = [
  { label: "Pakistan", value: "pk" },
  { label: "USA", value: "us" },
  { label: "UK", value: "gb" },
  { label: "Canada", value: "ca" },
  { label: "UAE", value: "ae" },
  { label: "Saudi Arabia", value: "sa" },
  { label: "Oman", value: "om" },
  { label: "Qatar", value: "qa" },
  { label: "France", value: "fr" },
  { label: "Portugal", value: "pt" },
  { label: "Georgia", value: "ge" },
];
export const ALL_COUNTRIES = {
  af: "afghanistan",
  al: "albania",
  dz: "algeria",
  ad: "andorra",
  ao: "angola",
  ag: "antigua and barbuda",
  ar: "argentina",
  am: "armenia",
  au: "australia",
  at: "austria",
  az: "azerbaijan",
  bs: "bahamas",
  bh: "bahrain",
  bd: "bangladesh",
  bb: "barbados",
  by: "belarus",
  be: "belgium",
  bz: "belize",
  bj: "benin",
  bt: "bhutan",
  bo: "bolivia",
  ba: "bosnia and herzegovina",
  bw: "botswana",
  br: "brazil",
  bn: "brunei",
  bg: "bulgaria",
  bf: "burkina faso",
  bi: "burundi",
  cv: "cabo verde",
  kh: "cambodia",
  cm: "cameroon",
  ca: "canada",
  cf: "central african republic",
  td: "chad",
  cl: "chile",
  cn: "china",
  co: "colombia",
  km: "comoros",
  cg: "congo",
  cr: "costa rica",
  hr: "croatia",
  cu: "cuba",
  cy: "cyprus",
  cz: "czech republic",
  dk: "denmark",
  dj: "djibouti",
  dm: "dominica",
  do: "dominican republic",
  ec: "ecuador",
  eg: "egypt",
  sv: "el salvador",
  gq: "equatorial guinea",
  er: "eritrea",
  ee: "estonia",
  sz: "eswatini",
  et: "ethiopia",
  fj: "fiji",
  fi: "finland",
  fr: "france",
  ga: "gabon",
  gm: "gambia",
  ge: "georgia",
  de: "germany",
  gh: "ghana",
  gr: "greece",
  gd: "grenada",
  gt: "guatemala",
  gn: "guinea",
  gw: "guinea-bissau",
  gy: "guyana",
  ht: "haiti",
  hn: "honduras",
  hu: "hungary",
  is: "iceland",
  in: "india",
  id: "indonesia",
  ir: "iran",
  iq: "iraq",
  ie: "ireland",
  il: "israel",
  it: "italy",
  jm: "jamaica",
  jp: "japan",
  jo: "jordan",
  kz: "kazakhstan",
  ke: "kenya",
  ki: "kiribati",
  kp: "korea (north)",
  kr: "korea (south)",
  kw: "kuwait",
  kg: "kyrgyzstan",
  la: "laos",
  lv: "latvia",
  lb: "lebanon",
  ls: "lesotho",
  lr: "liberia",
  ly: "libya",
  li: "liechtenstein",
  lt: "lithuania",
  lu: "luxembourg",
  mg: "madagascar",
  mw: "malawi",
  my: "malaysia",
  mv: "maldives",
  ml: "mali",
  mt: "malta",
  mh: "marshall islands",
  mr: "mauritania",
  mu: "mauritius",
  mx: "mexico",
  fm: "micronesia",
  md: "moldova",
  mc: "monaco",
  mn: "mongolia",
  me: "montenegro",
  ma: "morocco",
  mz: "mozambique",
  mm: "myanmar",
  na: "namibia",
  nr: "nauru",
  np: "nepal",
  nl: "netherlands",
  nz: "new zealand",
  ni: "nicaragua",
  ne: "niger",
  ng: "nigeria",
  mk: "north macedonia",
  no: "norway",
  om: "oman",
  pk: "pakistan",
  pw: "palau",
  ps: "palestine",
  pa: "panama",
  pg: "papua new guinea",
  py: "paraguay",
  pe: "peru",
  ph: "philippines",
  pl: "poland",
  pt: "portugal",
  qa: "qatar",
  ro: "romania",
  ru: "russia",
  rw: "rwanda",
  kn: "saint kitts and nevis",
  lc: "saint lucia",
  vc: "saint vincent and the grenadines",
  ws: "samoa",
  sm: "san marino",
  st: "sao tome and principe",
  sa: "saudi arabia",
  sn: "senegal",
  rs: "serbia",
  sc: "seychelles",
  sl: "sierra leone",
  sg: "singapore",
  sk: "slovakia",
  si: "slovenia",
  sb: "solomon islands",
  so: "somalia",
  za: "south africa",
  ss: "south sudan",
  es: "spain",
  lk: "sri lanka",
  sd: "sudan",
  sr: "suriname",
  se: "sweden",
  ch: "switzerland",
  sy: "syria",
  tw: "taiwan",
  tj: "tajikistan",
  tz: "tanzania",
  th: "thailand",
  tl: "timor-leste",
  tg: "togo",
  to: "tonga",
  tt: "trinidad and tobago",
  tn: "tunisia",
  tr: "turkey",
  tm: "turkmenistan",
  tv: "tuvalu",
  ug: "uganda",
  ua: "ukraine",
  ae: "united arab emirates",
  gb: "united kingdom",
  us: "united states",
  uy: "uruguay",
  uz: "uzbekistan",
  vu: "vanuatu",
  va: "vatican city",
  ve: "venezuela",
  vn: "vietnam",
  ye: "yemen",
  zm: "zambia",
  zw: "zimbabwe",
};

export const INSTALLERS = {
  pk: {
    islamabad: [
      {
        name: "Finish X",
        contact: "03346337777",
        address:
          "G-12, Service Road, near The Padel District Islamabad, Pakistan",
        instagram:
          "https://www.instagram.com/finishxofficial?igsh=MTVjam45eGUzdGVnYg==",
        google_map: "https://maps.app.goo.gl/fMPQx5w6Akid6rv47?g_st=ic",
        marker: {
          lat: 33.6596,
          lng: 72.9808,
        },
      },
      {
        name: "Cartist Co.",
        contact: "03335375623",
        address: "Cartist co., opposite NUST Gate # 02, H-13 Islamabad",
        instagram:
          "https://www.instagram.com/cartistco.pk?igsh=MWduZWtneThoejRzYw==",
        google_map: "https://maps.app.goo.gl/Zmw8Gx5zijotaGK6A?g_st=ic",
        marker: {
          lat: 33.6491,
          lng: 72.9912,
        },
      },
      {
        name: "Eleven Detailing",
        contact: "03335162466",
        address: "House 436-B, Street 8, G-10/2, Islamabad 44000",
        instagram:
          "https://www.instagram.com/elevendetailingstudio?igsi=YTRrbzhlN29mdTRq",
        google_map: "https://maps.app.goo.gl/K8HxzEYQCbLwirc16?g_st=ic",
        marker: {
          lat: 33.6784,
          lng: 73.0031,
        },
      },
      {
        name: "Car Chemistry",
        contact: "0324 4117527",
        address: "Toyota Sure, Plot 394 Potohar Rd, I-9/3, Islamabad 44000",
        instagram: "https://www.instagram.com/car_chemistry_c2",
        google_map: "https://maps.app.goo.gl/Qy512auCLeLf8zVd9?g_st=ic",
        marker: {
          lat: 33.6702,
          lng: 73.0641,
        },
      },
      {
        name: "Galaxy Car Detailing",
        contact: "03405771140",
        address:
          "Rajput Plaza Fazal E Haq Rd, near PIA booking office, Block E, G-6/2 Blue Area, Islamabad 44000",
        instagram: "https://www.instagram.com/galaxycardetailing",
        google_map: "https://maps.app.goo.gl/tZAy72KjpcxHEm9H7?g_st=ic",
        marker: {
          lat: 33.7190658,
          lng: 73.0748458,
        },
      },
    ],
    lahore: [
      {
        name: "Auto Aesthetica",
        contact: "0324 4117527",
        address: "385, Block F1, Johar Town, Lahore, 54770, Pakistan",
        instagram: "https://www.instagram.com/autoaestheticapk",
        google_map: "https://maps.app.goo.gl/7aHzuNxwr2zpq4Wp8?g_st=ipc",
        marker: {
          lat: 31.4721,
          lng: 74.2776,
        },
      },
    ],
    karachi: [
      {
        name: "Pro Tech Detaling",
        contact: "0330 4104107",
        address:
          "Plot No 87-A PECHS Block 2, Mahmood Gaznavi Road Off Khalid Bin Waleed Road Karachi, Pakistan",
        instagram: "https://www.instagram.com/protechdetailing.pk",
        google_map: "https://maps.app.goo.gl/39jk3Ypq7dMVtmq49?g_st=ic",
        marker: {
          lat: 24.8711,
          lng: 67.0624,
        },
      },
    ],
    rawalpindi: [
      {
        name: "Car Art",
        contact: "03325122952",
        address:
          "Commercial Plot B, Main Airport Road, St 9, Faisal Colony, Rawalpindi. 00444",
        instagram: "https://www.instagram.com/carartpakistan",
        google_map: "https://maps.app.goo.gl/QTyXYtntVB8GR6K87?g_st=ic",
        marker: {
          lat: 33.5855,
          lng: 73.0837,
        },
      },
    ],
    "wah cantt": [
      {
        name: "Wash X",
        contact: "0313 5051818",
        address:
          "Main Boulevard, Block B, New City Phase 2, Wah Cantt, Pakistan",
        instagram: "https://www.instagram.com/washxwahcantt1",
        google_map: "https://maps.app.goo.gl/A6iPFPZ6moYfezYJA?g_st=ic",
        marker: {
          lat: 33.7846,
          lng: 72.7314,
        },
      },
    ],
    jhelum: [
      {
        name: "Auto Correct",
        contact: "03213070100",
        address: "GT road, Kala Gujran, Jhelum. 49600",
        instagram: "https://www.instagram.com/autocorrectpk",
        google_map: "https://maps.app.goo.gl/29xcfdq23WRebMFz8?g_st=ic",
        marker: {
          lat: 32.9338,
          lng: 73.7431,
        },
      },
    ],
  },
  ge: {
    tbilisi: [
      {
        name: "Geowrap Tbilisi",
        contact: "+995593103113",
        address: "9 Farsadani St, Tbilisi 0131, Georgia",
        instagram: "https://www.instagram.com/geowrap",
        google_map: "https://maps.app.goo.gl/tWRwhmH149whrQqj9?g_st=ic",
        marker: {
          lat: 33.706513,
          lng: 72.930974,
        },
      },
    ],
  },
  by: {
    minsk: [
      {
        name: "Mihedov Wrap",
        contact: "+375293852167",
        address: "220073, Republic of Belarus, Minsk, Olshevskogo St. 23-35",
        instagram: "https://www.instagram.com/mihedov_wrap",
        marker: {
          lat: 53.9006011,
          lng: 27.558972,
        },
        google_maps: "https://maps.app.goo.gl/PPqBNFgLuxJHZtS7A",
      },
    ],
  },
};
