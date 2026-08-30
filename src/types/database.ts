// IndexedDB Schema Types
export interface DBProject {
  id: string;
  name: string;
  description?: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  voiceProfileId: string;
  autosaveEnabled: boolean;
  lastSavedAt?: number;
  unsavedChanges: boolean;
  version: number;
}

export interface DBAnnouncement {
  id: string;
  projectId: string; // Foreign key
  text: string;
  voiceProfileId: string;
  order: number;
  createdAt: number;
  updatedAt: number;
  audioPath?: string;
  duration?: number;
  warmth?: number;
  speed?: number;
  volume?: number;
}

export interface DBVoiceProfile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  warmth: number;
  speed: number;
  volume: number;
  presetName?: string;
  recordingPath?: string;
  sampleText: string;
  gender?: string;
  language: string;
  isDefault: boolean;
}

export interface DBScheduledAnnouncement {
  id: string;
  announcementId: string;
  scheduledTime: number;
  recurrance?: string;
  notificationEnabled: boolean;
  notificationMinutesBefore: number;
  status: string;
}

export interface DBOneDriveFile {
  id: string;
  driveItemId: string;
  name: string;
  path: string;
  size: number;
  createdAt: number;
  modifiedAt: number;
  webUrl: string;
  localPath?: string;
  syncedAt?: number;
}

export interface DBAppState {
  key: string; // Single document with key 'state'
  currentProjectId?: string;
  currentVoiceProfileId?: string;
  isOnline: boolean;
  isDarkMode: boolean;
  lastSyncAt?: number;
  autoSaveInterval: number;
  recoveryPoints: string[]; // Array of backup project IDs
}
