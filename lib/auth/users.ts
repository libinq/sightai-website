import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PlanId } from "@/content/plans";
import { DEMO_ACCOUNT } from "./demo";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  company: string;
  industry: string;
  passwordHash: string;
  plan: PlanId;
  subscriptions: string[];
  createdAt: string;
}

export type PublicUser = Omit<UserRecord, "passwordHash">;

/**
 * Minimal user store: a JSON file under .data/ (gitignored). On read-only filesystems
 * (e.g. serverless) it silently falls back to memory — swap for a real database in production.
 */
const FILE = path.join(process.cwd(), ".data", "users.json");


const g = globalThis as unknown as { __sightaiUsers?: UserRecord[] };

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

function demoUser(): UserRecord {
  return {
    id: "demo",
    email: DEMO_ACCOUNT.email,
    name: "Demo",
    company: "SightAI Demo Org",
    industry: "education",
    passwordHash: hashPassword(DEMO_ACCOUNT.password),
    plan: "pro",
    subscriptions: ["edu-bullying", "edu-contraband", "retail-shelf", "retail-heatmap", "sports-refcam", "sports-highlights", "mfg-defect", "mfg-road"],
    createdAt: new Date().toISOString(),
  };
}

async function load(): Promise<UserRecord[]> {
  if (g.__sightaiUsers) return g.__sightaiUsers;
  let users: UserRecord[] = [];
  try {
    users = JSON.parse(await readFile(FILE, "utf8")) as UserRecord[];
  } catch {
    // first run or read-only FS
  }
  if (!users.some((u) => u.email === DEMO_ACCOUNT.email)) users.push(demoUser());
  g.__sightaiUsers = users;
  return users;
}

async function persist(users: UserRecord[]) {
  g.__sightaiUsers = users;
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(users, null, 2));
  } catch {
    // read-only FS: keep in memory
  }
}

export function toPublic(user: UserRecord): PublicUser {
  const { passwordHash, ...rest } = user;
  void passwordHash;
  return rest;
}

export async function findByEmail(email: string) {
  return (await load()).find((u) => u.email === email.toLowerCase());
}

export async function findById(id: string) {
  return (await load()).find((u) => u.id === id);
}

export async function createUser(input: { email: string; password: string; name: string; company: string; industry: string }) {
  const users = await load();
  const user: UserRecord = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    name: input.name,
    company: input.company,
    industry: input.industry,
    passwordHash: hashPassword(input.password),
    plan: "trial",
    subscriptions: [],
    createdAt: new Date().toISOString(),
  };
  await persist([...users, user]);
  return user;
}

export async function updateUser(id: string, patch: Partial<Omit<UserRecord, "id" | "passwordHash">>) {
  const users = await load();
  const i = users.findIndex((u) => u.id === id);
  if (i < 0) return undefined;
  users[i] = { ...users[i], ...patch };
  await persist(users);
  return users[i];
}
