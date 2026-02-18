import { CacheAdapter } from './cache.interface';

export class MemoryCacheAdapter implements CacheAdapter {
  private store = new Map<string, { value: string; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return JSON.parse(entry.value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds || 1800;
    this.store.set(key, {
      value: JSON.stringify(value),
      expiresAt: Date.now() + ttl * 1000,
    });
  }
}
