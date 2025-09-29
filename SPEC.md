# Personal Finance Tracker

Build a local-first personal finance tracker that ingests normalized CSVs from multiple sources (bank, credit cards, Venmo, Vanguard), deduplicates idempotently, and persists manual edits. Provide a polished, Monarch-like UI (via Material UI), powerful transactions table with inline editing, budgets, insights (spend by category/month), Sankey-style flow visualization of paycheck → spending, and net-worth tracking.

**High-level Functional Requirements:**

- Local persistence: All data stored in a local SQLite DB managed by Prisma. App runs locally.
- Idempotent ingestion: Re-importing the same CSV(s) or overlapping CSVs must not create duplicate transactions.
- Normalized transaction model: Transactions have id (source id or computed), source, date, amount, merchant, category, note, is_manual.
- Editable transactions: User can edit Category and Note inline; edits persist and protect fields from being overwritten by future imports (unless user explicitly requests).
- Transactions table UI: Filters (source, category, date range), sort, pagination/virtualized scrolling, inline edit, bulk edit, search, export.
- Insights: Spend by category per month, category breakdown, monthly totals, Sankey flow (income → accounts → categories → merchants).
- Budgets: Per-category budgets with monthly recurrence and future-effective overrides. Dashboard shows actual vs budget.
- Net worth: Ingest balances snapshot. Show line chart of net worth over time.
- Transfers: Transactions classified as Transfer between user accounts should be recognized and auto-linked so they don't inflate spend.
- Import provenance: Track import file name, checksum, and imported_at.
- Exports: Ability to export data via CSV.
- API endpoints: Backend (Next.js API routes) implementing transaction query/update, import, budgets.

**Stack:**

- Next.js + React + Material UI + SQLite (Prisma).
- All UI components should be done in Material UI.

**Scope:**

- Local-only, single-user, ingest normalized CSVs, persistent edits, polished UI.
- Draw inspiration from Monarch Money (https://www.monarchmoney.com/).

---

## Core Entities (Prisma)

```prisma
model Transaction {
  id              String   @id                 // source id or computed fingerprint
  accountId       String                       // FK to Account.id
  date            DateTime
  amount          Decimal
  merchant        String?
  category        String?
  note            String?
  custom_category String?
  isManual        Boolean   @default(false)    // set if user edited
  importedAt      DateTime  @default(now())
  importId        String?                      // FK to Import.id
}

model Import {
  id        String   @id @default(cuid())
  filename  String
  checksum  String
  source    String
  importedAt DateTime @default(now())
}

model Budget {
  id          String   @id @default(cuid())
  category    String
  amount      Decimal
  startDate   DateTime
  endDate     DateTime?   // null = indefinite
  createdAt   DateTime @default(now())
}

model Account {
  id          String   @id @default(cuid())
  name        String                                 // e.g. "Amex", "Wells Fargo"
  accountType String?                                // "bank", "credit_card", "investment", "venmo"
  createdAt   DateTime @default(now())
}
```

Default categories (from user):
`Housing, Food, Groceries, Wellness, Daily Transport, Travel, Technology, Personal Care, LEGO, Clothing, Gifts, Entertainment, Subscription, Going Out, Transfer`

---

## Import Rules

- User uploads **raw CSVs**.
- App uses **filename pattern** to pick normalization logic (e.g., `"Amex"`, `"Wells"`, `"Venmo"`, `"Vanguard"`).
- Multiple CSVs can be uploaded at once.
- Normalize CSVs using logic that matches the example `python/` folder. We will have to translate this logic to Next.js.
- Idempotent import:
  - If a Transaction with same id exists:
    - If isManual = true: do NOT overwrite Category or Note. Update merchant, amount, date only if mismatch.
    - Else (isManual=false): update only blank fields (Category/Note). Do not change isManual.
  - If not exists → insert.

---

# UI / UX Requirements (Material UI design patterns)

All pages accessible from a left nav: Dashboard, Transactions, Budgets, Net Worth, Imports, Settings.

## Transactions Page (the flagship)

- **Top bar:** Search box (merchant/note), date range picker, filters (multi-select source, category chips), "Import CSV" button, "Export" filtered table to CSV button.
- **Table:** Virtualized (MUI X DataGrid). Columns: Date, Merchant (searchable), Amount, Source, Category (editable dropdown), Note (editable text), Manual badge.
- **Inline edit behavior:** clicking Category opens a MUI Select with defined categories; changing triggers optimistic UI update & PATCH API; on error, show Snackbar with undo.
- **Bulk actions:** Checkbox row selection → bottom bar with bulk category assign, export selected.
- **Row indicators:** small tag showing `isManual`. Transfers shown in faint color and excluded from spend totals.

## Dashboard

- Top summary cards: Net worth (latest), Monthly spend (current month), Top 3 categories this month, Budget progress summary.
- Charts grid:
  - Spend-by-category (donut).
  - Monthly spend stacked bar (categories).
  - Sankey flow (income → accounts → categories).
  - Net worth line (small).
- Drilldown: click a category in charts to apply filter to Transactions page.

## Budgets Page

- List of budgets per category with current month spend and progress bar.
- Edit budget modal: amount, start date, recurrence (monthly/none), future effective toggle.
- "Apply to future months" checkbox to set recurring policy.

## Net Worth Page

- Compute dynamically from imported account balances (in Vanguard/bank CSVs).
- Line chart over time with account breakdown toggle.

## Imports Page

- List of recent import files, num rows.
- Re-upload same file or files with overlapping transactions → no duplicates.

## Settings

- Manage accounts list (create/edit accounts with names and types).
- Category list management (add/edit/remove custom categories).

---

## Roadmap (Checklist)

- [x] **Scaffold project**: Next.js + Prisma + SQLite + MUI.
- [x] **Prisma schema** for `Transaction` + `Import` + `Budget` + `Account`.
- [x] **Basic Layout**: Navigation sidebar, responsive design, dark theme.
- [x] **Dashboard UI**: Placeholder cards and charts with Material UI design.
- [x] **Placeholder pages**: All main pages with Material UI structure.
  - [x] **Transactions page**: Table structure with filters and search.
  - [x] **Budgets page**: Budget management UI with progress indicators.
  - [x] **Net Worth page**: Net worth visualization with account breakdown.
  - [x] **Imports page**: File upload interface and import history.
  - [x] **Settings page**: Account and category management.
- [x] **Import logic**:
  - Detect source from filename.
  - Normalize → unified schema.
  - Deduplicate + link transfers.
- [x] **API routes**: Backend endpoints for transaction CRUD, import, budgets.
- [x] **Transactions page**:
  - Virtualized MUI table.
  - Filters, search, inline edit, bulk edit.
  - Export CSV.
- [x] **Dashboard data integration**:
  - Donut (spend by category).
  - Stacked bar (monthly spend).
  - Sankey (income → spend flow).
- [x] **Budgets page**:
  - CRUD budgets.
  - Show actual vs budget progress bars.
- [x] **Net Worth page**:
  - Line chart from balances.
- [x] **Imports page**:
  - List imports + reupload support.
- [x] **Settings page**:
  - Manage accounts and categories.
- [x] **Database migration and seeding**:
  - Created Prisma migration for categories table and account icons.
  - Updated Prisma schema with proper models and relationships.
  - Created seed file with default categories, accounts, and budgets.
  - Successfully migrated and seeded database.
  - Refactored seed file to eliminate code duplication with reusable helper functions.
