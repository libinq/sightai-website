"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, ArrowRight, BrainCircuit, Check, ClipboardCheck, Copy, Database, Rocket, Tags } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const NODES = [
  { key: "data", icon: Database },
  { key: "label", icon: Tags },
  { key: "train", icon: BrainCircuit },
  { key: "eval", icon: ClipboardCheck },
  { key: "deploy", icon: Rocket },
  { key: "monitor", icon: Activity },
] as const;

// Illustrative API samples — endpoint and fields are placeholders until the public API is finalized.
const SAMPLES = {
  python: `from sightai import Client

client = Client(api_key="YOUR_API_KEY")

# Detect road defects in a single frame
result = client.detect(
    model="road-defect-v3",
    image="frame_000123.jpg",
    confidence=0.5,
)

for d in result.detections:
    print(d.label, round(d.score, 2), d.bbox, d.depth_mm)`,
  curl: `curl -X POST https://api.sightai.example/v1/detect \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "model=road-defect-v3" \\
  -F "image=@frame_000123.jpg" \\
  -F "confidence=0.5"`,
  js: `import { SightAI } from "@sightai/sdk";

const client = new SightAI({ apiKey: process.env.SIGHTAI_API_KEY });

// Detect road defects in a single frame
const result = await client.detect({
  model: "road-defect-v3",
  image: await fs.promises.readFile("frame_000123.jpg"),
  confidence: 0.5,
});

result.detections.forEach((d) => console.log(d.label, d.score, d.bbox));`,
} as const;
type Lang = keyof typeof SAMPLES;

/** Minimal tokenizer: comments, strings, keywords, numbers. */
function highlight(code: string, lang: Lang) {
  const kw =
    lang === "python"
      ? /\b(from|import|for|in|print|round|def|return|as)\b/
      : lang === "js"
        ? /\b(import|from|const|await|new|async|return|process)\b/
        : /\b(curl)\b/;
  const re = new RegExp(
    `(${lang === "python" ? "#[^\\n]*" : "\\/\\/[^\\n]*"})|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|${kw.source}|(\\b\\d+(?:\\.\\d+)?\\b)|(-[A-Z]\\b|-X\\b)`,
    "g",
  );
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? "text-text-3 italic" : m[2] ? "text-accent-2" : m[3] ? "text-human" : m[4] ? "text-warn" : "text-accent";
    out.push(
      <span key={n++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

function CodeBlock({ lang }: { lang: Lang }) {
  const t = useTranslations("demos.arch");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLES[lang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#05070a]">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs text-[#9aa4af] hover:text-[#e8edf2]"
      >
        {copied ? <Check className="size-3.5 text-[#a3e635]" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
      <pre className="overflow-x-auto p-5 pr-24 font-mono text-[13px] leading-relaxed text-[#e8edf2]">
        <code>{highlight(SAMPLES[lang], lang)}</code>
      </pre>
    </div>
  );
}

export function ArchitectureDemo() {
  const t = useTranslations("demos.arch");
  const [active, setActive] = useState<(typeof NODES)[number]["key"]>("train");
  const node = NODES.find((n) => n.key === active)!;

  return (
    <div className="space-y-8">
      <div>
        <ol className="flex flex-wrap items-center gap-2" aria-label={t("flowLabel")}>
          {NODES.map((n, i) => {
            const Icon = n.icon;
            const on = n.key === active;
            return (
              <Fragment key={n.key}>
                <li>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="arch-detail"
                    onClick={() => setActive(n.key)}
                    className={cn(
                      "group relative flex min-h-14 items-center gap-2.5 rounded-[10px] border px-4 text-sm transition-colors",
                      on ? "border-accent bg-accent/10 text-text-1" : "border-line bg-bg-1 text-text-2 hover:border-line-strong hover:text-text-1",
                    )}
                  >
                    <span className="font-mono text-[11px] text-text-3">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className={cn("size-4", on ? "text-accent" : "text-text-3")} aria-hidden />
                    {t(`nodes.${n.key}.title`)}
                  </button>
                </li>
                {i < NODES.length - 1 && (
                  <li aria-hidden className="text-text-3">
                    <ArrowRight className="size-4" />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
        <div id="arch-detail" className="mt-4 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6" aria-live="polite">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <node.icon className="size-5 text-accent" aria-hidden />
            {t(`nodes.${active}.title`)}
          </h3>
          <p className="mt-2 text-sm text-text-2">{t(`nodes.${active}.desc`)}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {(t.raw(`nodes.${active}.points`) as string[]).map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-text-1">
                <span className="size-1.5 rounded-full bg-accent-2" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">{t("apiTitle")}</h3>
        <p className="mt-1 text-sm text-text-3">{t("apiNote")}</p>
        <Tabs defaultValue="python" className="mt-4">
          <TabsList aria-label={t("apiTitle")}>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          {(Object.keys(SAMPLES) as Lang[]).map((l) => (
            <TabsContent key={l} value={l}>
              <CodeBlock lang={l} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
