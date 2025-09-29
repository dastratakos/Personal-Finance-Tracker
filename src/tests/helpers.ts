import { TransactionData } from "../lib/import-utils";

/**
 * Helper function to assert that two TransactionData objects are equal
 */
export function assertTransactionEqual(
  actual: TransactionData,
  expected: TransactionData,
  message?: string
): void {
  const errorMessage = message || "Transaction data mismatch";
  
  // Handle Jest matchers for ID
  if (expected.id && typeof expected.id === 'object' && 'asymmetricMatch' in expected.id) {
    // This is a Jest matcher like expect.any(String)
    if (!expected.id.asymmetricMatch(actual.id)) {
      throw new Error(`${errorMessage}: ID mismatch - expected Jest matcher, got "${actual.id}"`);
    }
  } else if (actual.id !== expected.id) {
    throw new Error(`${errorMessage}: ID mismatch - expected "${expected.id}", got "${actual.id}"`);
  }
  
  if (actual.date.getTime() !== expected.date.getTime()) {
    throw new Error(`${errorMessage}: Date mismatch - expected "${expected.date.toISOString()}", got "${actual.date.toISOString()}"`);
  }
  
  if (actual.amount !== expected.amount) {
    throw new Error(`${errorMessage}: Amount mismatch - expected ${expected.amount}, got ${actual.amount}`);
  }
  
  if (actual.merchant !== expected.merchant) {
    throw new Error(`${errorMessage}: Merchant mismatch - expected "${expected.merchant}", got "${actual.merchant}"`);
  }
  
  if (actual.category !== expected.category) {
    throw new Error(`${errorMessage}: Category mismatch - expected "${expected.category}", got "${actual.category}"`);
  }
  
  if (actual.note !== expected.note) {
    throw new Error(`${errorMessage}: Note mismatch - expected "${expected.note}", got "${actual.note}"`);
  }
  
  if (actual.custom_category !== expected.custom_category) {
    throw new Error(`${errorMessage}: Custom category mismatch - expected "${expected.custom_category}", got "${actual.custom_category}"`);
  }
}

/**
 * Helper function to create anonymized test data
 */
export function anonymizeData(data: string): string {
  // Replace common personal information with anonymized versions
  return data
    .replace(/Dean Stratakos/g, "John Doe")
    .replace(/Charles Pan/g, "Jane Smith")
    .replace(/Melanie Kessinger/g, "Bob Johnson")
    .replace(/Christine Manegan/g, "Alice Brown")
    .replace(/Charles Stratakos/g, "Mike Wilson")
    .replace(/\d{4}-\d{4}-\d{4}-\d{4}/g, "****-****-****-****") // Credit card numbers
    .replace(/\*\d{4}/g, "****") // Last 4 digits
    .replace(/\+\d{1,3}-\d{3}-\d{3}-\d{4}/g, "+1-***-***-****") // Phone numbers
    .replace(/\d{3}-\d{3}-\d{4}/g, "***-***-****") // Phone numbers
    .replace(/\d{10,}/g, (match) => "*".repeat(match.length)); // Long numbers
}
