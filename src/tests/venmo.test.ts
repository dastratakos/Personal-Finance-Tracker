import { VenmoParser } from "../lib/parsers/venmo";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual } from "./helpers";

describe("VenmoParser", () => {
  let parser: VenmoParser;

  beforeEach(() => {
    parser = new VenmoParser();
  });

  test("should parse positive charge correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3994731643236511963,2024-02-03T16:18:41,Charge,Complete,Sephora,John Doe,Bob Johnson,+ $64.00,,0,,0,,,Venmo balance,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3994731643236511963",
      date: new Date("2024-02-03T16:18:41"),
      amount: 64.00,
      merchant: "Bob Johnson",
      category: undefined,
      note: "Sephora",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse negative charge correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3992923929677426516,2024-02-01T04:27:04,Charge,Complete,LA CONTENTA OESTE,Jane Smith,John Doe,- $101.18,,0,,0,,Venmo balance,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3992923929677426516",
      date: new Date("2024-02-01T04:27:04"),
      amount: -101.18,
      merchant: "Jane Smith",
      category: undefined,
      note: "LA CONTENTA OESTE",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse charge from bank as transfer", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3880945645348302824,2023-08-30T16:26:13,Charge,Complete,🎾,Jane Smith,John Doe,- $232.18,,0,,0,,CIT BANK NA Personal Checking *2668,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3880945645348302824",
      date: new Date("2023-08-30T16:26:13"),
      amount: 0.00,
      merchant: "Jane Smith",
      category: "Transfer",
      note: "[-232.18 from CIT BANK NA Personal Checking *2668] 🎾",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse positive payment correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3996204155149445466,2024-02-05T17:04:18,Payment,Complete,Argyle tix,Bob Johnson,John Doe,+ $23.00,,0,,0,,,Venmo balance,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3996204155149445466",
      date: new Date("2024-02-05T17:04:18"),
      amount: 23.00,
      merchant: "Bob Johnson",
      category: undefined,
      note: "Argyle tix",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse negative payment correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,4004365599988448758,2024-02-16T23:19:38,Payment,Complete,Wegmans - Starbucks,John Doe,Jane Smith,- $20.00,,0,,0,,Venmo balance,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "4004365599988448758",
      date: new Date("2024-02-16T23:19:38"),
      amount: -20.00,
      merchant: "Jane Smith",
      category: undefined,
      note: "Wegmans - Starbucks",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse payment from bank as transfer", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3871393021032533280,2023-08-17T12:06:51,Payment,Complete,Move-in purchases,John Doe,Mike Wilson,- $884.47,,0,,0,,CIT BANK NA Personal Checking *2668,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3871393021032533280",
      date: new Date("2023-08-17T12:06:51"),
      amount: 0.00,
      merchant: "Mike Wilson",
      category: "Transfer",
      note: "[-884.47 from CIT BANK NA Personal Checking *2668] Move-in purchases",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse standard transfer correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3856354104555071868,2023-07-27T18:07:13,Standard Transfer,Issued,,,,- $740.34,,,,,,,CIT BANK NA *2668,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3856354104555071868",
      date: new Date("2023-07-27T18:07:13"),
      amount: -740.34,
      merchant: "CIT BANK NA *2668",
      category: "Transfer",
      note: "Standard Transfer",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Amex split correctly", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,4148423632518527279,2024-09-02T17:37:13,Charge,Complete,CAFE MAUD,John Doe,Alice Brown,+ $170.47,,0,,0,,,Venmo balance,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "4148423632518527279",
      date: new Date("2024-09-02T17:37:13"),
      amount: 0.00,
      merchant: "Alice Brown",
      category: "Transfer",
      note: "CAFE MAUD",
      custom_category: "170.47",
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should not treat Amex split payment as transfer", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,4136835737017580473,2024-08-17T17:54:09,Charge,Complete,WEGMANS ASTOR PLACE,Jane Smith,John Doe,- $22.68,,0,,0,,Venmo balance,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "4136835737017580473",
      date: new Date("2024-08-17T17:54:09"),
      amount: -22.68,
      merchant: "Jane Smith",
      category: undefined,
      note: "WEGMANS ASTOR PLACE",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should handle comma in amount", () => {
    const csvContent = `Username,ID,Datetime,Type,Status,Note,From,To,Amount (total),Amount (tip),Amount (fee),Funding Source,Destination,Year to Date,Privacy,ID,Unnamed
John Doe,3862976704755642955,2023-08-05T21:25:08,Payment,Complete,Mattress,John Doe,Mike Wilson,"- $1,088.00",,0,,0,,CIT BANK NA Personal Checking *2668,,,,,Venmo,,`;

    const result = parser.parse(csvContent, "Venmo.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "3862976704755642955",
      date: new Date("2023-08-05T21:25:08"),
      amount: 0.00,
      merchant: "Mike Wilson",
      category: "Transfer",
      note: "[-1088.0 from CIT BANK NA Personal Checking *2668] Mattress",
      custom_category: undefined,
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "Venmo.csv");
    expect(result.accountName).toBe("Venmo");
    expect(result.accountType).toBe("venmo");
  });
});