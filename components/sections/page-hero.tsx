import { Container, Eyebrow, GridBackdrop } from "@/components/visual/primitives";

/** Standard hero for inner pages. */
export function PageHero({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pb-14 pt-32 md:pb-20 md:pt-40">
      <GridBackdrop />
      <div aria-hidden className="absolute left-1/2 top-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-3xl" />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl text-[36px] font-semibold leading-[1.1] md:text-[56px]">{title}</h1>
        {desc && <p className="mt-5 max-w-2xl text-base text-text-2 md:text-lg">{desc}</p>}
        {children}
      </Container>
    </section>
  );
}
