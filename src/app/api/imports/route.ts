import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const imports = await prisma.import.findMany({
      include: {
        transactions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { importedAt: "desc" },
    });

    const importsWithCounts = imports.map((importRecord) => ({
      ...importRecord,
      transactionCount: importRecord.transactions.length,
    }));

    return NextResponse.json(importsWithCounts);
  } catch (error) {
    console.error("Imports API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
