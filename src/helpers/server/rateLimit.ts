import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval ?? 500,
    ttl: options?.interval ?? 60000,
  });

  return {
    check: (res: Response, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const currentUsage = (tokenCache.get(token) ?? 0) + 1;
        // Preserve the original expiry instead of extending it on every request.
        tokenCache.set(token, currentUsage, { noUpdateTTL: true });
        const isRateLimited = currentUsage > limit;
        res.headers.set("X-RateLimit-Limit", String(limit));
        res.headers.set(
          "X-RateLimit-Remaining",
          isRateLimited ? "0" : String(limit - currentUsage),
        );

        return isRateLimited
          ? reject(new Error("Rate limit exceeded"))
          : resolve();
      }),
  };
}
