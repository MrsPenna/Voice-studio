/**
 * Validation utilities
 */

export class ValidationUtils {
  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate project name
   */
  static isValidProjectName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 255;
  }

  /**
   * Validate announcement text
   */
  static isValidAnnouncementText(text: string): boolean {
    return text.trim().length > 0 && text.length <= 5000;
  }

  /**
   * Validate voice profile name
   */
  static isValidProfileName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 100;
  }

  /**
   * Validate audio file
   */
  static isValidAudioFile(file: File): boolean {
    const validMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      'audio/aiff',
      'audio/x-ms-wma'
    ];
    return validMimeTypes.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|flac|aac|aiff|wma)$/i) !== null;
  }

  /**
   * Validate spreadsheet file
   */
  static isValidSpreadsheetFile(file: File): boolean {
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain'
    ];
    return (
      validMimeTypes.includes(file.type) ||
      file.name.match(/\.(xlsx|xls|csv|txt)$/i) !== null
    );
  }

  /**
   * Validate ZIP file
   */
  static isValidZipFile(file: File): boolean {
    return file.type === 'application/zip' || file.name.endsWith('.zip');
  }

  /**
   * Validate volume (0-200)
   */
  static isValidVolume(volume: number): boolean {
    return volume >= 0 && volume <= 200 && Number.isInteger(volume);
  }

  /**
   * Validate speed (50-150)
   */
  static isValidSpeed(speed: number): boolean {
    return speed >= 50 && speed <= 150 && Number.isInteger(speed);
  }

  /**
   * Validate warmth (50-150)
   */
  static isValidWarmth(warmth: number): boolean {
    return warmth >= 50 && warmth <= 150 && Number.isInteger(warmth);
  }
}

export default ValidationUtils;
