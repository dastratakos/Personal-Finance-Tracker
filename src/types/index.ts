/**
 * Shared TypeScript interfaces and types for the Personal Finance Tracker
 */

// ============================================================================
// Core Data Interfaces
// ============================================================================

export interface TransactionData {
  id?: string;
  date: Date;
  amount: number;
  merchant?: string;
  category?: string;
  note?: string;
  custom_category?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant?: string;
  category?: string;
  note?: string;
  isManual: boolean;
  account: {
    name: string;
  };
  import?: {
    filename: string;
    importedAt: string;
  };
}

export interface Account {
  id: string;
  name: string;
  accountType?: string;
  icon?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface BudgetWithSpend extends Budget {
  actualSpend: number;
  remaining: number;
  percentage: number;
}

export interface ImportRecord {
  id: string;
  filename: string;
  checksum: string;
  account: {
    id: string;
    name: string;
    accountType: string;
    icon: string;
  };
  importedAt: string;
  transactionCount: number;
}

// ============================================================================
// Import/Export Interfaces
// ============================================================================

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  duplicateCount: number;
  importId?: string;
}

export interface ParserResult {
  transactions: TransactionData[];
  accountName: string;
  accountType?: string;
}

export interface CSVParser {
  parse(csvContent: string, filename: string): ParserResult;
}

// ============================================================================
// Dashboard Interfaces
// ============================================================================

export interface DashboardData {
  netWorth: number;
  monthlySpend: number;
  topCategories: Array<{ category: string; amount: number }>;
  spendByCategory: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    spend: number;
    income: number;
    net: number;
  }>;
  accountBreakdown: Record<string, number>;
  totalTransactions: number;
}

export interface NetWorthData {
  currentNetWorth: number;
  previousNetWorth: number;
  change: number;
  changePercentage: number;
  accountBreakdown: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
}

// ============================================================================
// Component Interfaces
// ============================================================================

export interface LayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

export const TIME_RANGES = ["1M", "3M", "6M", "1Y", "All"];
