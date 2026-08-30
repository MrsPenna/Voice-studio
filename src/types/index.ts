// Voice Profile Types
export interface VoiceProfile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  warmth: number; // 50-150
  speed: number; // 50-150
  volume: number; // 0-200
  presetName?: string;
  recordingPath?: string;
  sampleText: string;
  gender?: 'male' | 'female' | 'neutral';
  language: string;
  isDefault: boolean;
}

// Announcement Types
export interface Announcement {
  id: string;
  projectId: string;
  text: string;
  voiceProfileId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  audioPath?: string;
  duration?: number;
  settings?: AnnouncementSettings;
}

export interface AnnouncementSettings {
  warmth?: number;
  speed?: number;
  volume?: number;
  pitch?: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  announcements: Announcement[];
  voiceProfileId: string;
  autosaveEnabled: boolean;
  lastSavedAt?: Date;
  unsavedChanges: boolean;
  version: number;
}

// Export Settings
export type ExportFormat = 'mp3' | 'wav' | 'flac' | 'ogg' | 'aac' | 'aiff' | 'wma';
export type ExportQuality = 'low' | 'standard' | 'high' | 'premium' | 'studio' | 'archive';

export interface ExportSettings {
  format: ExportFormat;
  quality: ExportQuality;
  bitrate: number;
  sampleRate: number;
  channels: 'mono' | 'stereo';
  includeMetadata: boolean;
}

// Scheduled Announcement Types
export interface ScheduledAnnouncement {
  id: string;
  announcementId: string;
  scheduledTime: Date;
  recurrance?: 'never' | 'daily' | 'weekly' | 'monthly';
  notificationEnabled: boolean;
  notificationMinutesBefore: number;
  status: 'pending' | 'playing' | 'completed' | 'skipped';
}

// Spreadsheet Import Types
export interface ImportedRow {
  [key: string]: string | number | boolean | undefined;
}

export interface ImportSettings {
  announcementColumnIndex: number;
  skipFirstRow: boolean;
  delimiter?: string;
}

// OneDrive Integration Types
export interface OneDriveFile {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  webUrl: string;
}

// Audio Waveform Types
export interface WaveformOptions {
  container: HTMLElement;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  height?: number;
  barWidth?: number;
}

// Voice Training Types
export interface VoiceTrainingStep {
  stepNumber: number;
  title: string;
  description: string;
  instruction: string;
  sampleText: string;
  audioUrl?: string;
}

export interface VoiceTrainingSession {
  id: string;
  voiceProfileId: string;
  currentStep: number;
  startedAt: Date;
  completedAt?: Date;
  recordings: string[];
  qualityScore?: number;
}

// Application State Types
export interface AppState {
  currentProjectId?: string;
  currentVoiceProfileId?: string;
  isOnline: boolean;
  isDarkMode: boolean;
  lastSyncAt?: Date;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

// Audio Processing Types
export interface AudioBuffer {
  data: Float32Array;
  sampleRate: number;
  duration: number;
  channelCount: number;
}

export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  bitDepth: number;
  channels: number;
  codec: string;
}
