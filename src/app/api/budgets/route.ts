import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Budgets API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { categoryId, amount, startDate, endDate } = await request.json();

    if (!categoryId || !amount || !startDate) {
      return NextResponse.json(
        { error: "Category ID, amount, and start date are required" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        categoryId,
        amount: parseFloat(amount),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Budget creation error:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID required" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...updates,
        amount: updates.amount ? parseFloat(updates.amount) : undefined,
        startDate: updates.startDate ? new Date(updates.startDate) : undefined,
        endDate: updates.endDate ? new Date(updates.endDate) : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Budget update error:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
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
        { error: "Budget ID required" },
        { status: 400 }
      );
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Budget delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
