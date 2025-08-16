import { google } from 'googleapis';

/**
 * Google APIの認証設定
 */
export function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  // デバッグ用ログ
  console.log('認証情報チェック:', {
    hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasPrivateKey: !!privateKey,
    hasDriveFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
    hasSheetsId: !!process.env.GOOGLE_SHEETS_ID,
    isSharedDrive: process.env.GOOGLE_DRIVE_IS_SHARED,
  });
  
  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.error('環境変数が不足しています');
    throw new Error('Google認証情報が設定されていません。.env.localファイルを確認してください。');
  }

  try {
    // JWT認証を使用
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    return auth;
  } catch (error) {
    console.error('JWT認証の作成に失敗:', error);
    throw new Error('Google API認証の初期化に失敗しました');
  }
}

/**
 * Google Drive APIクライアントを取得
 */
export async function getDriveClient() {
  try {
    const auth = getGoogleAuth();
    await auth.authorize();
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Drive APIクライアントの初期化エラー:', error);
    throw new Error('Google Drive APIの初期化に失敗しました');
  }
}

/**
 * Google Sheets APIクライアントを取得
 */
export async function getSheetsClient() {
  try {
    const auth = getGoogleAuth();
    await auth.authorize();
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Sheets APIクライアントの初期化エラー:', error);
    throw new Error('Google Sheets APIの初期化に失敗しました');
  }
}