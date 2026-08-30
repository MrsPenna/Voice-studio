import { v4 as uuidv4 } from 'uuid';

/**
 * ID and key generation utilities
 */
export class IDGeneratorUtils {
  /**
   * Generate unique project ID
   */
  static generateProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique announcement ID
   */
  static generateAnnouncementId(): string {
    return `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique voice profile ID
   */
  static generateVoiceProfileId(): string {
    return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique scheduled ID
   */
  static generateScheduledId(): string {
    return `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate UUID
   */
  static generateUUID(): string {
    return uuidv4();
  }

  /**
   * Generate cache key
   */
  static generateCacheKey(prefix: string, id: string): string {
    return `${prefix}:${id}`;
  }

  /**
   * Generate filename
   */
  static generateFileName(
    baseName: string,
    format: string,
    timestamp: boolean = true
  ): string {
    const ext = format.toLowerCase();
    const name = baseName.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const ts = timestamp ? `-${Date.now()}` : '';
    return `${name}${ts}.${ext}`;
  }
}

export default IDGeneratorUtils;
