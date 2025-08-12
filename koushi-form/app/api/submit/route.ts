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