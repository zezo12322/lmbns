import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

const ROUTE = "/api/public/intake";

const intakeSchema = z.object({
  requestorName: z.string().trim().min(3).max(150),
  phone: z.string().trim().min(7).max(30),
  nationalId: z.string().trim().min(5).max(30).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(5000),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`public-intake:${ip}`, 10, 60_000);
  const rateLimitHeaders = buildRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt);

  if (!rateLimit.allowed) {
    log.warn("intake.rate_limited", { route: ROUTE, ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await req.json();
    const parsed = intakeSchema.safeParse(body);
    if (!parsed.success) {
      log.warn("intake.validation_failed", { route: ROUTE, ip });
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.error.flatten(),
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const data = parsed.data;

    const newRequest = await prisma.intakeRequest.create({
      data: {
        requestorName: data.requestorName,
        phone: data.phone,
        nationalId: data.nationalId || null,
        description: data.description,
        status: "PENDING",
      },
    });

    log.info("intake.created", { route: ROUTE, entityId: newRequest.id, ip });
    return NextResponse.json(
      { success: true, id: newRequest.id },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    log.error("intake.create.failed", { route: ROUTE, ip, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
