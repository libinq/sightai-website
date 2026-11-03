"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PublicUser } from "@/lib/auth/users";
import type { PlanId } from "@/content/plans";
import {
  makeApiKeys,
  makeEvent,
  makeEvents,
  makeSources,
  randomKey,
  type ApiKey,
  type EventItem,
  type EventStatus,
  type Range,
  type Source,
} from "@/lib/console/mock";

export interface CapConfig {
  sensitivity: number;
  threshold: number;
  channels: string[];
  schedule: "always" | "school" | "night";
  privacy: boolean;
}

export interface Member {
  email: string;
  role: "owner" | "admin" | "operator" | "viewer";
  pending?: boolean;
}

interface Store {
  v: 1;
  sources: Source[];
  events: EventItem[];
  apiKeys: ApiKey[];
  webhook: string;
  configs: Record<string, CapConfig>;
  members: Member[];
  readAt: number;
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
  addSource: (s: Omit<Source, "id" | "status" | "fps" | "resolution">) => void;
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

const EMPTY: Store = { v: 1, sources: [], events: [], apiKeys: [], webhook: "", configs: {}, members: [], readAt: 0 };

function seedStore(user: PublicUser): Store {
  const sources = user.subscriptions.flatMap((id) => makeSources(user.id, id));
  return {
    v: 1,
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

  // load after mount (timestamps are relative to "now", so never render them on the server)
  useEffect(() => {
    let loaded: Store | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) loaded = JSON.parse(raw) as Store;
    } catch {
      // storage unavailable — fall back to a fresh seed
    }
    setStore(loaded?.v === 1 ? loaded : seedStore(initialUser));
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
      addSource: (src) =>
        setStore((s) => ({
          ...s,
          sources: [{ ...src, id: `src_${Date.now().toString(36)}`, status: "online", fps: 25, resolution: "1920×1080" }, ...s.sources],
        })),
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
    [user, ready, store, range, subscribe, unsubscribe, setPlan, updateProfile, toasts, toast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
