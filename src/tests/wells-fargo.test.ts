import { WellsFargoParser } from "../lib/parsers/wells-fargo";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual, anonymizeData } from "./helpers";

describe("WellsFargoParser", () => {
  let parser: WellsFargoParser;

  beforeEach(() => {
    parser = new WellsFargoParser();
  });

  test("should parse debit transaction correctly", () => {
    const csvContent = anonymizeData(`2024-03-15,-25.50,DEBIT,1234567890,UBER TRIP HELP NEW YORK NY`);

    const result = parser.parse(csvContent, "Wells Fargo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
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
    const csvContent = anonymizeData(`2024-03-20,150.00,CREDIT,9876543210,SALARY DEPOSIT`);

    const result = parser.parse(csvContent, "Wells Fargo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-20"),
      amount: 150.00,
      merchant: "SALARY DEPOSIT",
      category: undefined,
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse food transaction correctly", () => {
    const csvContent = anonymizeData(`2024-03-10,-15.67,DEBIT,1111111111,CHIPOTLE MEXICAN GRILL`);

    const result = parser.parse(csvContent, "Wells Fargo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
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
    const csvContent = anonymizeData(`2024-03-12,-85.32,DEBIT,2222222222,WEGMANS FOOD MARKETS`);

    const result = parser.parse(csvContent, "Wells Fargo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
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
    const csvContent = anonymizeData(`2024-03-25,-500.00,DEBIT,3333333333,AMEX EPAYMENT ACH PMT`);

    const result = parser.parse(csvContent, "Wells Fargo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-25"),
      amount: -500.00,
      merchant: "AMEX EPAYMENT ACH PMT",
      category: "Transfer",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "Wells Fargo.csv");
    expect(result.accountName).toBe("Wells Fargo");
    expect(result.accountType).toBe("bank");
  });
});