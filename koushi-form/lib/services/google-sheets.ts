import { getSheetsClient } from '@/config/google-api';
import { KoushiFormData } from '@/types/form';

/**
 * フォームデータをGoogle Sheetsに追加
 */
export async function appendToSheet(formData: KoushiFormData): Promise<void> {
  try {
    console.log('Google Sheetsへのデータ送信開始');
    console.log('プロフィール画像URL:', formData.speechInfo.profileImageUrl);
    console.log('レジュメファイルURL:', formData.presentationStyle.handoutFileUrl);
    
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      throw new Error('Google SheetsのIDが設定されていません');
    }

    // 現在のタイムスタンプ
    const timestamp = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // スプレッドシートに追加するデータを配列形式で準備
    const values = [[
      timestamp,                                          // A: タイムスタンプ
      formData.seminarInfo.unitName,                     // B: 単会名
      formData.seminarInfo.seminarDate,                  // C: セミナー日付
      getDayOfWeekString(formData.seminarInfo.dayOfWeek), // D: 曜日
      formData.speakerInfo.name,                         // E: 講師名
      formData.speakerInfo.nameKana,                     // F: 講師名（ふりがな）
      formData.speakerInfo.companyName,                  // G: 会社名/団体名
      formData.speakerInfo.position || '',               // H: 役職・肩書
      formData.speakerInfo.ethicsGroup || '',           // I: 所属倫理法人会
      formData.speakerInfo.ethicsPosition || '',         // J: 倫理法人会役職
      formData.speakerInfo.address.zipCode,              // K: 郵便番号
      formData.speakerInfo.address.prefecture,           // L: 都道府県
      formData.speakerInfo.address.city,                 // M: 市区町村
      formData.speakerInfo.address.street,               // N: 番地
      formData.speakerInfo.address.buildingName || '',   // O: 建物名
      formData.speakerInfo.mobile,                       // P: 携帯電話
      formData.speakerInfo.email,                        // Q: Email
      formData.speechInfo.theme,                         // R: テーマ
      formData.speechInfo.subTheme || '',                // S: サブテーマ
      formData.speechInfo.content,                       // T: 講話内容
      formData.speechInfo.profile,                       // U: プロフィール
      formData.speechInfo.ethicsHistory || '',           // V: 倫理歴
      formData.speechInfo.profileImageUrl || '',         // W: プロフィール画像URL
      getHandoutText(formData.presentationStyle.handout), // X: レジュメ
      formData.presentationStyle.handoutFileUrl || '',   // Y: レジュメファイルURL
      getProjectorText(formData.presentationStyle.projector), // Z: プロジェクター使用
      formData.presentationStyle.projectorDetails?.device || '', // AA: デバイス
      formData.presentationStyle.projectorDetails?.deviceOS || '', // AB: デバイスOS
      formData.presentationStyle.projectorDetails?.cable || '',    // AC: ケーブル
      getWhiteboardText(formData.presentationStyle.whiteboard),     // AD: ホワイトボード
      getStayText(formData.accommodation.stay),          // AE: 宿泊
      getPermissionText(formData.accommodation.photography), // AF: 写真撮影
      getPermissionText(formData.accommodation.sns),     // AG: SNS投稿
      formData.accommodation.notes || '',                // AH: その他連絡事項
    ]];

    // データを追加
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:AH', // A列からAH列まで
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Google Sheetsへのデータ追加が完了しました');
    console.log('追加された行:', response.data.updates?.updatedRange);
  } catch (error) {
    console.error('Google Sheetsエラー:', error);
    throw new Error('データの送信に失敗しました');
  }
}

// ヘルパー関数群
function getDayOfWeekString(day: number): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[day] + '曜日';
}

function getHandoutText(value: string): string {
  const map: Record<string, string> = {
    'bring': 'あり（ご持参）',
    'none': 'なし',
    'print': 'あり（当単会でプリント）',
  };
  return map[value] || value;
}

function getProjectorText(value: string): string {
  const map: Record<string, string> = {
    'use': '使用する',
    'not-use': '使用しない',
  };
  return map[value] || value;
}

function getWhiteboardText(value: string): string {
  const map: Record<string, string> = {
    'use': '使用する',
    'not-use': '使用しない',
  };
  return map[value] || value;
}

function getStayText(value: string): string {
  const map: Record<string, string> = {
    'none': '必要なし',
    'need-smoking': '必要あり（喫煙）',
    'need-non-smoking': '必要あり（禁煙）',
  };
  return map[value] || value;
}

function getPermissionText(value: string): string {
  const map: Record<string, string> = {
    'allowed': '可',
    'not-allowed': '不可',
  };
  return map[value] || value;
}