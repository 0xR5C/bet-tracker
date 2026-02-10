import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  const { id } = await prisma.bet.create({
    data: {
      authorId: userId,
      text: "",
    }
  });

  return NextResponse.json({
    betId: id,
  });
}