import JSZip from 'jszip';
import { Project, Announcement } from '@types/index';

interface ProjectExportPackage {
  project: Project;
  announcements: Announcement[];
  audioFiles: { announcementId: string; blob: Blob }[];
  includeWavMasters: boolean;
}

export class ZipExportService {
  /**
   * Export project and audio files as ZIP
   */
  async createProjectZip(data: ProjectExportPackage): Promise<Blob> {
    const zip = new JSZip();

    // Add project metadata
    const projectMetadata = {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      version: data.project.version,
      createdAt: data.project.createdAt,
      updatedAt: data.project.updatedAt,
      voiceProfileId: data.project.voiceProfileId,
      announcementCount: data.announcements.length
    };

    zip.file('project.json', JSON.stringify(projectMetadata, null, 2));

    // Add announcements
    const announcementsData = data.announcements.map(a => ({
      id: a.id,
      text: a.text,
      order: a.order,
      duration: a.duration,
      settings: a.settings,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }));

    zip.file('announcements.json', JSON.stringify(announcementsData, null, 2));

    // Add audio files
    const audioFolder = zip.folder('audio');
    if (audioFolder) {
      for (const audioFile of data.audioFiles) {
        audioFolder.file(`${audioFile.announcementId}.mp3`, audioFile.blob);
      }
    }

    // Add WAV masters if requested
    if (data.includeWavMasters && data.audioFiles.length > 0) {
      const wavFolder = zip.folder('wav-masters');
      if (wavFolder) {
        for (const audioFile of data.audioFiles) {
          // In production, you'd have the WAV files
          wavFolder.file(`${audioFile.announcementId}.wav`, audioFile.blob);
        }
      }
    }

    return zip.generateAsync({ type: 'blob' });
  }

  /**
   * Export announcement as ZIP with single audio file
   */
  async createAnnouncementZip(
    announcement: Announcement,
    audioBlob: Blob,
    format: string
  ): Promise<Blob> {
    const zip = new JSZip();

    // Add announcement metadata
    const metadata = {
      id: announcement.id,
      text: announcement.text,
      duration: announcement.duration,
      format: format,
      exportedAt: new Date().toISOString()
    };

    zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    zip.file(`announcement.${format}`, audioBlob);

    return zip.generateAsync({ type: 'blob' });
  }

  /**
   * Extract ZIP contents
   */
  async extractZip(zipBlob: Blob): Promise<Map<string, Blob>> {
    const zip = await JSZip.loadAsync(zipBlob);
    const files = new Map<string, Blob>();

    for (const [path, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const blob = await file.async('blob');
        files.set(path, blob);
      }
    }

    return files;
  }
}

export default ZipExportService;
