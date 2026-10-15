import { setTimeout } from "node:timers/promises";
import { describe, expect, it } from "vitest";
import rateLimit from "./rateLimit";

describe("rateLimit", () => {
  it("allows the configured number of requests, then rejects", async () => {
    const limiter = rateLimit();
    const response = new Response();

    for (let remaining = 2; remaining >= 0; remaining--) {
      await expect(limiter.check(response, 3, "contact")).resolves.toBeUndefined();
      expect(response.headers.get("X-RateLimit-Remaining")).toBe(String(remaining));
    }

    await expect(limiter.check(response, 3, "contact")).rejects.toThrow(
      "Rate limit exceeded",
    );
    expect(response.headers.get("X-RateLimit-Limit")).toBe("3");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
  });

  it("tracks tokens independently", async () => {
    const limiter = rateLimit();
    await limiter.check(new Response(), 1, "first");
    await expect(limiter.check(new Response(), 1, "first")).rejects.toThrow();
    await expect(limiter.check(new Response(), 1, "second")).resolves.toBeUndefined();
  });

  it("allows requests again after the window expires", async () => {
    // Use the real clock: lru-cache captures its own monotonic performance clock.
    const limiter = rateLimit({ interval: 10 });
    await limiter.check(new Response(), 1, "contact");
    await setTimeout(25);
    await expect(limiter.check(new Response(), 1, "contact")).resolves.toBeUndefined();
  });
});
