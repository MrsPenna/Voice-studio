import Dexie, { Table } from 'dexie';
import {
  DBProject,
  DBAnnouncement,
  DBVoiceProfile,
  DBScheduledAnnouncement,
  DBOneDriveFile,
  DBAppState
} from '@types/database';

export class ClassroomVoiceStudioDB extends Dexie {
  projects!: Table<DBProject>;
  announcements!: Table<DBAnnouncement>;
  voiceProfiles!: Table<DBVoiceProfile>;
  scheduledAnnouncements!: Table<DBScheduledAnnouncement>;
  oneDriveFiles!: Table<DBOneDriveFile>;
  appState!: Table<DBAppState>;

  constructor() {
    super('ClassroomVoiceStudio');
    this.version(1).stores({
      projects: '++id, createdAt, updatedAt',
      announcements: '++id, projectId, order',
      voiceProfiles: '++id, isDefault, createdAt',
      scheduledAnnouncements: '++id, announcementId, scheduledTime',
      oneDriveFiles: '++id, driveItemId, syncedAt',
      appState: 'key'
    });
  }
}

export const db = new ClassroomVoiceStudioDB();

// Project Operations
export const projectDB = {
  async create(project: DBProject): Promise<string> {
    return db.projects.add(project);
  },

  async update(id: string, updates: Partial<DBProject>): Promise<void> {
    await db.projects.update(id, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async getById(id: string): Promise<DBProject | undefined> {
    return db.projects.get(id);
  },

  async getAll(): Promise<DBProject[]> {
    return db.projects.toArray();
  },

  async getRecent(limit: number = 10): Promise<DBProject[]> {
    return db.projects
      .orderBy('updatedAt')
      .reverse()
      .limit(limit)
      .toArray();
  },

  async delete(id: string): Promise<void> {
    await db.projects.delete(id);
    // Cascade delete announcements
    await db.announcements.where('projectId').equals(id).delete();
  },

  async search(query: string): Promise<DBProject[]> {
    return db.projects
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .toArray();
  }
};

// Announcement Operations
export const announcementDB = {
  async create(announcement: DBAnnouncement): Promise<string> {
    return db.announcements.add(announcement);
  },

  async update(id: string, updates: Partial<DBAnnouncement>): Promise<void> {
    await db.announcements.update(id, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async getById(id: string): Promise<DBAnnouncement | undefined> {
    return db.announcements.get(id);
  },

  async getByProjectId(projectId: string): Promise<DBAnnouncement[]> {
    return db.announcements
      .where('projectId')
      .equals(projectId)
      .sortBy('order');
  },

  async delete(id: string): Promise<void> {
    await db.announcements.delete(id);
  },

  async deleteByProjectId(projectId: string): Promise<void> {
    await db.announcements.where('projectId').equals(projectId).delete();
  },

  async updateOrder(projectId: string, announcements: DBAnnouncement[]): Promise<void> {
    await db.announcements.bulkPut(
      announcements.map((a, index) => ({
        ...a,
        order: index,
        updatedAt: Date.now()
      }))
    );
  }
};

// Voice Profile Operations
export const voiceProfileDB = {
  async create(profile: DBVoiceProfile): Promise<string> {
    return db.voiceProfiles.add(profile);
  },

  async update(id: string, updates: Partial<DBVoiceProfile>): Promise<void> {
    await db.voiceProfiles.update(id, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async getById(id: string): Promise<DBVoiceProfile | undefined> {
    return db.voiceProfiles.get(id);
  },

  async getAll(): Promise<DBVoiceProfile[]> {
    return db.voiceProfiles.toArray();
  },

  async getDefault(): Promise<DBVoiceProfile | undefined> {
    return db.voiceProfiles.where('isDefault').equals(true).first();
  },

  async delete(id: string): Promise<void> {
    await db.voiceProfiles.delete(id);
  },

  async setDefault(id: string): Promise<void> {
    // Unset all others
    const profiles = await db.voiceProfiles.toArray();
    await db.voiceProfiles.bulkPut(
      profiles.map(p => ({
        ...p,
        isDefault: p.id === id
      }))
    );
  }
};

// Scheduled Announcement Operations
export const scheduledAnnouncementDB = {
  async create(scheduled: DBScheduledAnnouncement): Promise<string> {
    return db.scheduledAnnouncements.add(scheduled);
  },

  async update(id: string, updates: Partial<DBScheduledAnnouncement>): Promise<void> {
    await db.scheduledAnnouncements.update(id, updates);
  },

  async getById(id: string): Promise<DBScheduledAnnouncement | undefined> {
    return db.scheduledAnnouncements.get(id);
  },

  async getByAnnouncementId(announcementId: string): Promise<DBScheduledAnnouncement[]> {
    return db.scheduledAnnouncements
      .where('announcementId')
      .equals(announcementId)
      .toArray();
  },

  async getUpcoming(): Promise<DBScheduledAnnouncement[]> {
    const now = Date.now();
    return db.scheduledAnnouncements
      .where('scheduledTime')
      .aboveOrEqual(now)
      .toArray();
  },

  async delete(id: string): Promise<void> {
    await db.scheduledAnnouncements.delete(id);
  }
};

// OneDrive File Operations
export const oneDriveFileDB = {
  async create(file: DBOneDriveFile): Promise<string> {
    return db.oneDriveFiles.add(file);
  },

  async update(id: string, updates: Partial<DBOneDriveFile>): Promise<void> {
    await db.oneDriveFiles.update(id, updates);
  },

  async getById(id: string): Promise<DBOneDriveFile | undefined> {
    return db.oneDriveFiles.get(id);
  },

  async getAll(): Promise<DBOneDriveFile[]> {
    return db.oneDriveFiles.toArray();
  },

  async delete(id: string): Promise<void> {
    await db.oneDriveFiles.delete(id);
  },

  async deleteByDriveItemId(driveItemId: string): Promise<void> {
    await db.oneDriveFiles.where('driveItemId').equals(driveItemId).delete();
  }
};

// App State Operations
export const appStateDB = {
  async get(): Promise<DBAppState | undefined> {
    return db.appState.get('state');
  },

  async set(state: DBAppState): Promise<void> {
    await db.appState.put(state);
  },

  async update(updates: Partial<DBAppState>): Promise<void> {
    const current = await this.get();
    if (current) {
      await db.appState.put({
        ...current,
        ...updates,
        key: 'state'
      });
    }
  }
};
