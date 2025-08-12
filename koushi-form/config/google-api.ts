import { google } from 'googleapis';
import { GoogleCredentials } from '@/types/google';

export function getGoogleAuth() {
  const credentials: GoogleCredentials = {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    driveFilesFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID!,
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
  };

  const auth = new google.auth.JWT({
    email: credentials.serviceAccountEmail,
    key: credentials.privateKey,
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  return { auth, credentials };
}

export function getDriveClient() {
  const { auth } = getGoogleAuth();
  return google.drive({ version: 'v3', auth });
}

export function getSheetsClient() {
  const { auth } = getGoogleAuth();
  return google.sheets({ version: 'v4', auth });
}