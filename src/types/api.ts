// Microsoft Graph API Types
export interface MSGraphError {
  error: {
    code: string;
    message: string;
  };
}

export interface DriveItem {
  id: string;
  name: string;
  path: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  webUrl: string;
  folder?: unknown;
  file?: unknown;
}

export interface UploadSession {
  uploadUrl: string;
  expirationDateTime: string;
  nextExpectedRanges: string[];
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scopes: string[];
}

export interface UserProfile {
  id: string;
  displayName: string;
  mail: string;
  mobilePhone?: string;
}
