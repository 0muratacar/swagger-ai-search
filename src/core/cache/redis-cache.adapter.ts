import { CacheAdapter } from './cache.interface';

export class RedisCacheAdapter implements CacheAdapter {
  private client: any = null;

  constructor(
    private readonly config: {
      host: string;
      port: number;
      password?: string;
      db?: number;
    },
  ) {}

  private async getClient(): Promise<any> {
    if (this.client) return this.client;

    try {
      const Redis = (await import('ioredis')).default;
      this.client = new Redis({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
        db: this.config.db,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });
      return this.client;
    } catch {
      throw new Error(
        'ioredis is required for Redis caching. Install it: npm install ioredis',
      );
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = await this.getClient();
      const value = await redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const redis = await this.getClient();
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch {
      // Caching is best-effort
    }
  }
}
