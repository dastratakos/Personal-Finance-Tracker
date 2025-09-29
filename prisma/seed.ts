import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to create categories
async function createCategories() {
  const categoryNames = [
    "Housing",
    "Food",
    "Groceries",
    "Wellness",
    "Daily Transport",
    "Travel",
    "Technology",
    "Personal Care",
    "LEGO",
    "Clothing",
    "Gifts",
    "Entertainment",
    "Subscription",
    "Going Out",
    "Transfer",
  ];

  return Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
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
      icon: "💳",
    },
    {
      id: "bilt_mastercard",
      name: "Bilt Mastercard",
      accountType: "Credit Card",
      icon: "💳",
    },
    {
      id: "cit_savings",
      name: "CIT Bank Savings",
      accountType: "Bank",
      icon: "🏦",
    },
    {
      id: "target_redcard",
      name: "Target RedCard",
      accountType: "Credit Card",
      icon: "🎯",
    },
    {
      id: "wells_fargo_credit_card",
      name: "Wells Fargo Credit Card",
      accountType: "Credit Card",
      icon: "💳",
    },
    { id: "vanguard", name: "Vanguard", accountType: "Investment", icon: "📈" },
    { id: "venmo", name: "Venmo", accountType: "Venmo", icon: "💰" },
  ];

  return Promise.all(
    accountData.map(({ id, name, accountType, icon }) =>
      prisma.account.upsert({
        where: { id },
        update: {},
        create: { id, name, accountType, icon },
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

      return prisma.budget.create({
        data: {
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
