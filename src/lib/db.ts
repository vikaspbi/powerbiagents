import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const globalForDb = globalThis as unknown as { lpbiDb?: Database.Database };

function resolveDbPath() {
  return path.join(process.cwd(), "data", "learninpowerbi.db");
}

function createDb() {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'en',
      theme TEXT NOT NULL DEFAULT 'system',
      xp INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dax_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      expression TEXT NOT NULL,
      passed INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      user_id TEXT PRIMARY KEY,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_customer_id TEXT,
      provider_subscription_id TEXT,
      current_period_end TEXT,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS purchase_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      provider TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

export function getDb() {
  if (!globalForDb.lpbiDb) {
    globalForDb.lpbiDb = createDb();
  }
  return globalForDb.lpbiDb;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  locale: string;
  theme: string;
  xp: number;
  streak: number;
  last_active_date: string | null;
  created_at: string;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  locale: string;
  theme: string;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  createdAt: string;
  plan: string;
  subscriptionStatus: string;
  isPro: boolean;
}

export function toPublicUser(user: UserRow, sub?: { plan: string; status: string; current_period_end: string | null } | null): PublicUser {
  const active =
    !!sub &&
    (sub.status === "active" || sub.status === "trialing") &&
    (!sub.current_period_end || new Date(sub.current_period_end).getTime() > Date.now());
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    locale: user.locale,
    theme: user.theme,
    xp: user.xp,
    streak: user.streak,
    lastActiveDate: user.last_active_date,
    createdAt: user.created_at,
    plan: active ? sub!.plan : "free",
    subscriptionStatus: sub?.status ?? "none",
    isPro: active,
  };
}
