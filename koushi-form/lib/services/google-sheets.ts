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
          data.speakerInfo.address.buildingName || '', // N: 建物名
          data.speakerInfo.mobile, // O: 携帯電話
          data.speakerInfo.email, // P: メール
          data.speechInfo.theme, // Q: テーマ
          data.speechInfo.subTheme || '', // R: サブテーマ
          data.speechInfo.content, // S: 内容
          data.speechInfo.profile, // T: プロフィール
          data.speechInfo.ethicsHistory || '', // U: 倫理歴
          data.speechInfo.profileImageUrl || '', // V: プロフィール画像URL
          data.presentationStyle.handout, // W: レジュメ種別
          data.presentationStyle.handoutFileUrl || '', // X: レジュメURL
          data.presentationStyle.projector === 'use' ? '使用する' : '使用しない', // Y: プロジェクター
          data.presentationStyle.projectorDetails?.device || '', // Z: デバイス
          data.presentationStyle.projectorDetails?.deviceOS || '', // AA: OS
          data.presentationStyle.projectorDetails?.cable || '', // AB: ケーブル
          data.presentationStyle.whiteboard === 'use' ? '使用する' : '使用しない', // AC: ホワイトボード
          data.accommodation.stay === 'none' ? '必要なし' : 
            data.accommodation.stay === 'need-smoking' ? '必要あり（喫煙）' : '必要あり（禁煙）', // AD: 宿泊
          data.accommodation.photography === 'allowed' ? '可' : '不可', // AE: 写真撮影
          data.accommodation.sns === 'allowed' ? '可' : '不可', // AF: SNS投稿
          data.accommodation.notes || '', // AG: その他
        ],
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:AG',
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