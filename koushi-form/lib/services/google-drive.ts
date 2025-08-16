import { getDriveClient } from '@/config/google-api';
import { Readable } from 'stream';

/**
 * Google Driveにファイルをアップロード
 */
export async function uploadToDrive(
  file: Buffer,
  fileName: string,
  mimeType: string,
  folder?: string
): Promise<string> {
  try {
    console.log('アップロード処理開始:', { fileName, mimeType, fileSize: file.length });
    
    const drive = await getDriveClient();
    const folderId = folder || process.env.GOOGLE_DRIVE_FOLDER_ID;
    const isSharedDrive = process.env.GOOGLE_DRIVE_IS_SHARED === 'true';

    if (!folderId) {
      throw new Error('Google DriveのフォルダIDが設定されていません');
    }
    
    console.log('フォルダID:', folderId);
    console.log('共有ドライブ使用:', isSharedDrive);

    // ファイルメタデータ
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // ファイルをアップロード
    console.log('ファイルアップロード実行中...');
    const createParams: any = {
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: Readable.from(file),
      },
      fields: 'id, webViewLink, webContentLink',
    };
    
    // 共有ドライブの場合、supportsAllDrivesパラメータを追加
    if (isSharedDrive) {
      createParams.supportsAllDrives = true;
    }
    
    const response = await drive.files.create(createParams);
    
    console.log('アップロードレスポンス:', response.data);

    if (!response.data.id) {
      throw new Error('ファイルのアップロードに失敗しました');
    }

    // ファイルを共有設定（リンクを知っている人が閲覧可能）
    console.log('共有設定を変更中...');
    const permissionParams: any = {
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    };
    
    // 共有ドライブの場合、supportsAllDrivesパラメータを追加
    if (isSharedDrive) {
      permissionParams.supportsAllDrives = true;
    }
    
    try {
      await drive.permissions.create(permissionParams);
      console.log('共有設定完了');
    } catch (permError) {
      console.warn('共有設定エラー（ファイルは正常にアップロードされました）:', permError);
      // 共有設定が失敗しても、ファイルはアップロードされているので続行
    }

    // 共有可能なリンクを取得
    const fileLink = `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`;
    console.log('生成されたファイルURL:', fileLink);
    
    return fileLink;
  } catch (error) {
    console.error('Google Driveアップロードエラー:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
      console.error('スタックトレース:', error.stack);
      
      // サービスアカウントのストレージ制限エラーの場合
      if (error.message.includes('Service Accounts do not have storage quota')) {
        throw new Error(
          'サービスアカウントのストレージ制限により、ファイルをアップロードできません。' +
          '共有ドライブを使用するか、フォルダの共有権限を確認してください。'
        );
      }
    }
    throw new Error('ファイルのアップロードに失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
  }
}

/**
 * ファイル名を生成（単会名_講師名_日時_ファイル種別）
 */
export function generateFileName(
  unitSlug: string,
  speakerName: string,
  fileType: 'profile' | 'handout',
  originalName: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = originalName.split('.').pop() || '';
  const sanitizedName = speakerName.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龯]/g, '_');
  
  return `${unitSlug}_${sanitizedName}_${timestamp}_${fileType}.${extension}`;
}