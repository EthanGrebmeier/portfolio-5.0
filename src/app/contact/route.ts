import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "~/env";

import rateLimit from "~/helpers/server/rateLimit";

export const runtime = "nodejs";

// Best-effort, per-instance protection; use shared storage for a distributed limit.
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 5 });
const messageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(10_000),
});

export async function POST(req: Request) {
  const rateLimitedResponse = new Response("Rate Limit Exceeded", {
    status: 429,
    headers: { "Retry-After": "60" },
  });

  try {
    await limiter.check(rateLimitedResponse, 3, "CONTACT_FORM");
  } catch {
    return rateLimitedResponse;
  }

  let requestBody: unknown;
  try {
    requestBody = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsedBody = messageSchema.safeParse(requestBody);
  if (!parsedBody.success) {
    return new Response("Invalid Message Body", { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_ADDRESS,
      pass: env.EMAIL_TOKEN,
    },
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    await transporter.sendMail({
      from: { name: "Ethangrebmeier.com", address: env.EMAIL_ADDRESS },
      to: "ethangrebmeier@gmail.com",
      subject: "Email From Ethangrebmeier.com",
      text: `From: ${parsedBody.data.name}\n\n${parsedBody.data.body}`,
    });
  } catch {
    console.error("Contact form email delivery failed");
    return new Response("Could not send email", { status: 500 });
  }

  return new Response("Success", { status: 200 });
}
