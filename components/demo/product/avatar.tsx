"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Cpu, PackageCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Sample sentences per presenter language (content in that language, independent of site locale).
const LANGS = {
  zh: { label: "中文", sample: "欢迎来到赛事服务中心，今天的比赛将在下午三点开始。" },
  en: { label: "English", sample: "Welcome to the venue. Today's match kicks off at 3 p.m." },
  ms: { label: "Bahasa Melayu", sample: "Selamat datang ke pusat perkhidmatan. Perlawanan bermula pukul 3 petang." },
  ja: { label: "日本語", sample: "会場へようこそ。本日の試合は午後3時に始まります。" },
} as const;
type Lang = keyof typeof LANGS;

const AVATARS = [
  { id: "a", suit: "#1f2a44", accent: "#22d3ee", hair: "#1b1410", skin: "#d9b49a", long: false },
  { id: "b", suit: "#3b1f44", accent: "#a78bfa", hair: "#3a2414", skin: "#e2bfa3", long: true },
  { id: "c", suit: "#1d3a2c", accent: "#a3e635", hair: "#0f0f10", skin: "#b98a6a", long: false },
];
const SCENES = ["live", "service", "training"] as const;
type Scene = (typeof SCENES)[number];

function Presenter({ av, talking }: { av: (typeof AVATARS)[number]; talking: boolean }) {
  return (
    <svg viewBox="0 0 300 300" className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2" aria-hidden>
      {av.long && <path d="M100 110 q-10 90 20 130 h60 q30 -40 20 -130z" fill={av.hair} />}
      <path d="M50 300 c6 -70 46 -100 100 -100 s94 30 100 100z" fill={av.suit} />
      <path d="M128 202 l22 40 l22 -40" fill="#e8edf2" />
      <path d="M146 214 h8 l4 40 h-16z" fill={av.accent} />
      <rect x="134" y="160" width="32" height="44" rx="10" fill={av.skin} />
      <ellipse cx="150" cy="118" rx="48" ry="58" fill={av.skin} />
      <path d={av.long ? "M100 112 q4 -66 52 -66 q48 0 50 66 q-18 -34 -52 -36 q-34 2 -50 36z" : "M102 104 q6 -56 50 -56 q44 0 46 56 q-10 -26 -48 -28 q-36 2 -48 28z"} fill={av.hair} />
      <ellipse cx="131" cy="116" rx="5" ry="6" fill="#1b1410" />
      <ellipse cx="169" cy="116" rx="5" ry="6" fill="#1b1410" />
      <path d="M126 104 q6 -4 12 0 M162 104 q6 -4 12 0" stroke="#3a2414" strokeWidth="2.5" fill="none" />
      {/* mouth: animates while speaking */}
      <ellipse
        cx="150"
        cy="150"
        rx="11"
        ry="4"
        fill="#7a2e2e"
        className={cn("origin-[150px_150px]", talking && "animate-[mouth_0.22s_ease-in-out_infinite_alternate]")}
      />
    </svg>
  );
}

