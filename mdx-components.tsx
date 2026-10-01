import type { MDXComponents } from "mdx/types";

// Typography for MDX content (case studies).
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (p) => <h2 className="mt-14 scroll-mt-24 text-2xl font-semibold text-text-1 first:mt-0" {...p} />,
    h3: (p) => <h3 className="mt-8 text-lg font-semibold text-text-1" {...p} />,
    p: (p) => <p className="mt-4 text-base leading-[1.8] text-text-2" {...p} />,
    ul: (p) => <ul className="mt-4 space-y-2 text-text-2" {...p} />,
    li: (p) => (
      <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-accent" {...p} />
    ),
    strong: (p) => <strong className="font-semibold text-text-1" {...p} />,
    blockquote: (p) => (
      <blockquote className="mt-8 border-l-2 border-accent bg-bg-1 px-6 py-5 text-lg text-text-1 [&_p]:mt-0 [&_p]:text-text-1" {...p} />
    ),
    ...components,
  };
}
