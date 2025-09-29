import Papa from 'papaparse';

/**
 * Parse CSV content using Papa Parse library
 * @param csvContent - The CSV content as a string
 * @param options - Optional Papa Parse configuration
 * @returns Array of parsed rows
 */
export function parseCSV(csvContent: string, options?: Papa.ParseConfig): string[][] {
  const result = Papa.parse(csvContent, {
    skipEmptyLines: true,
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '"',
    newline: '\n',
    ...options,
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing errors:', result.errors);
  }

  return result.data as string[][];
}

/**
 * Parse CSV content and return only the data rows (excluding headers)
 * @param csvContent - The CSV content as a string
 * @param skipHeaderLines - Number of header lines to skip (default: 1)
 * @param options - Optional Papa Parse configuration
 * @returns Array of parsed data rows
 */
export function parseCSVData(
  csvContent: string, 
  skipHeaderLines: number = 1, 
  options?: Papa.ParseConfig
): string[][] {
  const allRows = parseCSV(csvContent, options);
  return allRows.slice(skipHeaderLines);
}

/**
 * Parse CSV content and return only the data rows (excluding headers and footers)
 * @param csvContent - The CSV content as a string
 * @param skipHeaderLines - Number of header lines to skip (default: 1)
 * @param skipFooterLines - Number of footer lines to skip (default: 0)
 * @param options - Optional Papa Parse configuration
 * @returns Array of parsed data rows
 */
export function parseCSVDataWithFooter(
  csvContent: string, 
  skipHeaderLines: number = 1, 
  skipFooterLines: number = 0,
  options?: Papa.ParseConfig
): string[][] {
  const allRows = parseCSV(csvContent, options);
  const startIndex = skipHeaderLines;
  const endIndex = skipFooterLines > 0 ? allRows.length - skipFooterLines : allRows.length;
  return allRows.slice(startIndex, endIndex);
}