export function AvatarDemo() {
  const t = useTranslations("demos.avatar");
  const [avatar, setAvatar] = useState(0);
  const [lang, setLang] = useState<Lang>("zh");
  const [scene, setScene] = useState<Scene>("service");
  const [text, setText] = useState<string>(LANGS.zh.sample);
  const [spoken, setSpoken] = useState("");
  const [talking, setTalking] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  const speak = () => {
    const full = text.trim() || LANGS[lang].sample;
    clearInterval(timer.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSpoken(full);
      return;
    }
    setSpoken("");
    setTalking(true);
    const chars = Array.from(full);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setSpoken(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        clearInterval(timer.current);
        setTimeout(() => setTalking(false), 300);
      }
    }, lang === "zh" || lang === "ja" ? 110 : 45);
  };

  const pickLang = (l: Lang) => {
    setLang(l);
    setText(LANGS[l].sample);
  };

  const av = AVATARS[avatar];
  const pill = (active: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-3 text-sm transition-colors",
      active ? "border-human/60 bg-human/10 text-text-1" : "border-line text-text-2 hover:text-text-1",
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* stage */}
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#0b0d14]">
          {scene === "live" && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#3b1f44,#0b0d14_70%)]" />
              <span className="absolute left-3 top-3 rounded bg-[#f43f5e] px-2 py-0.5 font-mono text-[11px] font-semibold text-white">LIVE</span>
              <div className="absolute bottom-16 right-4 w-36 rounded-md border border-white/15 bg-black/50 p-2 text-[11px] text-[#e8edf2] backdrop-blur">
                <div className="mb-1 h-12 rounded bg-white/10" />
                {t("productCard")}
              </div>
            </>
          )}
          {scene === "service" && (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a2230,#0b0d14)]" />
              <div className="absolute right-4 top-4 w-40 space-y-1.5 rounded-md border border-white/10 bg-black/40 p-3 font-mono text-[10px] text-[#9aa4af]">
                <p className="text-[#e8edf2]">{t("infoPanel")}</p>
                <p>A · 09:00–21:00</p>
                <p>B · 10:00–18:00</p>
              </div>
            </>
          )}
          {scene === "training" && (
            <>
              <div className="absolute inset-0 bg-[#10151c]" />
              <div className="absolute left-4 top-4 h-[45%] w-[38%] rounded-md border border-white/10 bg-[#e8edf2] p-3">
                <div className="h-2 w-2/3 rounded bg-[#07090c]/70" />
                <div className="mt-2 h-1.5 w-full rounded bg-[#07090c]/30" />
                <div className="mt-1.5 h-1.5 w-5/6 rounded bg-[#07090c]/30" />
                <div className="mt-3 h-10 w-full rounded bg-[#22d3ee]/30" />
              </div>
            </>
          )}
          <Presenter av={av} talking={talking} />
          <span className="absolute right-3 top-3 rounded border border-white/20 bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-[#e8edf2]">
            {t("aiLabel")}
          </span>
          {/* subtitles */}
          <div className="absolute inset-x-4 bottom-4 min-h-10 rounded-md bg-black/65 px-3 py-2 text-center text-sm text-white backdrop-blur" aria-live="polite">
            {spoken || <span className="text-white/50">{t("subtitleHint")}</span>}
          </div>
          {/* waveform */}
          <div className="absolute left-3 top-12 flex h-6 items-end gap-0.5" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={cn("w-1 rounded-full bg-human", talking ? "animate-[eq_0.5s_ease-in-out_infinite_alternate]" : "h-1")}
                style={talking ? { height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 5) * -0.1}s` } : undefined}
              />
            ))}
          </div>
        </div>

        {/* controls */}
        <div className="space-y-5 rounded-[var(--radius-card)] border border-line bg-bg-1 p-5">
          <fieldset>
            <legend className="text-xs text-text-3">{t("avatar")}</legend>
            <div className="mt-2 flex gap-2">
              {AVATARS.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={avatar === i}
                  aria-label={`${t("avatar")} ${i + 1}`}
                  onClick={() => setAvatar(i)}
                  className={cn("grid size-12 place-items-center rounded-full border-2", avatar === i ? "border-human" : "border-line")}
                >
                  <span className="size-8 rounded-full" style={{ background: `linear-gradient(${a.skin} 50%, ${a.suit} 50%)` }} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs text-text-3">{t("language")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(LANGS) as Lang[]).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => pickLang(l)} className={pill(lang === l)}>
                  {LANGS[l].label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-warn">{t("langNote")}</p>
          </fieldset>
          <fieldset>
            <legend className="text-xs text-text-3">{t("scene")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SCENES.map((s) => (
                <button key={s} type="button" aria-pressed={scene === s} onClick={() => setScene(s)} className={pill(scene === s)}>
                  {t(`scenes.${s}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              speak();
            }}
            className="space-y-2"
          >
            <label htmlFor="avatar-text" className="text-xs text-text-3">
              {t("inputLabel")}
            </label>
            <div className="flex gap-2">
              <Input id="avatar-text" value={text} maxLength={120} onChange={(e) => setText(e.target.value)} placeholder={t("placeholder")} />
              <Button type="submit" size="icon" aria-label={t("speak")}>
                <Send aria-hidden />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* production flow */}
      <ol className="grid gap-3 sm:grid-cols-3">
        {[Camera, Cpu, PackageCheck].map((Icon, i) => (
          <li key={i} className="flex items-center gap-4 rounded-[10px] border border-line bg-bg-1 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-human/40 bg-human/10 text-human">
              <Icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-mono text-[11px] text-text-3">{String(i + 1).padStart(2, "0")}</span>
              <span className="block text-sm text-text-1">{t(`flow.${i}`)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
