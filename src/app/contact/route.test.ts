import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn() }));
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail }) },
}));
vi.mock("~/env", () => ({
  env: { EMAIL_ADDRESS: "sender@example.com", EMAIL_TOKEN: "test-token" },
}));

beforeEach(() => {
  vi.resetModules();
  sendMail.mockReset().mockResolvedValue({});
});

function request(body: unknown) {
  return new Request("https://example.com/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /contact", () => {
  it("rejects malformed JSON without sending mail", async () => {
    const { POST } = await import("./route");
    const response = await POST(new Request("https://example.com/contact", {
      method: "POST",
      body: "{",
    }));
    expect(response.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    { name: " ", body: "Hello" },
    { name: "Ethan", body: " " },
    { name: "Ethan", body: "x".repeat(10_001) },
    { body: "Hello" },
  ])("rejects invalid messages: %o", async (body) => {
    const { POST } = await import("./route");
    expect((await POST(request(body))).status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("sends user input as plain text, not HTML", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ name: " Ethan ", body: "<b>Hello</b>" }));
    expect(response.status).toBe(200);
    expect(sendMail).toHaveBeenCalledWith({
      from: { name: "Ethangrebmeier.com", address: "sender@example.com" },
      to: "ethangrebmeier@gmail.com",
      subject: "Email From Ethangrebmeier.com",
      text: "From: Ethan\n\n<b>Hello</b>",
    });
  });

  it("returns a server error when email delivery fails", async () => {
    const { POST } = await import("./route");
    sendMail.mockRejectedValueOnce(new Error("SMTP failure"));
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      expect((await POST(request({ name: "Ethan", body: "Hello" }))).status).toBe(500);
    } finally {
      log.mockRestore();
    }
  });

  it("limits submissions and includes retry information", async () => {
    const { POST } = await import("./route");
    for (let i = 0; i < 3; i++) {
      expect((await POST(request({ name: "Ethan", body: "Hello" }))).status).toBe(200);
    }
    const response = await POST(request({ name: "Ethan", body: "Hello" }));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(sendMail).toHaveBeenCalledTimes(3);
  });
});
