import axios, { AxiosInstance } from 'axios';
import { UserProfile, DriveItem, UploadSession } from '@types/api';

interface MicrosoftGraphConfig {
  accessToken: string;
  refreshToken?: string;
}

export class MicrosoftGraphService {
  private client: AxiosInstance;
  private config: MicrosoftGraphConfig;
  private readonly baseURL = 'https://graph.microsoft.com/v1.0';

  constructor(config: MicrosoftGraphConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await this.client.get<UserProfile>('/me');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error}`);
    }
  }

  /**
   * List files in OneDrive root
   */
  async listRootFiles(): Promise<DriveItem[]> {
    try {
      const response = await this.client.get('/me/drive/root/children');
      return response.data.value || [];
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  /**
   * List files in specific folder
   */
  async listFolderFiles(folderId: string): Promise<DriveItem[]> {
    try {
      const response = await this.client.get(
        `/me/drive/items/${folderId}/children`
      );
      return response.data.value || [];
    } catch (error) {
      throw new Error(`Failed to list folder files: ${error}`);
    }
  }

  /**
   * Search files in OneDrive
   */
  async searchFiles(query: string): Promise<DriveItem[]> {
    try {
      const response = await this.client.get('/me/drive/root/search(q="' + query + '")');
      return response.data.value || [];
    } catch (error) {
      throw new Error(`Failed to search files: ${error}`);
    }
  }

  /**
   * Create folder in OneDrive
   */
  async createFolder(folderName: string, parentId?: string): Promise<DriveItem> {
    try {
      const url = parentId
        ? `/me/drive/items/${parentId}/children`
        : '/me/drive/root/children';

      const response = await this.client.post(url, {
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create folder: ${error}`);
    }
  }

  /**
   * Upload file to OneDrive
   */
  async uploadFile(
    file: File,
    parentId?: string,
    onProgress?: (progress: number) => void
  ): Promise<DriveItem> {
    try {
      const url = parentId
        ? `/me/drive/items/${parentId}:/${file.name}:/content`
        : `/me/drive/root:/${file.name}:/content`;

      const response = await this.client.put(url, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Create upload session for large files
   */
  async createUploadSession(fileName: string, parentId?: string): Promise<UploadSession> {
    try {
      const url = parentId
        ? `/me/drive/items/${parentId}:/${fileName}:/createUploadSession`
        : `/me/drive/root:/${fileName}:/createUploadSession`;

      const response = await this.client.post(url, {
        item: {
          '@microsoft.graph.conflictBehavior': 'rename'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create upload session: ${error}`);
    }
  }

  /**
   * Download file from OneDrive
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await this.client.get(
        `/me/drive/items/${fileId}/content`,
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  /**
   * Delete file from OneDrive
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.client.delete(`/me/drive/items/${fileId}`);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  /**
   * Update access token
   */
  updateToken(accessToken: string): void {
    this.config.accessToken = accessToken;
    this.client.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }
}

export default MicrosoftGraphService;
