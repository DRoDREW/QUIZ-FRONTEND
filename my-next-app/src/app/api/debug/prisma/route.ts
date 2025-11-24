import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    // Mask the DATABASE_URL value for security
    const rawDatabaseUrl = process.env.DATABASE_URL ?? "Not set";
    let maskedDatabaseUrl = rawDatabaseUrl;
    if (rawDatabaseUrl.startsWith("file:")) {
      maskedDatabaseUrl = "file:***masked***";
    }

    // Perform a simple Prisma query to count items
    const itemCount = await prisma.item.count();

    return NextResponse.json({
      status: "success",
      databaseUrl: maskedDatabaseUrl,
      itemCount,
    });
  } catch (error) {
    console.error("Error in diagnostic Prisma route:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
