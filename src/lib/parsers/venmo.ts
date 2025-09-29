import { Decimal } from "@prisma/client/runtime/library";
import {
  ParserResult,
  CSVParser,
  TransactionData,
  removeChars,
  generateTransactionId,
} from "../import-utils";
import { parseCSVData } from "../csv-utils";

export class VenmoParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const rows = parseCSVData(csvContent, 1); // Skip 1 header line
    const transactions: TransactionData[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      try {
        const transaction = this.parseRow(row);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing Venmo row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Venmo",
      accountType: "venmo",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
    if (fields.length < 16) return null;

    const date = new Date(fields[2]);
    const amount = parseFloat(removeChars(fields[8], " +$,"));

    const merFrom = fields[6];
    const merTo = fields[7];
    const type = fields[3];
    
    // For charges, use "To" field as merchant (who you're paying)
    // For payments, use "From" field as merchant (who paid you)
    const merchant = type === "Charge" ? merTo : merFrom;
    const id = fields[1] || generateTransactionId(date, amount, merchant);

    let category: string | null = null;
    const note = fields[5];

    // Amex split
    let amexSplitAmount: string | null = null;
    if (note.toUpperCase() === note && amount >= 0) {
      amexSplitAmount = amount.toFixed(2);
      category = "Transfer";
    }

    const fundingSource = fields[14];
    const destination = fields[15];

    if (fundingSource !== "Venmo balance" && destination !== "Venmo balance") {
      category = "Transfer";

      const type = fields[3];
      if (type === "Standard Transfer") {
        // merchant should be empty for standard transfers
        return {
          id,
          date,
          amount: 0,
          merchant: destination,
          category: category || undefined,
          note: type,
          custom_category: amexSplitAmount || undefined,
        };
      } else {
        return {
          id,
          date,
          amount: 0,
          merchant,
          category: category || undefined,
          note: `[${amount} from ${fundingSource}] ${note}`,
          custom_category: amexSplitAmount || undefined,
        };
      }
    }

    return {
      id,
      date,
      amount: amount,
      merchant,
      category: category || undefined,
      note: note || undefined,
      custom_category: amexSplitAmount || undefined,
    };
  }

}
