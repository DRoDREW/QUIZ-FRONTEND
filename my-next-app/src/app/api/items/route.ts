import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, image } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (description !== undefined && typeof description !== "string") {
      return NextResponse.json({ error: "Description must be a string" }, { status: 400 });
    }
    if (image !== undefined && typeof image !== "string") {
      return NextResponse.json({ error: "Image must be a string" }, { status: 400 });
    }
    const data = {
      title,
      description,
      image,
    };
    const newItem = await prisma.item.create({
      data,
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating item:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error &&
      typeof (error as any).code === "string" &&
      typeof (error as any).message === "string"
    ) {
      const prismaError = error as { code: string; message: string };
      return NextResponse.json(
        { error: `Prisma error ${prismaError.code}: ${prismaError.message}` },
        { status: 500 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}
