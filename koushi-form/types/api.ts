export interface SubmitResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  sheetRowId?: string;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  fileUrl: string;
  fileId: string;
  error?: string;
}

export interface ZipcodeResponse {
  prefecture: string;
  city: string;
  town: string;
}