import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to create categories
async function createCategories() {
  const categoryData = [
    { name: "Housing", emoji: "🏠" },
    { name: "Food", emoji: "🍽️" },
    { name: "Groceries", emoji: "🛒" },
    { name: "Wellness", emoji: "💚" },
    { name: "Daily Transport", emoji: "🚗" },
    { name: "Travel", emoji: "✈️" },
    { name: "Technology", emoji: "💻" },
    { name: "Personal Care", emoji: "🪥" },
    { name: "LEGO", emoji: "🧱" },
    { name: "Clothing", emoji: "👕" },
    { name: "Gifts", emoji: "🎁" },
    { name: "Entertainment", emoji: "🎬" },
    { name: "Subscription", emoji: "📱" },
    { name: "Going Out", emoji: "🍻" },
    { name: "Transfer", emoji: "🔄" },
  ];

  return Promise.all(
    categoryData.map(({ name, emoji }) =>
      prisma.category.upsert({
        where: { name },
        update: { emoji },
        create: { name, emoji },
      })
    )
  );
}

// Helper function to create accounts
async function createAccounts() {
  const accountData = [
    {
      id: "amex_gold",
      name: "Amex Gold",
      accountType: "Credit Card",
      emoji: "🏆",
    },
    {
      id: "bilt_mastercard",
      name: "Bilt Mastercard",
      accountType: "Credit Card",
      emoji: "💳",
    },
    {
      id: "cit_savings",
      name: "CIT Bank Savings",
      accountType: "Bank",
      emoji: "🏦",
    },
    {
      id: "target_redcard",
      name: "Target RedCard",
      accountType: "Credit Card",
      emoji: "🎯",
    },
    {
      id: "wells_fargo_credit_card",
      name: "Wells Fargo Credit Card",
      accountType: "Credit Card",
      emoji: "💳",
    },
    {
      id: "vanguard",
      name: "Vanguard",
      accountType: "Investment",
      emoji: "📈",
    },
    { id: "venmo", name: "Venmo", accountType: "Venmo", emoji: "💰" },
  ];

  return Promise.all(
    accountData.map(({ id, name, accountType, emoji }) =>
      prisma.account.upsert({
        where: { id },
        update: {},
        create: { id, name, accountType, emoji },
      })
    )
  );
}

// Helper function to create budgets
async function createBudgets(categories: any[]) {
  const currentMonth = new Date(2023, 6, 1); // July 2023 (months are 0-indexed)

  const budgetCategories = [
    { name: "Housing", amount: 3350.0 },
    { name: "Food", amount: 1500.0 },
    { name: "Groceries", amount: 300.0 },
    { name: "Wellness", amount: 300.0 },
    { name: "Daily Transport", amount: 500.0 },
    { name: "Travel", amount: 1000.0 },
    { name: "Technology", amount: 250.0 },
    { name: "Personal Care", amount: 80.0 },
    { name: "LEGO", amount: 150.0 },
    { name: "Clothing", amount: 300.0 },
    { name: "Gifts", amount: 150.0 },
    { name: "Entertainment", amount: 150.0 },
    { name: "Subscription", amount: 30.0 },
    { name: "Going Out", amount: 200.0 },
  ];

  return Promise.all(
    budgetCategories.map(async ({ name, amount }) => {
      const category = categories.find((c) => c.name === name);
      if (!category) {
        throw new Error(`Category ${name} not found`);
      }

      return prisma.budget.upsert({
        where: {
          categoryId_startDate: {
            categoryId: category.id,
            startDate: currentMonth,
          },
        },
        update: {
          amount,
          endDate: null,
        },
        create: {
          categoryId: category.id,
          amount,
          startDate: currentMonth,
          endDate: null,
        },
      });
    })
  );
}

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Create default categories
    console.log("📂 Creating categories...");
    const categories = await createCategories();
    console.log(`✅ Created ${categories.length} categories`);

    // Create default accounts
    console.log("🏦 Creating accounts...");
    const accounts = await createAccounts();
    console.log(`✅ Created ${accounts.length} accounts`);

    // Create default budgets for current month
    console.log("💰 Creating budgets...");
    const budgets = await createBudgets(categories);
    console.log(`✅ Created ${budgets.length} budgets`);

    console.log("🎉 Database seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(`  - ${categories.length} categories`);
    console.log(`  - ${accounts.length} accounts`);
    console.log(`  - ${budgets.length} budgets`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
