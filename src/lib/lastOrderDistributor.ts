export type LastOrderDistributor = {
  id: string;
  name: string;
  slug: string;
};

const storageKey = (userId: string | null) => `aqua:lastOrderDistributor:${userId || "guest"}`;

export function getLastOrderDistributor(userId: string | null): LastOrderDistributor | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const record = value as Record<string, unknown>;
    return typeof record.id === "string" && typeof record.name === "string" && typeof record.slug === "string" && record.slug
      ? { id: record.id, name: record.name, slug: record.slug }
      : null;
  } catch {
    return null;
  }
}

export function saveLastOrderDistributor(userId: string | null, distributor: LastOrderDistributor) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(distributor));
  } catch {
    // Browsers can disable local storage; placing an order still succeeds.
  }
}

export function clearLastOrderDistributor(userId: string | null) {
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    // Storage may be unavailable.
  }
}