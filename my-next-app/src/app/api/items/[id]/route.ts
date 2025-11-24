import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
  }
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Error fetching item" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
  }
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
    const updatedItem = await prisma.item.update({
      where: { id },
      data: { title, description, image },
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
  }
  try {
    await prisma.item.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
