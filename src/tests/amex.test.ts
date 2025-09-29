import { AmexParser } from "../lib/parsers/amex";
import { TransactionData } from "../lib/import-utils";
import { assertTransactionEqual } from "./helpers";

describe("AmexParser", () => {
  let parser: AmexParser;

  beforeEach(() => {
    parser = new AmexParser();
  });

  test("should parse negative transaction correctly", () => {
    const csvContent = `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address Line 1,Address Line 2,City,State,Zip Code,Country,Reference,Card Member,Card Number,Category Code,Category Description
04/07/2024,AplPay REISS (RETAIL)LONDON GB,500.86,"00858129615 MEN'S CLOTHING
396.00 UNITED KINGDOM POUND STERLING CONV
AplPay REISS (RETAIL) LIMITED
LONDON
GB
Description : 4200 - Reiss Lo Price : 3.96
MEN'S CLOTHINGForeign Spend Amount: 396.00 UNITED KINGDOM POUND STERLING Commission Amount: Currency Exchange Rate: null",AplPay REISS (RETAIL)LONDON GB,116 LONG ACRE,"LONDON
LND",WC2E 9PA,UNITED KINGDOM OF GB AND NI,'320240980880914392',Merchandise & Supplies-Clothing Stores,Clothing`;

    const result = parser.parse(csvContent, "Amex Gold.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "320240980880914392",
      date: new Date("2024-04-07"),
      amount: -500.86,
      merchant: "AplPay REISS (RETAIL) LIMITED",
      category: "Clothing",
      note: undefined,
      custom_category: "Merchandise & Supplies-Clothing Stores",
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse Amex split credit correctly", () => {
    const csvContent = `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address Line 1,Address Line 2,City,State,Zip Code,Country,Reference,Card Member,Card Number,Category Code,Category Description
06/19/2024,Amex Split Credit: Venmo-Jane Smith,-12.62,"+1 973-262-0250
GRUBHUB/SEAMLESS
Amex Split Credit: Venmo-Jane Smith",Amex Split Credit: Venmo-Jane Smith,117 BARROW ST,"NEW YORK
NY",10014,UNITED STATES,'320241710755508527',Other-Miscellaneous`;

    const result = parser.parse(csvContent, "Amex Gold.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "320241710755508527",
      date: new Date("2024-06-19"),
      amount: 12.62,
      merchant: "Amex Split Credit: Jane Smith, GRUBHUB/SEAMLESS",
      category: "Food",
      note: undefined,
      custom_category: "Other-Miscellaneous",
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should parse clothing transaction correctly", () => {
    const csvContent = `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address Line 1,Address Line 2,City,State,Zip Code,Country,Reference,Card Member,Card Number,Category Code,Category Description
09/19/2024,AplPay RAG AND BONE NEW YORK NY,554.99,"22416667 MEN'S/WOMEN'S CLOTHNG
AplPay RAG AND BONE HOLDINGS, LLC
NEW YORK
NY
MEN'S/WOMEN'S CLOTHNG",AplPay RAG AND BONE NEW YORK NY,425 WEST 13TH ST OFC 2,"NEW YORK
NY",10014,UNITED STATES,'320242640185026866',Merchandise & Supplies-Clothing Stores`;

    const result = parser.parse(csvContent, "Amex Gold.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "320242640185026866",
      date: new Date("2024-09-19"),
      amount: -554.99,
      merchant: "AplPay RAG AND BONE HOLDINGS, LLC",
      category: "Clothing",
      note: undefined,
      custom_category: "Merchandise & Supplies-Clothing Stores",
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should handle restaurant transactions", () => {
    const csvContent = `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address Line 1,Address Line 2,City,State,Zip Code,Country,Reference,Card Member,Card Number,Category Code,Category Description
08/15/2024,CHIPOTLE #1234 NEW YORK NY,15.67,"1234567890 RESTAURANT
CHIPOTLE MEXICAN GRILL
NEW YORK
NY
RESTAURANT",CHIPOTLE #1234 NEW YORK NY,123 MAIN ST,"NEW YORK
NY",10001,UNITED STATES,'320241234567890123',Restaurant-Restaurant`;

    const result = parser.parse(csvContent, "Amex Gold.csv");
    expect(result.transactions).toHaveLength(1);

    const expected: TransactionData = {
      id: "320241234567890123",
      date: new Date("2024-08-15"),
      amount: -15.67,
      merchant: "CHIPOTLE MEXICAN GRILL",
      category: "Food",
      note: undefined,
      custom_category: "Restaurant-Restaurant",
    };

    assertTransactionEqual(result.transactions[0], expected);
  });

  test("should return correct account information", () => {
    const result = parser.parse("", "Amex Gold.csv");
    expect(result.accountName).toBe("Amex");
    expect(result.accountType).toBe("credit_card");
  });
});