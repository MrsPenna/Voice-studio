/**
 * File system utilities for PWA
 */

export class FileSystemUtils {
  /**
   * Download file to local system
   */
  static downloadFile(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate CSV from data
   */
  static generateCSV(
    data: Record<string, unknown>[],
    fileName: string = 'export.csv'
  ): void {
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    this.downloadFile(blob, fileName);
  }

  /**
   * Generate JSON file
   */
  static downloadJSON(data: unknown, fileName: string = 'export.json'): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadFile(blob, fileName);
  }
}

export default FileSystemUtils;
