# Personal Finance Tracker

A sleek, dark-themed personal finance tracker built with Next.js and Material UI. Track your spending, monitor budgets, and analyze your financial health with a modern, intuitive interface.

## Features

- **Dark Theme UI**: Sleek dark interface with teal and coral accents
- **Dashboard**: Financial overview with key metrics and charts
- **Transaction Management**: Import and manage transactions from multiple sources
- **Budget Tracking**: Set and monitor category-based budgets
- **Net Worth Tracking**: Visualize your financial progress over time
- **Data Import**: Support for CSV imports from banks, credit cards, and financial services

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Material UI 7
- **Database**: SQLite with Prisma ORM
- **Styling**: Material UI with custom dark theme
- **Icons**: Material UI Icons

## Database Management (Prisma)

**Database Operations:**

```bash
# Create and apply new migration
npm run db:migrate

# Reset database (drops all data and re-runs migrations + seed)
npm run db:reset

# Seed database with default categories, accounts, and budgets
npm run db:seed
```

**Schema Changes:**

```bash
# After modifying prisma/schema.prisma, create migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma client after schema changes
npx prisma generate
```

**Database Inspection:**

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# View database in terminal
npx prisma db pull
```
