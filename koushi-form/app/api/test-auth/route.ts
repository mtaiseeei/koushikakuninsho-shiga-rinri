import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // 環境変数の詳細確認
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const sheetsId = process.env.GOOGLE_SHEETS_ID;

    console.log('Service Account Email:', serviceAccountEmail);
    console.log('Private Key Length:', privateKey?.length);
    console.log('Folder ID:', folderId);
    console.log('Sheets ID:', sheetsId);

    if (!serviceAccountEmail || !privateKey) {
      return NextResponse.json({
        success: false,
        error: '認証情報が不足しています',
        hasEmail: !!serviceAccountEmail,
        hasKey: !!privateKey
      });
    }

    // JWT認証を直接作成
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // 認証のテスト
    console.log('認証テスト開始...');
    const authClient = await auth.authorize();
    console.log('認証成功！Access Token取得');

    // Drive APIを使用してアクセステスト
    const drive = google.drive({ version: 'v3', auth });
    
    // まず、アクセス可能なファイル一覧を取得
    console.log('アクセス可能なファイル一覧取得中...');
    const fileList = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType)',
    });

    console.log('アクセス可能なファイル数:', fileList.data.files?.length || 0);

    // フォルダへのアクセスを試みる（エラーを詳細に取得）
    if (folderId) {
      console.log(`フォルダID ${folderId} へのアクセスを試みます...`);
      try {
        const folder = await drive.files.get({
          fileId: folderId,
          fields: 'id, name, mimeType, permissions'
        });
        console.log('フォルダアクセス成功:', folder.data);
      } catch (folderError: any) {
        console.error('フォルダアクセスエラー:', {
          message: folderError.message,
          code: folderError.code,
          errors: folderError.errors
        });
      }
    }

    // Sheets APIテスト
    if (sheetsId) {
      console.log(`スプレッドシートID ${sheetsId} へのアクセスを試みます...`);
      const sheets = google.sheets({ version: 'v4', auth });
      try {
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: sheetsId,
        });
        console.log('スプレッドシートアクセス成功:', spreadsheet.data.properties?.title);
      } catch (sheetsError: any) {
        console.error('スプレッドシートアクセスエラー:', {
          message: sheetsError.message,
          code: sheetsError.code,
          errors: sheetsError.errors
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: '認証テスト成功',
      serviceAccountEmail: serviceAccountEmail,
      accessibleFiles: fileList.data.files?.map(f => ({
        id: f.id,
        name: f.name,
        type: f.mimeType
      })) || [],
      fileCount: fileList.data.files?.length || 0
    });

  } catch (error: any) {
    console.error('認証テストエラー:', error);
    return NextResponse.json({
      success: false,
      error: '認証テスト失敗',
      detail: error.message,
      errorCode: error.code,
      errors: error.errors
    }, { status: 500 });
  }
}