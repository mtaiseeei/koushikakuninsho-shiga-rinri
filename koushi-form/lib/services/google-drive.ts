import { getDriveClient } from '@/config/google-api';
import { Readable } from 'stream';

export class GoogleDriveService {
  private drive = getDriveClient();
  private baseFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folderName: 'プロフィール画像' | 'レジュメ'
  ): Promise<{ fileId: string; fileUrl: string }> {
    try {
      // サブフォルダーを取得または作成
      const folderId = await this.getOrCreateFolder(folderName);

      // ファイルをアップロード
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType,
          body: Readable.from(file),
        },
        fields: 'id, webViewLink',
      });

      if (!response.data.id || !response.data.webViewLink) {
        throw new Error('ファイルアップロードに失敗しました');
      }

      // ファイルを公開設定
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          type: 'anyone',
          role: 'reader',
        },
      });

      return {
        fileId: response.data.id,
        fileUrl: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw error;
    }
  }

  private async getOrCreateFolder(folderName: string): Promise<string> {
    // フォルダーが存在するか確認
    const response = await this.drive.files.list({
      q: `name='${folderName}' and '${this.baseFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    // フォルダーを作成
    const createResponse = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.baseFolderId],
      },
      fields: 'id',
    });

    return createResponse.data.id!;
  }
}