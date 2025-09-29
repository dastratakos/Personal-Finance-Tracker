import { TargetParser } from "../lib/parsers/target";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual, anonymizeData } from "./helpers";

describe("TargetParser", () => {
  let parser: TargetParser;

  beforeEach(() => {
    parser = new TargetParser();
  });

  test("should parse debit transaction correctly", () => {
    const csvContent = anonymizeData(`Account Number,Card Number,Transaction Date,Transaction Type,Reference Number,Merchant Name,Merchant City,Merchant State,Merchant Country,Transaction Amount,Transaction ID
****1234,****5678,2024-03-15,Debit,REF123456,TARGET,New York,NY,US,$25.50,TXN123456789`);

    const result = parser.parse(csvContent, "Target.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "TXN123456789",
      date: new Date("2024-03-15"),
      amount: -25.50,
      merchant: "Target - New York, NY",
      category: undefined,
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse credit transaction correctly", () => {
    const csvContent = anonymizeData(`Account Number,Card Number,Transaction Date,Transaction Type,Reference Number,Merchant Name,Merchant City,Merchant State,Merchant Country,Transaction Amount,Transaction ID
****1234,****5678,2024-03-20,Credit,REF789012,PAYMENT RECEIVED,Online,CA,US,$150.00,TXN789012345`);

    const result = parser.parse(csvContent, "Target.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "TXN789012345",
      date: new Date("2024-03-20"),
      amount: 150.00,
      merchant: "PAYMENT RECEIVED",
      category: undefined,
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse non-Target merchant correctly", () => {
    const csvContent = anonymizeData(`Account Number,Card Number,Transaction Date,Transaction Type,Reference Number,Merchant Name,Merchant City,Merchant State,Merchant Country,Transaction Amount,Transaction ID
****1234,****5678,2024-03-10,Debit,REF345678,CHIPOTLE MEXICAN GRILL,New York,NY,US,$15.67,TXN345678901`);

    const result = parser.parse(csvContent, "Target.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "TXN345678901",
      date: new Date("2024-03-10"),
      amount: -15.67,
      merchant: "CHIPOTLE MEXICAN GRILL",
      category: "Food",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should handle transaction without ID", () => {
    const csvContent = anonymizeData(`Account Number,Card Number,Transaction Date,Transaction Type,Reference Number,Merchant Name,Merchant City,Merchant State,Merchant Country,Transaction Amount,Transaction ID
****1234,****5678,2024-03-25,Debit,REF456789,WEGMANS FOOD MARKETS,Boston,MA,US,$85.32,`);

    const result = parser.parse(csvContent, "Target.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-25"),
      amount: -85.32,
      merchant: "WEGMANS FOOD MARKETS",
      category: "Groceries",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "Target.csv");
    expect(result.accountName).toBe("Target");
    expect(result.accountType).toBe("credit_card");
  });
});