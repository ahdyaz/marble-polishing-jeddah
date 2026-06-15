import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, heroSlides, siteSettings, contactMessages, adminPasswords, InsertService, InsertHeroSlide, InsertSiteSetting, InsertContactMessage, InsertAdminPassword } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Services
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.order));
}

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(asc(services.order));
}

export async function createService(data: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(services).values(data);
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(services).where(eq(services.id, id));
}

// Hero Slides
export async function getHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).where(eq(heroSlides.isActive, true)).orderBy(asc(heroSlides.order));
}

export async function getAllHeroSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).orderBy(asc(heroSlides.order));
}

export async function createHeroSlide(data: InsertHeroSlide) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(heroSlides).values(data);
}

export async function updateHeroSlide(id: number, data: Partial<InsertHeroSlide>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(heroSlides).set(data).where(eq(heroSlides.id, id));
}

export async function deleteHeroSlide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}

// Site Settings
export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}

export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertSiteSetting(key: string, value: string, label?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(siteSettings).values({ key, value, label }).onDuplicateKeyUpdate({ set: { value } });
}

export async function upsertManySettings(settings: { key: string; value: string; label?: string }[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  for (const s of settings) {
    await db.insert(siteSettings).values({ key: s.key, value: s.value, label: s.label }).onDuplicateKeyUpdate({ set: { value: s.value } });
  }
}

// Contact Messages
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(contactMessages).values(data);
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(asc(contactMessages.createdAt));
}

export async function markMessageRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
}

// Admin Passwords
export async function getAdminPassword() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(adminPasswords).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function setAdminPassword(passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await getAdminPassword();
  if (existing) {
    await db.update(adminPasswords).set({ passwordHash }).where(eq(adminPasswords.id, existing.id));
  } else {
    await db.insert(adminPasswords).values({ passwordHash });
  }
}
