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
} as const;
export const NAV_LINKS = [
  { ...ROUTES.SUPPORT },
  { ...ROUTES.DEALER_LOGIN },
] as const;

export const FOOTER_LINKS = [
  { id: 1, name: "One Film USA", href: "" },
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
