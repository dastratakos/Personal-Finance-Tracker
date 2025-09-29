import { BiltParser } from "../lib/parsers/bilt";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual, anonymizeData } from "./helpers";

describe("BiltParser", () => {
  let parser: BiltParser;

  beforeEach(() => {
    parser = new BiltParser();
  });

  test("should parse debit transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-15,-25.50,DEBIT,1234567890,UBER TRIP HELP NEW YORK NY`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-15"),
      amount: -25.50,
      merchant: "UBER TRIP HELP NEW YORK NY",
      category: "Daily Transport",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse credit transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-20,150.00,CREDIT,9876543210,PAYMENT RECEIVED`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-20"),
      amount: 150.00,
      merchant: "PAYMENT RECEIVED",
      category: undefined,
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse food transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-10,-15.67,DEBIT,1111111111,CHIPOTLE MEXICAN GRILL`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-10"),
      amount: -15.67,
      merchant: "CHIPOTLE MEXICAN GRILL",
      category: "Food",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse grocery transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-12,-85.32,DEBIT,2222222222,WEGMANS FOOD MARKETS`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-12"),
      amount: -85.32,
      merchant: "WEGMANS FOOD MARKETS",
      category: "Groceries",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse transfer transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-25,-500.00,DEBIT,3333333333,AMEX EPAYMENT ACH PMT`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-25"),
      amount: -500.00,
      merchant: "AMEX EPAYMENT ACH PMT",
      category: "Transfer",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse entertainment transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-18,-18.50,DEBIT,4444444444,AMC THEATRES`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-18"),
      amount: -18.50,
      merchant: "AMC THEATRES",
      category: "Entertainment",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse technology transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Amount,Type,Reference,Merchant
2024-03-22,-9.99,DEBIT,5555555555,APPLE.COM/BILL`);

    const result = parser.parse(csvContent, "Bilt.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: undefined,
      date: new Date("2024-03-22"),
      amount: -9.99,
      merchant: "APPLE.COM/BILL",
      category: "Technology",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "Bilt.csv");
    expect(result.accountName).toBe("Bilt");
    expect(result.accountType).toBe("credit_card");
  });
});