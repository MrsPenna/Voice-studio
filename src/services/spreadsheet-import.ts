import * as XLSX from 'xlsx';
import { ImportedRow, ImportSettings } from '@types/index';

export class SpreadsheetImportService {
  /**
   * Parse Excel/CSV file
   */
  async parseFile(file: File): Promise<ImportedRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            reject(new Error('Failed to read file'));
            return;
          }

          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: ImportedRow[] = XLSX.utils.sheet_to_json(worksheet);

          resolve(rows);
        } catch (error) {
          reject(new Error(`Failed to parse file: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsBinaryString(file);
    });
  }

  /**
   * Extract announcements from imported rows
   */
  extractAnnouncements(
    rows: ImportedRow[],
    settings: ImportSettings
  ): string[] {
    let startIndex = settings.skipFirstRow ? 1 : 0;
    const announcements: string[] = [];

    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      const keys = Object.keys(row);

      if (settings.announcementColumnIndex < keys.length) {
        const key = keys[settings.announcementColumnIndex];
        const value = row[key];
        if (value !== undefined && value !== null) {
          announcements.push(String(value));
        }
      }
    }

    return announcements;
  }

  /**
   * Validate spreadsheet
   */
  validate(rows: ImportedRow[], settings: ImportSettings): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (rows.length === 0) {
      errors.push('Spreadsheet is empty');
    }

    const keys = Object.keys(rows[0] || {});
    if (settings.announcementColumnIndex >= keys.length) {
      errors.push('Selected column index is out of range');
    }

    const startIndex = settings.skipFirstRow ? 1 : 0;
    const validRows = rows.slice(startIndex).filter(row => {
      const key = keys[settings.announcementColumnIndex];
      return row[key] !== undefined && row[key] !== null && row[key] !== '';
    });

    if (validRows.length === 0) {
      errors.push('No valid announcements found in the selected column');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default SpreadsheetImportService;
