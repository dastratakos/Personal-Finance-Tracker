import { CITParser } from "../lib/parsers/cit";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual, anonymizeData } from "./helpers";

describe("CITParser", () => {
  let parser: CITParser;

  beforeEach(() => {
    parser = new CITParser();
  });

  test("should parse credit transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-03-15,1234567890,CREDIT,SALARY DEPOSIT,421.86,421.86`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-15"),
      amount: 421.86,
      merchant: "SALARY DEPOSIT",
      category: undefined,
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse debit transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-03-10,9876543210,DEBIT,UBER TRIP HELP,(25.50),25.50`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-10"),
      amount: -25.50,
      merchant: "UBER TRIP HELP",
      category: "Daily Transport",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Amex payment with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-03-25,1111111111,DEBIT,AMEX EPAYMENT ACH PMT,(500.00),500.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-25"),
      amount: -500.00,
      merchant: "AMEX EPAYMENT ACH PMT",
      category: "Transfer",
      note: "Amex credit card bill",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Bilt payment with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-03-30,2222222222,DEBIT,BILTPYMTS RENT PMT,(1200.00),1200.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-03-30"),
      amount: -1200.00,
      merchant: "BILTPYMTS RENT PMT",
      category: "Transfer",
      note: "Bilt housing",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Wells Fargo payment with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-01,3333333333,DEBIT,WF Credit Card AUTO PAY,(300.00),300.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-01"),
      amount: -300.00,
      merchant: "WF Credit Card AUTO PAY",
      category: "Transfer",
      note: "WF credit card bill",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Target payment with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-05,4444444444,DEBIT,TARGET,(150.00),150.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-05"),
      amount: -150.00,
      merchant: "TARGET",
      category: "Transfer",
      note: "Target credit card bill",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Venmo cashout with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-10,5555555555,DEBIT,VENMO CASHOUT,(50.00),50.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-10"),
      amount: -50.00,
      merchant: "VENMO CASHOUT",
      category: "Transfer",
      note: "Venmo",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Vanguard transaction with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-15,6666666666,DEBIT,VANGUARD,(1000.00),1000.00`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-15"),
      amount: -1000.00,
      merchant: "VANGUARD",
      category: "Transfer",
      note: "Vanguard",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse interest credit with note", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-20,7777777777,CREDIT,INTEREST CREDIT,5.25,5.25`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-20"),
      amount: 5.25,
      merchant: "INTEREST CREDIT",
      category: undefined,
      note: "Interest",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse food transaction correctly", () => {
    const csvContent = anonymizeData(`Date,Account Number,Transaction Type,Description,Debit Amount,Credit Amount
2024-04-25,8888888888,DEBIT,CHIPOTLE MEXICAN GRILL,(15.67),15.67`);

    const result = parser.parse(csvContent, "CIT.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: expect.any(String), // Generated ID
      date: new Date("2024-04-25"),
      amount: -15.67,
      merchant: "CHIPOTLE MEXICAN GRILL",
      category: "Food",
      note: undefined,
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "CIT.csv");
    expect(result.accountName).toBe("CIT");
    expect(result.accountType).toBe("bank");
  });
});