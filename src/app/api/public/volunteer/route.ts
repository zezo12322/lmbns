import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

const ROUTE = "/api/public/volunteer";

const volunteerSchema = z.object({
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  motivation: z.string().trim().min(10).max(5000),
  availability: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`public-volunteer:${ip}`, 10, 60_000);
  const rateLimitHeaders = buildRateLimitHeaders(rateLimit.remaining, rateLimit.resetAt);

  if (!rateLimit.allowed) {
    log.warn("volunteer.rate_limited", { route: ROUTE, ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await req.json();
    const parsed = volunteerSchema.safeParse(body);
    if (!parsed.success) {
      log.warn("volunteer.validation_failed", { route: ROUTE, ip });
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.error.flatten(),
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const data = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      let profile = await tx.volunteerProfile.findFirst({
        where: { phone: data.phone },
      });

      if (!profile) {
        profile = await tx.volunteerProfile.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email || null,
            status: "APPLIED",
            skills: [],
          },
        });
      }

      const application = await tx.volunteerApplication.create({
        data: {
          volunteerId: profile.id,
          motivation: data.motivation,
          availability: data.availability || null,
          status: "PENDING",
        },
      });

      return application;
    });

    log.info("volunteer.application_created", { route: ROUTE, entityId: result.id, ip });
    return NextResponse.json(
      { success: true, id: result.id },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    log.error("volunteer.create.failed", { route: ROUTE, ip, error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
