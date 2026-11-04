"use client";

import { useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PublicUser } from "@/lib/auth/users";
import type { PlanId } from "@/content/plans";
import { analyzeVideo } from "@/lib/console/batch";
import type { PreviewParams } from "@/lib/console/engine";
import type { CapValues } from "@/content/capability-params";
import {
  makeApiKeys,
  makeGateways,
  makeEvent,
  makeEvents,
  makeSources,
  randomKey,
  type ApiKey,
  type EventItem,
  type EventStatus,
  type Gateway,
  type Job,
  type Range,
  type Source,
} from "@/lib/console/mock";

export interface CapConfig {
  sensitivity: number;
  threshold: number;
  channels: string[];
  schedule: "always" | "school" | "night";
  privacy: boolean;
  /** capability-specific parameters tuned in the playground (content/capability-params) */
  values?: CapValues;
}

export interface Member {
  email: string;
  role: "owner" | "admin" | "operator" | "viewer";
  pending?: boolean;
}

interface Store {
  v: 3;
  sources: Source[];
  events: EventItem[];
  apiKeys: ApiKey[];
  webhook: string;
  configs: Record<string, CapConfig>;
  members: Member[];
  readAt: number;
  gateways: Gateway[];
  jobs: Job[];
}

export interface NewJob {
  capability: string;
  input: Job["input"];
  /** playable URL (object URL for uploads); only valid in this browser session */
  src: string;
  crossOrigin?: boolean;
  params: PreviewParams;
  classes: string[];
  /** the capability-specific values the job was started with */
  options?: CapValues;
}

export const DEFAULT_CONFIG: CapConfig = { sensitivity: 60, threshold: 0.8, channels: ["app", "webhook"], schedule: "always", privacy: true };

interface Toast {
  id: number;
  text: string;
  tone: "ok" | "danger";
}

interface ConsoleCtx {
  user: PublicUser;
  ready: boolean;
  store: Store;
  range: Range;
  setRange: (r: Range) => void;
  subscribe: (id: string) => Promise<{ ok: boolean; error?: string }>;
  unsubscribe: (id: string) => Promise<void>;
  setPlan: (plan: PlanId) => Promise<void>;
  updateProfile: (p: { name?: string; company?: string }) => Promise<void>;
  addSource: (s: Omit<Source, "id" | "status" | "fps" | "resolution"> & Partial<Pick<Source, "fps" | "resolution" | "status">>) => string;
  updateSource: (id: string, patch: Partial<Omit<Source, "id">>) => void;
  pushEvents: (events: EventItem[]) => void;
  addGateway: (name: string, site: string) => Gateway;
  removeGateway: (id: string) => void;
  createJob: (job: NewJob) => string;
  removeJob: (id: string) => void;
  removeSource: (id: string) => void;
  bindSource: (id: string, capability: string | undefined) => void;
  setEventStatus: (id: string, status: EventStatus) => void;
  createKey: (name: string) => string;
  revokeKey: (id: string) => void;
  setWebhook: (url: string) => void;
  saveConfig: (capId: string, c: CapConfig) => void;
  invite: (email: string, role: Member["role"]) => void;
  markRead: () => void;
  toasts: Toast[];
  toast: (text: string, tone?: Toast["tone"]) => void;
}

const Ctx = createContext<ConsoleCtx | null>(null);

export function useConsole() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useConsole outside ConsoleProvider");
  return c;
}

const EMPTY: Store = { v: 3, sources: [], events: [], apiKeys: [], webhook: "", configs: {}, members: [], readAt: 0, gateways: [], jobs: [] };

function seedStore(user: PublicUser): Store {
  const sources = user.subscriptions.flatMap((id) => makeSources(user.id, id));
  return {
    v: 3,
    gateways: makeGateways(user.id),
    jobs: [],
    sources,
    events: makeEvents(user.id, user.subscriptions, sources),
    apiKeys: makeApiKeys(user.id),
    webhook: "",
    configs: {},
    members: [
      { email: user.email, role: "owner" },
      { email: `ops@${user.email.split("@")[1] ?? "example.com"}`, role: "operator" },
    ],
    readAt: Date.now() - 3600e3,
  };
}

