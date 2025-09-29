const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicateBudgets() {
  console.log('🧹 Cleaning up duplicate budgets...');
  
  try {
    // Get all budgets grouped by categoryId
    const budgets = await prisma.budget.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'asc', // Keep the oldest ones
      },
    });

    // Group by categoryId
    const budgetsByCategory = {};
    budgets.forEach(budget => {
      if (!budgetsByCategory[budget.categoryId]) {
        budgetsByCategory[budget.categoryId] = [];
      }
      budgetsByCategory[budget.categoryId].push(budget);
    });

    // Find duplicates and delete them
    let deletedCount = 0;
    for (const [categoryId, categoryBudgets] of Object.entries(budgetsByCategory)) {
      if (categoryBudgets.length > 1) {
        console.log(`Found ${categoryBudgets.length} budgets for ${categoryBudgets[0].category.name}`);
        
        // Keep the first (oldest) one, delete the rest
        const toDelete = categoryBudgets.slice(1);
        for (const budget of toDelete) {
          await prisma.budget.delete({
            where: { id: budget.id },
          });
          deletedCount++;
          console.log(`  Deleted duplicate budget: ${budget.id}`);
        }
      }
    }

    console.log(`✅ Cleanup complete! Deleted ${deletedCount} duplicate budgets.`);
  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateBudgets();
