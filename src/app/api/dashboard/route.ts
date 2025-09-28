import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions for the period
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
      },
    });

    // Calculate net worth (simplified - sum of all positive amounts)
    const netWorth = transactions
      .filter((t) => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate monthly spend (negative amounts)
    const monthlySpend = transactions
      .filter((t) => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    // Get spend by category
    const spendByCategory = transactions
      .filter((t) => Number(t.amount) < 0 && t.category)
      .reduce((acc, t) => {
        const category = t.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + Math.abs(Number(t.amount));
        return acc;
      }, {} as Record<string, number>);

    // Get top 3 categories
    const topCategories = Object.entries(spendByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    // Get monthly trends (last 6 months)
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= month && tDate < nextMonth;
      });

      const monthSpend = monthTransactions
        .filter((t) => Number(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

      const monthIncome = monthTransactions
        .filter((t) => Number(t.amount) > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyTrends.push({
        month: month.toISOString().substring(0, 7),
        spend: monthSpend,
        income: monthIncome,
        net: monthIncome - monthSpend,
      });
    }

    // Get account breakdown
    const accountBreakdown = transactions
      .filter((t) => Number(t.amount) > 0)
      .reduce((acc, t) => {
        const accountName = t.account.name;
        acc[accountName] = (acc[accountName] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      netWorth,
      monthlySpend,
      topCategories,
      spendByCategory,
      monthlyTrends,
      accountBreakdown,
      totalTransactions: transactions.length,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