async function patchAccount(body: object) {
  const res = await fetch("/api/account", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; user?: PublicUser; error?: string };
}

export function ConsoleProvider({ initialUser, children }: { initialUser: PublicUser; children: React.ReactNode }) {
  const [user, setUser] = useState(initialUser);
  const [store, setStore] = useState<Store>(EMPTY);
  const [ready, setReady] = useState(false);
  const [range, setRange] = useState<Range>("7d");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const key = `sightai:console:${user.id}`;
  const toastId = useRef(0);
  const tj = useTranslations("console.jobs");

  // load after mount (timestamps are relative to "now", so never render them on the server)
  useEffect(() => {
    let loaded: Store | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) loaded = JSON.parse(raw) as Store;
    } catch {
      // storage unavailable — fall back to a fresh seed
    }
    let next: Store;
    if (loaded?.v === 3) next = loaded;
    else if ((loaded as { v?: number } | null)?.v === 2) next = { ...(loaded as unknown as Omit<Store, "v" | "gateways" | "jobs">), v: 3, gateways: makeGateways(initialUser.id), jobs: [] };
    else next = seedStore(initialUser);
    // a job can't survive a reload (its input lived in the old page) — mark interrupted ones failed
    next = { ...next, jobs: next.jobs.map((j) => (j.status === "processing" || j.status === "queued" ? { ...j, status: "failed", error: "interrupted" } : j)) };
    setStore(next);
    setReady(true);
  }, [key, initialUser]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(store));
    } catch {
      // quota / private mode
    }
  }, [store, ready, key]);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // live feed: a new event every few seconds from a subscribed capability
  const subsRef = useRef(user.subscriptions);
  useEffect(() => {
    subsRef.current = user.subscriptions;
  }, [user.subscriptions]);
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      if (document.hidden || subsRef.current.length === 0) return;
      setStore((s) => {
        const cap = subsRef.current[Math.floor(Math.random() * subsRef.current.length)];
        const e = makeEvent(Math.random, cap, s.sources, Date.now(), s.events.length);
        return e ? { ...s, events: [e, ...s.events].slice(0, 600) } : s;
      });
    }, 9000);
    return () => clearInterval(timer);
  }, [ready]);

  const subscribe = useCallback(
    async (id: string) => {
      const res = await patchAccount({ subscribe: id });
      if (!res.ok || !res.user) return { ok: false, error: res.error };
      setUser(res.user);
      setStore((s) => {
        if (s.sources.some((x) => x.capability === id)) return s;
        const sources = makeSources(user.id, id);
        const events = makeEvents(`${user.id}:${id}`, [id], sources);
        return { ...s, sources: [...s.sources, ...sources], events: [...events, ...s.events].sort((a, b) => b.ts - a.ts) };
      });
      return { ok: true };
    },
    [user.id],
  );

  const unsubscribe = useCallback(async (id: string) => {
    const res = await patchAccount({ unsubscribe: id });
    if (res.user) setUser(res.user);
    setStore((s) => ({ ...s, sources: s.sources.map((x) => (x.capability === id ? { ...x, capability: undefined } : x)) }));
  }, []);

  const setPlan = useCallback(async (plan: PlanId) => {
    const res = await patchAccount({ plan });
    if (res.user) setUser(res.user);
  }, []);

  const updateProfile = useCallback(async (p: { name?: string; company?: string }) => {
    const res = await patchAccount(p);
    if (res.user) setUser(res.user);
  }, []);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const patchJob = useCallback((id: string, patch: Partial<Job>) => setStore((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) })), []);

  const createJob = useCallback(
    (nj: NewJob) => {
      const id = `job_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
      const job: Job = { id, capability: nj.capability, input: nj.input, status: "processing", progress: 0, created: Date.now(), params: nj.params, options: nj.options };
      setStore((s) => ({ ...s, jobs: [job, ...s.jobs].slice(0, 50) }));
      let last = 0;
      analyzeVideo(nj.src, { params: nj.params, classes: nj.classes, seed: id, crossOrigin: nj.crossOrigin }, (p) => {
        if (p - last >= 0.04 || p === 1) {
          last = p;
          patchJob(id, { progress: p });
        }
      })
        .then((res) => {
          patchJob(id, {
            status: "succeeded",
            progress: 1,
            finished: Date.now(),
            result: { duration: res.duration, frames: res.frames, detections: res.detections, byClass: res.byClass, events: res.events.slice(0, 200) },
          });
          toast(tj("doneToast", { name: nj.input.name }));
        })
        .catch((err: Error) => {
          patchJob(id, { status: "failed", finished: Date.now(), error: err.name === "SecurityError" ? "cors" : err.message });
          toast(tj("failedToast", { name: nj.input.name }), "danger");
        });
      return id;
    },
    [patchJob, toast, tj],
  );

  const addGateway = useCallback((name: string, site: string) => {
    const gw: Gateway = {
      id: `gw_${Date.now().toString(36)}`,
      name,
      site,
      status: "pending",
      version: "2.8.1",
      ip: `192.168.${Math.floor(Math.random() * 20)}.${2 + Math.floor(Math.random() * 200)}`,
      token: `gwt_${randomKey().slice(0, 24)}`,
      created: Date.now(),
    };
    setStore((s) => ({ ...s, gateways: [...s.gateways, gw] }));
    return gw;
  }, []);

  // simulate the gateway phoning home a few seconds after it's been registered
  const pendingGw = store.gateways.filter((g) => g.status === "pending").map((g) => g.id).join(",");
  useEffect(() => {
    if (!pendingGw) return;
    const timer = setTimeout(() => {
      setStore((s) => ({ ...s, gateways: s.gateways.map((g) => (g.status === "pending" ? { ...g, status: "online" } : g)) }));
    }, 6000);
    timers.current.push(timer);
    return () => clearTimeout(timer);
  }, [pendingGw]);

  const value = useMemo<ConsoleCtx>(
    () => ({
      user,
      ready,
      store,
      range,
      setRange,
      subscribe,
      unsubscribe,
      setPlan,
      updateProfile,
      addSource: (src) => {
        const id = `src_${Date.now().toString(36)}`;
        setStore((s) => ({ ...s, sources: [{ status: "online", fps: 25, resolution: "1920×1080", ...src, id }, ...s.sources] }));
        return id;
      },
      updateSource: (id, patch) => setStore((s) => ({ ...s, sources: s.sources.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      pushEvents: (events) => setStore((s) => ({ ...s, events: [...events, ...s.events].slice(0, 600) })),
      addGateway,
      removeGateway: (id) =>
        setStore((s) => ({ ...s, gateways: s.gateways.filter((g) => g.id !== id), sources: s.sources.map((x) => (x.gatewayId === id ? { ...x, gatewayId: undefined, status: "offline" } : x)) })),
      createJob,
      removeJob: (id) => setStore((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) })),
      removeSource: (id) => setStore((s) => ({ ...s, sources: s.sources.filter((x) => x.id !== id) })),
      bindSource: (id, capability) =>
        setStore((s) => ({ ...s, sources: s.sources.map((x) => (x.id === id ? { ...x, capability } : x)) })),
      setEventStatus: (id, status) =>
        setStore((s) => ({ ...s, events: s.events.map((e) => (e.id === id ? { ...e, status } : e)) })),
      createKey: (name) => {
        const secret = randomKey();
        const prefix = "sk_live_";
        setStore((s) => ({
          ...s,
          apiKeys: [{ id: `key_${Date.now().toString(36)}`, name, prefix, tail: secret.slice(-4), created: Date.now(), lastUsed: null, calls: 0 }, ...s.apiKeys],
        }));
        return prefix + secret;
      },
      revokeKey: (id) => setStore((s) => ({ ...s, apiKeys: s.apiKeys.filter((k) => k.id !== id) })),
      setWebhook: (webhook) => setStore((s) => ({ ...s, webhook })),
      saveConfig: (capId, c) => setStore((s) => ({ ...s, configs: { ...s.configs, [capId]: c } })),
      invite: (email, role) => setStore((s) => ({ ...s, members: [...s.members, { email, role, pending: true }] })),
      markRead: () => setStore((s) => ({ ...s, readAt: Date.now() })),
      toasts,
      toast,
    }),
    [user, ready, store, range, subscribe, unsubscribe, setPlan, updateProfile, toasts, toast, addGateway, createJob],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
