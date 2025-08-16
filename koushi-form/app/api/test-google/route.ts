import { NextResponse } from 'next/server';
import { getDriveClient, getSheetsClient } from '@/config/google-api';

export async function GET() {
  try {
    // 環境変数の確認
    const envCheck = {
      hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      hasDriveFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
      driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      hasSheetsId: !!process.env.GOOGLE_SHEETS_ID,
      sheetsId: process.env.GOOGLE_SHEETS_ID,
    };

    console.log('環境変数チェック:', envCheck);

    // Google Drive接続テスト
    const drive = await getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_IDが設定されていません');
    }

    // フォルダ情報を取得してアクセス確認
    const folderInfo = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType'
    });

    console.log('Google Driveフォルダ情報:', folderInfo.data);

    // Google Sheets接続テスト
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_IDが設定されていません');
    }

    // スプレッドシート情報を取得
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    console.log('Google Sheets情報:', {
      title: sheetInfo.data.properties?.title,
      sheetsCount: sheetInfo.data.sheets?.length
    });

    return NextResponse.json({
      success: true,
      message: 'Google API接続テスト成功',
      drive: {
        folderId: folderInfo.data.id,
        folderName: folderInfo.data.name,
      },
      sheets: {
        spreadsheetId: spreadsheetId,
        title: sheetInfo.data.properties?.title,
      },
      envCheck
    });
  } catch (error) {
    console.error('Google API接続エラー:', error);
    
    let errorMessage = 'Google API接続テストに失敗しました';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      if (error.message.includes('invalid_grant')) {
        errorMessage = 'Service Account認証に失敗しました。秘密鍵を確認してください。';
      } else if (error.message.includes('Permission denied')) {
        errorMessage = 'アクセス権限がありません。Service AccountをGoogle DriveとSheetsに共有してください。';
      } else if (error.message.includes('not found')) {
        errorMessage = 'フォルダまたはスプレッドシートが見つかりません。IDを確認してください。';
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: errorDetails,
      envCheck: {
        hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasDriveFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
        hasSheetsId: !!process.env.GOOGLE_SHEETS_ID,
      }
    }, { status: 500 });
  }
}