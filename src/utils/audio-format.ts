/**
 * Audio format utilities
 */

export class AudioFormatUtils {
  private static readonly FORMAT_MIMETYPES: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    aac: 'audio/aac',
    aiff: 'audio/aiff',
    wma: 'audio/x-ms-wma'
  };

  private static readonly QUALITY_BITRATES: Record<string, Record<string, number>> = {
    mp3: {
      low: 128,
      standard: 192,
      high: 256,
      premium: 320,
      studio: 320,
      archive: 320
    },
    wav: {
      low: 128,
      standard: 256,
      high: 384,
      premium: 576,
      studio: 576,
      archive: 576
    },
    flac: {
      low: 128,
      standard: 192,
      high: 256,
      premium: 320,
      studio: 320,
      archive: 320
    },
    ogg: {
      low: 64,
      standard: 128,
      high: 192,
      premium: 256,
      studio: 256,
      archive: 256
    },
    aac: {
      low: 64,
      standard: 128,
      high: 192,
      premium: 256,
      studio: 256,
      archive: 256
    },
    aiff: {
      low: 128,
      standard: 256,
      high: 384,
      premium: 576,
      studio: 576,
      archive: 576
    },
    wma: {
      low: 128,
      standard: 192,
      high: 256,
      premium: 320,
      studio: 320,
      archive: 320
    }
  };

  private static readonly SAMPLE_RATES: Record<string, number[]> = {
    mp3: [44100, 48000],
    wav: [44100, 48000, 96000, 192000],
    flac: [44100, 48000, 96000, 192000],
    ogg: [44100, 48000],
    aac: [44100, 48000],
    aiff: [44100, 48000, 96000, 192000],
    wma: [44100, 48000]
  };

  static getMimeType(format: string): string {
    return this.FORMAT_MIMETYPES[format.toLowerCase()] || 'audio/mpeg';
  }

  static getBitrate(format: string, quality: string): number {
    return this.QUALITY_BITRATES[format.toLowerCase()]?.[quality] || 192;
  }

  static getSampleRate(format: string, quality: string): number {
    const rates = this.SAMPLE_RATES[format.toLowerCase()] || [44100];
    const quality_num = quality === 'archive' ? 5 : quality === 'studio' ? 4 : quality === 'premium' ? 3 : quality === 'high' ? 2 : quality === 'standard' ? 1 : 0;
    return rates[Math.min(quality_num, rates.length - 1)];
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static getFileExtension(format: string): string {
    return format.toLowerCase().replace(/[^a-z]/g, '');
  }
}

export default AudioFormatUtils;
