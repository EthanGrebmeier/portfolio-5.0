import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "~/env";

import rateLimit from "~/helpers/server/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 5, // Max 5 users per second
});

export async function POST(req: Request) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_ADDRESS,
      pass: env.EMAIL_TOKEN,
    },
  });

  const requestBody = await req.json();

  const parsedBody = z
    .object({
      body: z.string(),
    })
    .safeParse(requestBody);

  const body = parsedBody.success ? parsedBody.data.body : null;

  if (!body) {
    return new Response("Missing Message Body", { status: 400 });
  }

  const rateLimitedResponse = new Response("Rate Limit Exceeded", {
    status: 429,
  });

  try {
    await limiter.check(rateLimitedResponse, 3, "CACHE_TOKEN"); // 3 requests per minute
  } catch {
    return rateLimitedResponse;
  }

  const html = `
      <body>
          <h1> Email From Ethangrebmeier.com </h1>
          <p> ${body} </p>
      </body>
  `;

  const mailOptions = {
    from: `Ethangrebmeier.com`,
    to: `ethangrebmeier@gmail.com`,
    subject: "Email From Ethangrebmeier.com",
    html: html,
  };

  const mailPromise = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        reject(Error("Could not send email"));
      } else {
        resolve("success");
      }
    });
  });

  try {
    await mailPromise;
  } catch (_) {
    return new Response("Could not send email", { status: 500 });
  }

  return new Response("Success", { status: 200 });
}
