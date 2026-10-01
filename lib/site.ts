export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sightai.example";

/** Top-level pages (beyond products). Labels: messages `nav.<key>`. */
export const NAV_PAGES = [
  { key: "solutions", href: "/solutions" },
  { key: "cases", href: "/cases" },
  { key: "technology", href: "/technology" },
  { key: "resources", href: "/resources" },
  { key: "about", href: "/about" },
] as const;

export const INDUSTRIES = [
  "transport",
  "manufacturing",
  "energy",
  "construction",
  "media",
  "retail",
] as const;

// TODO: replace before launch 【待替换】
export const CONTACT = {
  email: "contact@sightai.example",
  phone: "+86 000-0000-0000",
  icp: "京ICP备00000000号",
};
