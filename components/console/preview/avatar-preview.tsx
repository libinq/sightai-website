"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { MEDIA } from "@/content/media";
import { AVATAR_SCRIPTS, type CapValues } from "@/content/capability-params";

const BCP47: Record<string, string> = { zh: "zh-CN", en: "en-US", ms: "ms-MY", ja: "ja-JP" };
const STYLE: Record<string, { pitch: number; rate: number }> = {
  warm: { pitch: 1, rate: 0.95 },
  pro: { pitch: 0.9, rate: 1 },
  lively: { pitch: 1.15, rate: 1.06 },
};
const MAX = 200;

export const sampleScript = (values: CapValues) => AVATAR_SCRIPTS[String(values.scene)]?.[String(values.lang) as "zh"] ?? "";

/**
 * Avatar preview: speaks the script with the browser's speech synthesis and shows synced subtitles.
 * Production uses a cloned voice and lip-sync rendering; the UI says so.
 */
export function AvatarPreview({ values, script, onScript, onSpoken }: { values: CapValues; script: string; onScript: (s: string) => void; onSpoken?: (chars: number) => void }) {
  const t = useTranslations("console.avatar");
  const [speaking, setSpeaking] = useState(false);
  const [shown, setShown] = useState(0);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [tts, setTts] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const avatar = MEDIA.avatar;

  useEffect(() => setTts(typeof window !== "undefined" && "speechSynthesis" in window), []);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  // a new script / language resets the subtitle
  useEffect(() => setShown(0), [script, values.lang]);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (tts) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = () => {
    stop();
    const text = script.trim();
    if (!text) return;
    const rate = Number(values.rate ?? 1) * (STYLE[String(values.voice)]?.rate ?? 1);
    setShown(0);
    setSpeaking(true);
    let boundary = false;
    // fallback subtitle pacing when there's no TTS or it doesn't report word boundaries
    const cps = (String(values.lang) === "zh" || String(values.lang) === "ja" ? 5 : 14) * rate;
    const started = performance.now();
    timer.current = setInterval(() => {
      if (boundary) return;
      const n = Math.min(text.length, Math.round(((performance.now() - started) / 1000) * cps));
      setShown(n);
      if (n >= text.length && !tts) {
        stop();
        onSpoken?.(text.length);
      }
    }, 80);
    if (!tts) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = BCP47[String(values.lang)] ?? "zh-CN";
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.replace("_", "-").startsWith(u.lang.slice(0, 2)));
    if (v) u.voice = v;
    setVoiceName(v?.name ?? null);
    u.rate = Math.max(0.5, Math.min(2, rate));
    u.pitch = STYLE[String(values.voice)]?.pitch ?? 1;
    u.onboundary = (e) => {
      boundary = true;
      setShown(Math.min(text.length, e.charIndex + (e.charLength || 1)));
    };
    u.onend = () => {
      setShown(text.length);
      stop();
      onSpoken?.(text.length);
    };
    u.onerror = () => stop();
    window.speechSynthesis.speak(u);
  };

  const text = script.trim();
  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative blurred backdrop */}
        <img src={avatar.src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl" />
        {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF */}
        <img src={avatar.src} alt={t("alt")} className="absolute inset-0 size-full object-contain" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#07090c]/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
          {speaking && <span className="size-1.5 animate-[blink_1.6s_steps(1)_infinite] rounded-full bg-danger" aria-hidden />}
          {speaking ? t("speaking") : t("idle")} · {String(values.lang).toUpperCase()}
        </span>
        {values.subtitles !== false && shown > 0 && (
          <p aria-live="polite" className="absolute inset-x-6 bottom-4 mx-auto w-fit max-w-[90%] rounded-md bg-[#07090c]/80 px-3 py-1.5 text-center text-sm leading-relaxed text-white">
            {text.slice(0, shown)}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="av-script" className="text-sm text-text-1">
            {t("script")}
          </label>
          <span className="font-mono text-[11px] text-text-3">
            {script.length}/{MAX}
          </span>
        </div>
        <Textarea id="av-script" value={script} maxLength={MAX} rows={3} onChange={(e) => onScript(e.target.value)} className="mt-2" />
        <div className="mt-3 flex flex-wrap gap-2">
          {speaking ? (
            <Button onClick={stop}>
              <Square aria-hidden />
              {t("stop")}
            </Button>
          ) : (
            <Button onClick={speak} disabled={!text}>
              <Play aria-hidden />
              {t("speak")}
            </Button>
          )}
          <Button variant="secondary" onClick={() => onScript(sampleScript(values))}>
            <RotateCcw aria-hidden />
            {t("useSample")}
          </Button>
        </div>
      </div>

      <p className="flex items-start gap-2 text-[11px] text-text-3">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {tts ? t("note", { voice: voiceName ?? t("systemVoice") }) : t("noTts")}
      </p>
    </div>
  );
}
