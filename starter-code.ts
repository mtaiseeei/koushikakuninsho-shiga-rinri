// ===== types/form.ts =====
export interface SeminarInfo {
  unitName: string;
  unitSlug: string;
  seminarDate: string;
  dayOfWeek: number;
}

export interface Address {
  zipCode: string;
  prefecture: string;
  city: string;
  street: string;
}

export interface SpeakerInfo {
  name: string;
  nameKana: string;
  companyName: string;
  position?: string;
  ethicsGroup?: string;
  ethicsPosition?: string;
  address: Address;
  mobile: string;
  email: string;
}

export interface SpeechInfo {
  theme: string;
  subTheme?: string;
  content: string;
  profile: string;
  ethicsHistory?: string;
  profileImageUrl?: string; // Google Drive URL
}

export interface PresentationStyle {
  handout: 'bring' | 'none' | 'print';
  handoutFileUrl?: string; // Google Drive URL
  projector: 'use' | 'not-use'; // 使用する/使用しない
  projectorDetails?: { // プロジェクター「使用しない」時のみ表示
    device: 'bring' | 'prepare' | 'none'; // スライド投影用のデバイス
    deviceOS?: 'Windows' | 'Mac' | 'iOS' | 'Android';
    cable?: 'HDMI' | 'VGA'; // 15ピン = VGA
  };
  whiteboard: 'use' | 'not-use'; // 使用する/使用しない
}

export interface Accommodation {
  stay: 'none' | 'need-smoking' | 'need-non-smoking'; // 必要なし/必要あり（喫煙）/必要あり（禁煙）
  photography: 'allowed' | 'not-allowed'; // 可/不可
  sns: 'allowed' | 'not-allowed'; // 可/不可
  notes?: string; // その他連絡事項（自由入力）
}

export interface FormData {
  seminarInfo: SeminarInfo;
  speakerInfo: SpeakerInfo;
  speechInfo: SpeechInfo;
  presentationStyle: PresentationStyle;
  accommodation: Accommodation;
}

// ===== フォームのデフォルト値 =====
export const defaultFormData: FormData = {
  seminarInfo: {
    unitName: '',
    unitSlug: '',
    seminarDate: '',
    dayOfWeek: -1,
  },
  speakerInfo: {
    name: '',
    nameKana: '',
    companyName: '',
    position: '',
    ethicsGroup: '',
    ethicsPosition: '',
    address: {
      zipCode: '',
      prefecture: '',
      city: '',
      street: '',
    },
    mobile: '',
    email: '',
  },
  speechInfo: {
    theme: '',
    subTheme: '',
    content: '',
    profile: '',
    ethicsHistory: '',
    profileImageUrl: undefined,
  },
  presentationStyle: {
    handout: 'none',
    handoutFileUrl: undefined,
    projector: 'not-use',
    projectorDetails: undefined,
    whiteboard: 'not-use',
  },
  accommodation: {
    stay: 'none',
    photography: 'allowed',
    sns: 'allowed',
    notes: '',
  },
};

// ===== types/google.ts =====
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

// ===== types/api.ts =====
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

// ===== config/google-api.ts =====
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

// ===== lib/services/google-drive.ts =====
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

// ===== lib/services/google-sheets.ts =====
import { getSheetsClient } from '@/config/google-api';
import { FormData } from '@/types/form';

export class GoogleSheetsService {
  private sheets = getSheetsClient();
  private spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

  async appendFormData(data: FormData): Promise<{ rowId: string }> {
    try {
      const values = [
        [
          new Date().toISOString(), // A: 送信日時
          data.seminarInfo.unitName, // B: 単会名
          data.seminarInfo.seminarDate, // C: 開催日
          data.speakerInfo.name, // D: 講師名
          data.speakerInfo.nameKana, // E: ふりがな
          data.speakerInfo.companyName, // F: 会社名
          data.speakerInfo.position || '', // G: 役職
          data.speakerInfo.ethicsGroup || '', // H: 所属倫理法人会
          data.speakerInfo.ethicsPosition || '', // I: 倫理法人会役職
          data.speakerInfo.address.zipCode, // J: 郵便番号
          data.speakerInfo.address.prefecture, // K: 都道府県
          data.speakerInfo.address.city, // L: 市区町村
          data.speakerInfo.address.street, // M: 番地
          data.speakerInfo.mobile, // N: 携帯電話
          data.speakerInfo.email, // O: メール
          data.speechInfo.theme, // P: テーマ
          data.speechInfo.subTheme || '', // Q: サブテーマ
          data.speechInfo.content, // R: 内容
          data.speechInfo.profile, // S: プロフィール
          data.speechInfo.ethicsHistory || '', // T: 倫理歴
          data.speechInfo.profileImageUrl || '', // U: プロフィール画像URL
          data.presentationStyle.handout, // V: レジュメ種別
          data.presentationStyle.handoutFileUrl || '', // W: レジュメURL
          data.presentationStyle.projector === 'use' ? '使用する' : '使用しない', // X: プロジェクター
          data.presentationStyle.projectorDetails?.device || '', // Y: デバイス
          data.presentationStyle.projectorDetails?.deviceOS || '', // Z: OS
          data.presentationStyle.projectorDetails?.cable || '', // AA: ケーブル
          data.presentationStyle.whiteboard === 'use' ? '使用する' : '使用しない', // AB: ホワイトボード
          data.accommodation.stay === 'none' ? '必要なし' : 
            data.accommodation.stay === 'need-smoking' ? '必要あり（喫煙）' : '必要あり（禁煙）', // AC: 宿泊
          data.accommodation.photography === 'allowed' ? '可' : '不可', // AD: 写真撮影
          data.accommodation.sns === 'allowed' ? '可' : '不可', // AE: SNS投稿
          data.accommodation.notes || '', // AF: その他
        ],
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:AF',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      return {
        rowId: response.data.updates?.updatedRange || 'unknown',
      };
    } catch (error) {
      console.error('Google Sheets append error:', error);
      throw error;
    }
  }
}

// ===== app/api/upload/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/services/google-drive';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'profile' | 'handout';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を生成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const unitSlug = formData.get('unitSlug') as string;
    const speakerName = formData.get('speakerName') as string;
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${unitSlug}_${speakerName}${
      type === 'handout' ? '_レジュメ' : ''
    }.${extension}`;

    // Google Driveにアップロード
    const driveService = new GoogleDriveService();
    const folderName = type === 'profile' ? 'プロフィール画像' : 'レジュメ';
    const result = await driveService.uploadFile(
      buffer,
      fileName,
      file.type,
      folderName
    );

    return NextResponse.json({
      success: true,
      fileUrl: result.fileUrl,
      fileId: result.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
}

// ===== app/api/submit/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/google-sheets';
import { FormData } from '@/types/form';

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Google Sheetsにデータを追加
    const sheetsService = new GoogleSheetsService();
    const result = await sheetsService.appendFormData(data);

    return NextResponse.json({
      success: true,
      message: '講師確認書を送信しました',
      sheetRowId: result.rowId,
      submissionId: `${data.seminarInfo.unitSlug}-${Date.now()}`,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '送信に失敗しました。もう一度お試しください。' 
      },
      { status: 500 }
    );
  }
}

// ===== lib/hooks/useFileUpload.ts =====
import { useState } from 'react';
import axios from 'axios';

interface UseFileUploadOptions {
  type: 'profile' | 'handout';
  unitSlug: string;
  speakerName: string;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', options.type);
      formData.append('unitSlug', options.unitSlug);
      formData.append('speakerName', options.speakerName);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.fileUrl;
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'アップロードに失敗しました';
      setUploadError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadError,
  };
}