export interface GoogleDriveUploadResponse {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  error?: string;
}

export interface GoogleSheetsAppendResponse {
  success: boolean;
  rowId?: string;
  error?: string;
}

export interface GoogleCredentials {
  serviceAccountEmail: string;
  privateKey: string;
  driveFilesFolderId: string;
  spreadsheetId: string;
}