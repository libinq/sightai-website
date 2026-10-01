import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// next-intl request config. Wired via alias (equivalent to what `next-intl/plugin` does)
// so the build doesn't depend on the plugin's native @swc/core binary.
const I18N_REQUEST = "./i18n/request.ts";

const nextConfig: NextConfig = {
  // Docker / on-prem deployment
  output: "standalone",
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: {
    resolveAlias: { "next-intl/config": I18N_REQUEST },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next-intl/config": path.resolve(process.cwd(), I18N_REQUEST),
    };
    return config;
  },
};

// Case studies live in content/cases/{locale}/*.mdx
// MDX bodies are rendered via a client component (components/sections/case-body.tsx).
const withMDX = createMDX({});

export default withMDX(nextConfig);
