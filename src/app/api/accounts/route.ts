import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Accounts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, accountType } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Account name is required" },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        name,
        accountType,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Account ID required" },
        { status: 400 }
      );
    }

    const account = await prisma.account.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Account update error:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Account ID required" },
        { status: 400 }
      );
    }

    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
