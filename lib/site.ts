export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sightai.example";

/** Top-level pages (beyond products). Labels: messages `nav.<key>`. `wide` = desktop nav only from xl up. */
export const NAV_PAGES = [
  { key: "industries", href: "/industries" },
  { key: "cases", href: "/cases" },
  { key: "pricing", href: "/pricing" },
  { key: "technology", href: "/technology", wide: true },
  { key: "about", href: "/about" },
] as const;

// TODO: replace before launch 【待替换】
export const CONTACT = {
  email: "contact@sightai.example",
  phone: "+86 000-0000-0000",
  icp: "京ICP备00000000号",
};
